import { NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';

// Récupérer tous les participants
// GET /api/participants
export async function GET() {
  try {
    const participants = await query(
      `SELECT p.*, u.email, u.first_name, u.last_name, u.avatar_base64 
       FROM participants p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.is_approved = 1`
    ) as any[];
    
    // Récupérer les médias pour chaque participant
    for (const participant of participants) {
      const medias = await query(
        'SELECT * FROM media WHERE participant_id = ? ORDER BY is_primary DESC',
        [participant.id]
      ) as any[];
      participant.medias = medias || [];
      
      // Récupérer les liens sociaux
      const socialLinks = await query(
        'SELECT * FROM social_links WHERE participant_id = ?',
        [participant.id]
      ) as any[];
      participant.socialLinks = socialLinks || [];
    }
    
    return NextResponse.json({ success: true, data: participants });
  } catch (error) {
    console.error('Erreur lors de la récupération des participants:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Créer un nouveau participant
// POST /api/participants
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { user, participant, socialLinks } = data;
    
    // Démarrer une transaction
    const connection = await getConnection();
    await connection.beginTransaction();
    
    try {
      // Créer l'utilisateur
      const [userResult] = await connection.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, avatar_base64) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.password_hash, user.first_name, user.last_name, user.avatar_base64]
      ) as any[];
      
      const userId = userResult.insertId;
      
      // Créer le participant
      const [participantResult] = await connection.query(
        `INSERT INTO participants 
         (user_id, stage_name, bio, category, location, age, favorite_style, inspiration, is_approved) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          participant.stage_name,
          participant.bio,
          participant.category,
          participant.location,
          participant.age,
          participant.favorite_style,
          participant.inspiration,
          true // Auto-approuver comme demandé
        ]
      ) as any[];
      
      const participantId = participantResult.insertId;
      
      // Ajouter les liens sociaux
      if (socialLinks && socialLinks.length > 0) {
        for (const link of socialLinks) {
          await connection.query(
            'INSERT INTO social_links (participant_id, platform, username, url) VALUES (?, ?, ?, ?)',
            [participantId, link.platform, link.username, link.url]
          );
        }
      }
      
      // Valider la transaction
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: 'Participant créé avec succès',
        data: { userId, participantId }
      });
      
    } catch (error) {
      // En cas d'erreur, annuler la transaction
      await connection.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Erreur lors de la création du participant:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création du participant' },
      { status: 500 }
    );
  }
}
