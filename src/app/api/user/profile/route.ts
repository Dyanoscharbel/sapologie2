import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

// GET - Récupérer le profil de l'utilisateur connecté
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
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les infos complètes de l'utilisateur
    const users = await query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.avatar_base64,
        u.created_at,
        u.is_active,
        p.id as participant_id,
        p.stage_name,
        p.bio,
        p.is_approved,
        p.category,
        p.location,
        p.age
      FROM users u
      LEFT JOIN participants p ON u.id = p.user_id
      WHERE u.id = ?
    `, [user.id]) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = users[0];

    // Compter les votes si participant
    let votesCount = 0;
    if (userData.participant_id) {
      const votes = await query(
        'SELECT COUNT(*) as total FROM votes WHERE participant_id = ?',
        [userData.participant_id]
      ) as any[];
      votesCount = votes[0]?.total || 0;
    }

    // Récupérer les médias si participant
    let media = [];
    if (userData.participant_id) {
      media = await query(`
        SELECT 
          id,
          media_type,
          media_data,
          file_name,
          is_primary,
          position,
          created_at
        FROM media
        WHERE participant_id = ?
        ORDER BY position ASC, created_at DESC
      `, [userData.participant_id]) as any[];
    }

    // Récupérer les liens sociaux si participant
    let socialLinks = [];
    if (userData.participant_id) {
      socialLinks = await query(`
        SELECT id, platform, username, url
        FROM social_links
        WHERE participant_id = ?
        ORDER BY id ASC
      `, [userData.participant_id]) as any[];
    }

    // Déterminer le statut
    let status = 'user'; // Par défaut
    if (userData.participant_id) {
      status = userData.is_approved ? 'approved' : 'pending';
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
        name: `${userData.first_name} ${userData.last_name}`,
        avatarBase64: userData.avatar_base64,
        createdAt: new Date(userData.created_at).toLocaleDateString('fr-FR'),
        isActive: userData.is_active,
        status,
        participant: userData.participant_id ? {
          id: userData.participant_id,
          stageName: userData.stage_name,
          bio: userData.bio,
          isApproved: userData.is_approved,
          category: userData.category,
          location: userData.location,
          age: userData.age,
          votesCount: votesCount,
          media: media.map((m: any) => ({
            id: m.id,
            type: m.media_type,
            base64: m.media_data,
            fileName: m.file_name,
            isPrimary: m.is_primary,
            position: m.position
          })),
          socialLinks: socialLinks.map((link: any) => ({
            id: link.id,
            platform: link.platform,
            username: link.username,
            url: link.url
          }))
        } : null
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour le profil utilisateur
export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = await AuthService.getCurrentUser(token);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email,
      password,
      avatarBase64,
      participant,
      socialLinks
    } = body;

    // Mettre à jour les informations de l'utilisateur
    if (firstName || lastName || email || password || avatarBase64 !== undefined) {
      const updates = [];
      const values = [];

      if (firstName) {
        updates.push('first_name = ?');
        values.push(firstName);
      }
      if (lastName) {
        updates.push('last_name = ?');
        values.push(lastName);
      }
      if (email) {
        // Vérifier si l'email existe déjà
        const existingUsers = await query(
          'SELECT id FROM users WHERE email = ? AND id != ?',
          [email, user.id]
        ) as any[];
        
        if (existingUsers.length > 0) {
          return NextResponse.json(
            { success: false, message: 'Cet email est déjà utilisé' },
            { status: 400 }
          );
        }
        
        updates.push('email = ?');
        values.push(email);
      }
      if (password) {
        // Hasher le nouveau mot de passe
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push('password_hash = ?');
        values.push(hashedPassword);
      }
      if (avatarBase64 !== undefined) {
        updates.push('avatar_base64 = ?');
        values.push(avatarBase64);
      }

      if (updates.length > 0) {
        values.push(user.id);
        await query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }
    }

    // Mettre à jour les informations du participant si présentes
    if (participant) {
      const { stageName, bio, location, age } = participant;

      // Vérifier si l'utilisateur a déjà un profil participant
      const participants = await query(
        'SELECT id FROM participants WHERE user_id = ?',
        [user.id]
      ) as any[];

      if (participants.length > 0) {
        const participantId = participants[0].id;
        
        // Mettre à jour le participant existant (sans la catégorie)
        const updates = [];
        const values = [];

        if (stageName) {
          updates.push('stage_name = ?');
          values.push(stageName);
        }
        if (bio !== undefined) {
          updates.push('bio = ?');
          values.push(bio);
        }
        if (location !== undefined) {
          updates.push('location = ?');
          values.push(location);
        }
        if (age !== undefined) {
          updates.push('age = ?');
          values.push(age);
        }

        if (updates.length > 0) {
          values.push(participantId);
          await query(
            `UPDATE participants SET ${updates.join(', ')} WHERE id = ?`,
            values
          );
        }
        
        // Gérer les liens sociaux
        if (socialLinks !== undefined) {
          // Supprimer les anciens liens
          await query(
            'DELETE FROM social_links WHERE participant_id = ?',
            [participantId]
          );
          
          // Ajouter les nouveaux liens
          if (socialLinks && socialLinks.length > 0) {
            for (const link of socialLinks) {
              if (link.platform && link.url) {
                await query(
                  'INSERT INTO social_links (participant_id, platform, username, url) VALUES (?, ?, ?, ?)',
                  [participantId, link.platform, link.username || '', link.url]
                );
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
