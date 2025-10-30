import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_long_et_securise';

export const dynamic = 'force-dynamic';

// Récupérer toutes les inscriptions d'une compétition
// GET /api/admin/competitions/[id]/entries

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    // Vérifier l'authentification admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non autorisé' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role?: string; isAdmin?: boolean };
    
    if (!decoded.isAdmin && decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Accès réservé aux administrateurs' },
        { status: 403 }
      );
    }

    const competitionId = id;

    // Récupérer toutes les inscriptions avec les infos des participants
    const entries = await query(
      `SELECT 
        ce.id as entry_id,
        ce.competition_id,
        ce.participant_id,
        ce.status as entry_status,
        ce.votes_count,
        ce.created_at as entry_date,
        p.id,
        p.user_id,
        p.stage_name,
        p.bio,
        p.style,
        p.photo_base64,
        p.is_approved as participant_approved,
        u.first_name,
        u.last_name,
        u.email
      FROM competition_entries ce
      JOIN participants p ON ce.participant_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE ce.competition_id = ?
      ORDER BY ce.created_at DESC`,
      [competitionId]
    ) as any[];

    // Grouper par statut pour faciliter l'affichage
    const groupedEntries = {
      pending: entries.filter(e => e.entry_status === 'pending'),
      approved: entries.filter(e => e.entry_status === 'approved'),
      rejected: entries.filter(e => e.entry_status === 'rejected'),
      total: entries.length
    };

    return NextResponse.json({
      success: true,
      data: groupedEntries,
      allEntries: entries
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
