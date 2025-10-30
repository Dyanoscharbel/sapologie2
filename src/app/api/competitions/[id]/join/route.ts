import { NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_long_et_securise';

// Inscription d'un utilisateur à une compétition
// POST /api/competitions/[id]/join
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competitionId = id;
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    
    // Vérifier que la compétition existe et est active
    const competitions = await query(
      'SELECT * FROM competitions WHERE id = ?',
      [competitionId]
    ) as any[];
    
    if (competitions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Compétition introuvable' },
        { status: 404 }
      );
    }
    
    const competition = competitions[0];
    
    if (!competition.is_active) {
      return NextResponse.json(
        { success: false, message: 'Cette compétition n\'est plus active' },
        { status: 400 }
      );
    }
    
    // Vérifier les dates
    const now = new Date();
    const startDate = new Date(competition.start_date);
    const endDate = new Date(competition.end_date);
    
    if (now < startDate) {
      return NextResponse.json(
        { success: false, message: 'La compétition n\'a pas encore commencé' },
        { status: 400 }
      );
    }
    
    if (now > endDate) {
      return NextResponse.json(
        { success: false, message: 'La compétition est terminée' },
        { status: 400 }
      );
    }
    
    // Vérifier que l'utilisateur a un profil participant
    const participants = await query(
      'SELECT * FROM participants WHERE user_id = ?',
      [userId]
    ) as any[];
    
    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Vous devez créer un profil participant avant de vous inscrire' },
        { status: 400 }
      );
    }
    
    const participant = participants[0];
    
    // Vérifier que le participant est approuvé
    if (!participant.is_approved) {
      return NextResponse.json(
        { success: false, message: 'Votre profil participant doit être approuvé par un administrateur' },
        { status: 400 }
      );
    }
    
    // Vérifier si déjà inscrit
    const existingEntries = await query(
      'SELECT * FROM competition_entries WHERE competition_id = ? AND participant_id = ?',
      [competitionId, participant.id]
    ) as any[];
    
    if (existingEntries.length > 0) {
      const entry = existingEntries[0];
      return NextResponse.json(
        { 
          success: false, 
          message: entry.status === 'pending' 
            ? 'Votre inscription est en attente d\'approbation' 
            : 'Vous êtes déjà inscrit à cette compétition',
          data: { status: entry.status }
        },
        { status: 400 }
      );
    }
    
    // Créer l'inscription
    // Si le participant est déjà approuvé, l'inscription est automatiquement approuvée
    const entryStatus = participant.is_approved ? 'approved' : 'pending';
    
    await query(
      `INSERT INTO competition_entries (competition_id, participant_id, status, votes_count) 
       VALUES (?, ?, ?, 0)`,
      [competitionId, participant.id, entryStatus]
    );
    
    const message = entryStatus === 'approved' 
      ? 'Inscription réussie ! Vous participez maintenant à cette compétition.' 
      : 'Inscription réussie ! Votre participation sera examinée par les administrateurs.';
    
    return NextResponse.json({
      success: true,
      message,
      data: { status: entryStatus }
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Vérifier le statut d'inscription d'un utilisateur
// GET /api/competitions/[id]/join
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const competitionId = id;
    
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Non authentifié' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Token invalide' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    
    // Récupérer le participant de l'utilisateur
    const participants = await query(
      'SELECT * FROM participants WHERE user_id = ?',
      [userId]
    ) as any[];
    
    if (participants.length === 0) {
      return NextResponse.json({
        success: true,
        data: { isRegistered: false, hasParticipant: false }
      });
    }
    
    const participant = participants[0];
    
    // Vérifier l'inscription
    const entries = await query(
      'SELECT * FROM competition_entries WHERE competition_id = ? AND participant_id = ?',
      [competitionId, participant.id]
    ) as any[];
    
    if (entries.length === 0) {
      return NextResponse.json({
        success: true,
        data: { 
          isRegistered: false, 
          hasParticipant: true,
          isApproved: participant.is_approved
        }
      });
    }
    
    const entry = entries[0];
    
    return NextResponse.json({
      success: true,
      data: {
        isRegistered: true,
        hasParticipant: true,
        isApproved: participant.is_approved,
        entryStatus: entry.status,
        votesCount: entry.votes_count
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification du statut:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
