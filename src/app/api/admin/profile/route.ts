import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';
import bcrypt from 'bcryptjs';

// GET - Récupérer le profil de l'admin connecté
export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await AuthService.getCurrentUser(token);
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès refusé' },
        { status: 403 }
      );
    }

    // Récupérer les infos complètes de l'admin
    const admins = await query(
      'SELECT id, email, full_name, is_super_admin, last_login, created_at FROM admins WHERE id = ?',
      [user.id]
    ) as any[];

    if (admins.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Admin non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: admins[0]
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le profil de l'admin
export async function PATCH(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await AuthService.getCurrentUser(token);
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Accès refusé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { full_name, email, current_password, new_password } = body;

    // Si changement de mot de passe, vérifier le mot de passe actuel
    if (new_password) {
      if (!current_password) {
        return NextResponse.json(
          { success: false, message: 'Le mot de passe actuel est requis' },
          { status: 400 }
        );
      }

      // Vérifier le mot de passe actuel
      const admins = await query(
        'SELECT password_hash FROM admins WHERE id = ?',
        [user.id]
      ) as any[];

      if (admins.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Admin non trouvé' },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(current_password, admins[0].password_hash);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'Mot de passe actuel incorrect' },
          { status: 400 }
        );
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Mettre à jour avec le nouveau mot de passe
      await query(
        'UPDATE admins SET full_name = ?, email = ?, password_hash = ? WHERE id = ?',
        [full_name, email, hashedPassword, user.id]
      );
    } else {
      // Mettre à jour sans changer le mot de passe
      await query(
        'UPDATE admins SET full_name = ?, email = ? WHERE id = ?',
        [full_name, email, user.id]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    // Gérer les erreurs de duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
