import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sapologie.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrateur Principal';

export async function GET() {
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Vérifier si la table admins existe
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'admins'"
    ) as any[];

    // Créer la table si elle n'existe pas
    if (!Array.isArray(tables) || tables.length === 0) {
      console.log('📝 Création de la table admins...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(200) NOT NULL,
          is_super_admin BOOLEAN DEFAULT FALSE,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Table admins créée');
    }

    // Vérifier si un admin existe déjà
    const [admins] = await connection.query(
      'SELECT id, email FROM admins WHERE email = ?',
      [ADMIN_EMAIL]
    ) as any[];

    if (!Array.isArray(admins) || admins.length === 0) {
      // Hasher le mot de passe
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Créer l'admin
      await connection.query(
        'INSERT INTO admins (email, password_hash, full_name, is_super_admin) VALUES (?, ?, ?, ?)',
        [ADMIN_EMAIL, hashedPassword, ADMIN_NAME, true]
      );

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Administrateur créé avec succès',
        data: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          warning: '⚠️ Changez ce mot de passe après la première connexion !'
        }
      });
    } else {
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: 'Un administrateur existe déjà',
        data: {
          email: admins[0].email
        }
      });
    }

  } catch (error: any) {
    await connection.rollback();
    console.error('Erreur lors de l\'initialisation:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erreur lors de l\'initialisation de l\'administrateur',
      error: error.message
    }, { status: 500 });
    
  } finally {
    connection.release();
  }
}
