import { NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';

// Voter pour un participant
// POST /api/votes
export async function POST(request: Request) {
  try {
    const { participantId, voterId } = await request.json();
    
    // Vérifier si l'utilisateur a déjà voté pour ce participant
    const existingVote = await query(
      'SELECT id FROM votes WHERE participant_id = ? AND voter_id = ?',
      [participantId, voterId]
    ) as any[];
    
    if (existingVote && existingVote.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Vous avez déjà voté pour ce participant' },
        { status: 400 }
      );
    }
    
    // Enregistrer le vote
    const result = await query(
      'INSERT INTO votes (participant_id, voter_id) VALUES (?, ?)',
      [participantId, voterId]
    ) as any;
    
    // Mettre à jour le compteur de votes du participant
    await query(
      'UPDATE participants SET votes_count = votes_count + 1 WHERE id = ?',
      [participantId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Vote enregistré avec succès',
      voteId: result.insertId
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du vote:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'enregistrement du vote' },
      { status: 500 }
    );
  }
}

// Récupérer les votes d'un participant
// GET /api/votes?participantId=:id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');
    
    let queryStr = 'SELECT v.*, u.username FROM votes v JOIN users u ON v.voter_id = u.id';
    const params = [];
    
    if (participantId) {
      queryStr += ' WHERE v.participant_id = ?';
      params.push(participantId);
    }
    
    queryStr += ' ORDER BY v.created_at DESC';
    
    const votes = await query(queryStr, params) as any[];
    
    return NextResponse.json({ success: true, data: votes });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
