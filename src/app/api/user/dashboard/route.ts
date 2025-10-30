import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

// GET - Récupérer les stats du dashboard pour l'utilisateur connecté
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

    // Récupérer les infos du participant
    const participants = await query(`
      SELECT 
        p.id,
        p.stage_name,
        p.bio,
        p.is_approved,
        p.category,
        p.location,
        p.age
      FROM participants p
      WHERE p.user_id = ?
    `, [user.id]) as any[];

    const participant = participants.length > 0 ? participants[0] : null;
    let votes = 0;
    let photos = 0;
    let position = 0;

    if (participant) {
      // Compter les votes reçus
      const voteResults = await query(
        'SELECT COUNT(*) as total FROM votes WHERE participant_id = ?',
        [participant.id]
      ) as any[];
      votes = voteResults[0]?.total || 0;

      // Compter les photos
      const photoResults = await query(
        'SELECT COUNT(*) as total FROM media WHERE participant_id = ?',
        [participant.id]
      ) as any[];
      photos = photoResults[0]?.total || 0;

      // Calculer la position (nombre de participants avec plus de votes + 1)
      const positionResults = await query(`
        SELECT COUNT(*) + 1 as position
        FROM participants p
        LEFT JOIN (
          SELECT participant_id, COUNT(*) as vote_count
          FROM votes
          GROUP BY participant_id
        ) v ON p.id = v.participant_id
        WHERE COALESCE(v.vote_count, 0) > ?
      `, [votes]) as any[];
      position = positionResults[0]?.position || 0;
    }

    // Récupérer le top 10 des participants
    const topParticipants = await query(`
      SELECT 
        p.id,
        p.stage_name,
        u.avatar_base64,
        COUNT(v.id) as votes,
        p.category
      FROM participants p
      INNER JOIN users u ON p.user_id = u.id
      LEFT JOIN votes v ON p.id = v.participant_id
      WHERE p.is_approved = 1
      GROUP BY p.id, p.stage_name, u.avatar_base64, p.category
      ORDER BY votes DESC
      LIMIT 10
    `) as any[];

    // Récupérer les participants suggérés (participants approuvés aléatoires)
    const suggested = await query(`
      SELECT 
        p.id,
        p.stage_name,
        p.category,
        u.avatar_base64
      FROM participants p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.is_approved = 1
      AND p.user_id != ?
      ORDER BY RAND()
      LIMIT 3
    `, [user.id]) as any[];

    // Récupérer l'activité récente
    const recentVotes = await query(`
      SELECT 
        v.created_at,
        p.stage_name,
        'vote' as type
      FROM votes v
      INNER JOIN participants p ON v.participant_id = p.id
      WHERE v.voter_id = ?
      ORDER BY v.created_at DESC
      LIMIT 10
    `, [user.id]) as any[];

    // Si l'utilisateur a un participant, récupérer les votes reçus
    let votesReceived = [];
    if (participant) {
      votesReceived = await query(`
        SELECT 
          v.created_at,
          u.first_name,
          u.last_name,
          'received' as type
        FROM votes v
        INNER JOIN users u ON v.voter_id = u.id
        WHERE v.participant_id = ?
        ORDER BY v.created_at DESC
        LIMIT 10
      `, [participant.id]) as any[];
    }

    // Combiner et trier l'activité
    const allActivity = [
      ...recentVotes.map((v: any) => ({
        type: 'vote_given',
        text: `Vous avez voté pour ${v.stage_name}`,
        time: formatTime(v.created_at),
        timestamp: new Date(v.created_at).getTime()
      })),
      ...votesReceived.map((v: any) => ({
        type: 'vote_received',
        text: `${v.first_name} ${v.last_name} a voté pour vous`,
        time: formatTime(v.created_at),
        timestamp: new Date(v.created_at).getTime()
      }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          avatar: user.avatar_base64
        },
        stats: {
          votes,
          photos,
          position,
          isApproved: participant?.is_approved || false
        },
        participant: participant ? {
          id: participant.id,
          stageName: participant.stage_name,
          bio: participant.bio,
          category: participant.category,
          location: participant.location,
          age: participant.age
        } : null,
        topParticipants: topParticipants.map((p: any, index: number) => ({
          id: p.id,
          name: p.stage_name,
          votes: p.votes,
          avatar: p.avatar_base64,
          position: index + 1,
          category: p.category
        })),
        suggested: suggested.map((s: any) => ({
          id: s.id,
          name: s.stage_name,
          style: s.category || 'Non catégorisé',
          avatar: s.avatar_base64
        })),
        recentActivity: allActivity
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération du dashboard:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// Fonction helper pour formater le temps relatif
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return days === 1 ? 'Il y a 1 jour' : `Il y a ${days} jours`;
  }
  if (hours > 0) {
    return hours === 1 ? 'Il y a 1h' : `Il y a ${hours}h`;
  }
  if (minutes > 0) {
    return minutes === 1 ? 'Il y a 1 min' : `Il y a ${minutes} min`;
  }
  return 'À l\'instant';
}
