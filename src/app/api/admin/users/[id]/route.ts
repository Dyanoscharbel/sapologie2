import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification admin
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

    const { id } = await params;
    const userId = parseInt(id);

    // Récupérer l'utilisateur avec ses informations de participant
    const users = await query(`
      SELECT 
        u.id,
        u.email,
        u.username,
        u.first_name,
        u.last_name,
        u.country,
        u.country_code,
        u.phone,
        u.whatsapp,
        u.pseudo,
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
    `, [userId]) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const userData = users[0];

    // Récupérer les médias du participant
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

    // Récupérer les votes reçus
    let votesCount = 0;
    if (userData.participant_id) {
      const voteResult = await query(`
        SELECT COUNT(*) as total
        FROM votes
        WHERE participant_id = ?
      `, [userData.participant_id]) as any[];
      votesCount = voteResult[0]?.total || 0;
    }

    // Formater les données
    const formattedUser = {
      id: userData.id,
      name: userData.first_name && userData.last_name 
        ? `${userData.first_name} ${userData.last_name}` 
        : userData.email.split('@')[0],
      email: userData.email,
      username: userData.username,
      firstName: userData.first_name,
      lastName: userData.last_name,
      country: userData.country,
      countryCode: userData.country_code,
      phone: userData.phone,
      whatsapp: userData.whatsapp,
      pseudo: userData.pseudo,
      avatarBase64: userData.avatar_base64,
      createdAt: new Date(userData.created_at).toLocaleDateString('fr-FR'),
      isActive: userData.is_active,
      participant: userData.participant_id ? {
        id: userData.participant_id,
        stageName: userData.stage_name,
        bio: userData.bio,
        isApproved: Boolean(userData.is_approved),
        category: userData.category,
        location: userData.location,
        age: userData.age,
        votesCount: votesCount,
        media: media.map(m => ({
          id: m.id,
          type: m.media_type,
          base64: m.media_data,
          fileName: m.file_name,
          isPrimary: Boolean(m.is_primary),
          position: m.position
        }))
      } : null,
      status: userData.participant_id ? (userData.is_approved === 1 ? 'approved' : 'pending') : 'user'
    };

    return NextResponse.json({
      success: true,
      data: formattedUser
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// API pour créer/approuver un participant
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification admin
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

    const { id } = await params;
    const userId = parseInt(id);
    const body = await request.json();

    // Vérifier si l'utilisateur existe
    const users = await query(`SELECT id FROM users WHERE id = ?`, [userId]) as any[];
    
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si un participant existe déjà
    const participants = await query(`
      SELECT id FROM participants WHERE user_id = ?
    `, [userId]) as any[];

    let participantId;

    if (participants.length === 0) {
      // Créer un nouveau participant
      const result = await query(`
        INSERT INTO participants (
          user_id, 
          stage_name, 
          bio, 
          category,
          location,
          age,
          is_approved
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        body.stageName || 'Participant',
        body.bio || '',
        body.category || null,
        body.location || null,
        body.age || null,
        body.isApproved ? 1 : 0
      ]) as any;
      
      participantId = result.insertId;
      
      return NextResponse.json({
        success: true,
        message: 'Participant créé et ' + (body.isApproved ? 'approuvé' : 'en attente'),
        participantId
      });
    } else {
      // Mettre à jour le participant existant
      participantId = participants[0].id;
      
      await query(`
        UPDATE participants 
        SET is_approved = ?,
            stage_name = COALESCE(?, stage_name),
            bio = COALESCE(?, bio),
            category = COALESCE(?, category),
            location = COALESCE(?, location),
            age = COALESCE(?, age)
        WHERE id = ?
      `, [
        body.isApproved ? 1 : 0,
        body.stageName,
        body.bio,
        body.category,
        body.location,
        body.age,
        participantId
      ]);

      return NextResponse.json({
        success: true,
        message: body.isApproved ? 'Participant approuvé' : 'Approbation retirée'
      });
    }

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// API pour supprimer un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification admin
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

    const { id } = await params;
    const userId = parseInt(id);

    // Vérifier si l'utilisateur existe
    const users = await query(`SELECT id FROM users WHERE id = ?`, [userId]) as any[];
    
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer l'utilisateur (le participant sera supprimé automatiquement grâce à CASCADE)
    await query(`DELETE FROM users WHERE id = ?`, [userId]);

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
