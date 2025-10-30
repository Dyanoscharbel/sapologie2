import { NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_long_et_securise';

// Récupérer une compétition par ID avec ses détails
// GET /api/competitions/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competitionId = id;
    
    // Récupérer la compétition
    const competitions = await query(
      `SELECT c.*, a.full_name as created_by_name 
       FROM competitions c 
       LEFT JOIN admins a ON c.created_by = a.id 
       WHERE c.id = ?`,
      [competitionId]
    ) as any[];
    
    if (competitions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Compétition introuvable' },
        { status: 404 }
      );
    }
    
    const competition = competitions[0];
    
    // Récupérer les participants inscrits
    const participants = await query(
      `SELECT p.*, u.email, u.first_name, u.last_name, u.avatar_base64,
              ce.status, ce.votes_count,
              (SELECT media_data FROM media WHERE participant_id = p.id AND is_primary = 1 LIMIT 1) as primary_photo
       FROM competition_entries ce 
       JOIN participants p ON ce.participant_id = p.id 
       JOIN users u ON p.user_id = u.id 
       WHERE ce.competition_id = ? AND ce.status = 'approved'
       ORDER BY ce.votes_count DESC`,
      [competitionId]
    ) as any[];
    
    // Récupérer les prix
    const prizes = await query(
      'SELECT * FROM prizes WHERE competition_id = ? ORDER BY position',
      [competitionId]
    ) as any[];
    
    competition.participants = participants || [];
    competition.prizes = prizes || [];
    competition.participantsCount = participants.length;
    
    return NextResponse.json({ success: true, data: competition });
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
