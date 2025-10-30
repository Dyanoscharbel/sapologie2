import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { getCountryByName } from '@/lib/countries';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_long_et_securise';
const SALT_ROUNDS = 10;

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    country?: string;
    phone?: string;
    pseudo?: string;
  }) {
    const { email, password, first_name, last_name, country, phone, pseudo } = userData;
    
    // Vérifier si l'email existe déjà
    const existingUsers = await query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (existingUsers.length > 0) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Générer un username (pseudo, ou sinon basé sur l'email)
    const username = pseudo || email.split('@')[0];

    // Récupérer les infos du pays (code + prefix)
    let countryCode = null;
    if (country) {
      const countryData = getCountryByName(country);
      if (countryData) {
        // Stocker le format: "MA|+212" (code|prefix)
        countryCode = `${countryData.code}|${countryData.prefix}`;
      }
    }

    // Créer l'utilisateur - le numéro phone est utilisé aussi comme WhatsApp
    const result = await query(
      'INSERT INTO users (username, email, password_hash, first_name, last_name, country, country_code, phone, whatsapp, pseudo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, first_name, last_name, country || null, countryCode || null, phone || null, phone || null, pseudo || null]
    ) as any;

    const userId = result.insertId;

    // Créer un token JWT
    const token = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      userId,
      token,
    };
  }

  static async login(email: string, password: string) {
    // D'abord, vérifier si c'est un admin
    const admins = await query(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    ) as any[];

    if (admins.length > 0) {
      const admin = admins[0];
      
      // Vérifier le mot de passe admin
      const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Mettre à jour la dernière connexion
      await query(
        'UPDATE admins SET last_login = NOW() WHERE id = ?',
        [admin.id]
      );

      // Créer un token JWT avec le rôle admin
      const token = jwt.sign({ 
        userId: admin.id, 
        role: 'admin',
        isAdmin: true 
      }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Ne pas renvoyer le mot de passe
      const { password_hash, ...adminWithoutPassword } = admin;

      return {
        user: {
          ...adminWithoutPassword,
          role: 'admin',
          isAdmin: true
        },
        token,
        role: 'admin',
        redirectTo: '/admin'
      };
    }

    // Sinon, vérifier si c'est un utilisateur normal
    const users = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any[];

    if (users.length === 0) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const user = users[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Créer un token JWT avec le rôle user
    const token = jwt.sign({ 
      userId: user.id, 
      role: 'user',
      isAdmin: false 
    }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Ne pas renvoyer le mot de passe
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        role: 'user',
        isAdmin: false
      },
      token,
      role: 'user',
      redirectTo: '/dashboard'
    };
  }

  static async getCurrentUser(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role?: string; isAdmin?: boolean };
      
      // Si c'est un admin
      if (decoded.role === 'admin' || decoded.isAdmin) {
        const admins = await query(
          'SELECT id, email, full_name, is_super_admin FROM admins WHERE id = ?',
          [decoded.userId]
        ) as any[];

        if (admins.length > 0) {
          return {
            ...admins[0],
            role: 'admin',
            isAdmin: true
          };
        }
      }
      
      // Sinon c'est un utilisateur normal
      const users = await query(
        'SELECT id, email, first_name, last_name, avatar_base64 FROM users WHERE id = ?',
        [decoded.userId]
      ) as any[];

      if (users.length > 0) {
        return {
          ...users[0],
          role: 'user',
          isAdmin: false
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  static async updateUser(userId: number, updates: any) {
    const allowedFields = ['first_name', 'last_name', 'avatar_base64'];
    const updateFields = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => `${key} = ?`);

    if (updateFields.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    const values = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .map(key => updates[key]);

    await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      [...values, userId]
    );

    return true;
  }
}
