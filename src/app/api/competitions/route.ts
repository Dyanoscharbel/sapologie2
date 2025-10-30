import { NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';

// Récupérer toutes les compétitions actives
// GET /api/competitions
export async function GET() {
  try {
    const competitions = await query(
      `SELECT c.*, a.full_name as created_by_name 
       FROM competitions c 
       LEFT JOIN admins a ON c.created_by = a.id 
       WHERE c.is_active = 1 
       ORDER BY c.start_date DESC`
    ) as any[];
    
    // Pour chaque compétition, récupérer les participants et les prix
    for (const competition of competitions) {
      // Récupérer les participants
      const participants = await query(
        `SELECT p.*, u.email, u.first_name, u.last_name, u.avatar_base64 
         FROM competition_entries ce 
         JOIN participants p ON ce.participant_id = p.id 
         JOIN users u ON p.user_id = u.id 
         WHERE ce.competition_id = ? AND ce.status = 'approved'`,
        [competition.id]
      ) as any[];
      
      // Récupérer les prix
      const prizes = await query(
        'SELECT id, name, description, position, value, sponsor, image FROM prizes WHERE competition_id = ? ORDER BY position',
        [competition.id]
      ) as any[];
      
      competition.participants = participants || [];
      competition.prizes = prizes || [];
      
      // Ensure gender is set
      if (!competition.gender) {
        competition.gender = 'Mixte';
      }
    }
    
    return NextResponse.json({ success: true, data: competitions });
  } catch (error) {
    console.error('Erreur lors de la récupération des compétitions:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Créer une nouvelle compétition
// POST /api/competitions
export async function POST(request: Request) {
  try {
    const { name, description, start_date, end_date, is_active, max_votes_per_user, created_by, prizes } = await request.json();
    
    const connection = await getConnection();
    await connection.beginTransaction();
    
    try {
      // Créer la compétition
      const [result] = await connection.query(
        `INSERT INTO competitions 
         (name, description, start_date, end_date, is_active, max_votes_per_user, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, new Date(start_date), new Date(end_date), is_active, max_votes_per_user, created_by]
      ) as any[];
      
      const competitionId = result.insertId;
      
      // Ajouter les prix s'il y en a
      if (prizes && prizes.length > 0) {
        for (const prize of prizes) {
          await connection.query(
            `INSERT INTO prizes 
             (competition_id, name, description, position, value, sponsor) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [competitionId, prize.name, prize.description, prize.position, prize.value, prize.sponsor]
          );
        }
      }
      
      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: 'Compétition créée avec succès',
        competitionId
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Erreur lors de la création de la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la création de la compétition' },
      { status: 500 }
    );
  }
}
