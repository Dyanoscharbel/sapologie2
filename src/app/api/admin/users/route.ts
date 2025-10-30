import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

export async function GET(request: Request) {
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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Récupérer les utilisateurs avec leurs participants et leur photo principale
    const users = await query(`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        u.whatsapp,
        u.country,
        u.pseudo,
        u.avatar_base64,
        u.created_at,
        u.is_active,
        p.id as participant_id,
        p.stage_name,
        p.is_approved,
        p.bio,
        m.media_data as primary_media
      FROM users u
      LEFT JOIN participants p ON u.id = p.user_id
      LEFT JOIN media m ON p.id = m.participant_id AND m.is_primary = 1
      ORDER BY u.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]) as any[];

    // Récupérer le total des utilisateurs
    const countResult = await query('SELECT COUNT(*) as total FROM users') as any[];
    const total = countResult[0]?.total || 0;

    // Formater les données
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.email.split('@')[0],
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp,
      country: user.country,
      pseudo: user.pseudo,
      avatarBase64: user.avatar_base64 || user.primary_media, // Utiliser la photo principale comme fallback
      createdAt: new Date(user.created_at).toLocaleDateString('fr-FR'),
      isActive: user.is_active,
      bio: user.bio || '',
      participant: user.participant_id ? {
        id: user.participant_id,
        stageName: user.stage_name,
        isApproved: Boolean(user.is_approved),
        bio: user.bio
      } : null,
      status: user.participant_id ? (user.is_approved === 1 ? 'approved' : 'pending') : 'user'
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: formattedUsers,
        total,
        limit,
        offset
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
