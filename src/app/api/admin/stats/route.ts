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

    // Récupérer les statistiques

    // 1. Total des utilisateurs
    const usersResult = await query('SELECT COUNT(*) as total FROM users') as any[];
    const totalUsers = usersResult[0]?.total || 0;

    // 2. Total des participants
    const participantsResult = await query('SELECT COUNT(*) as total FROM participants') as any[];
    const totalParticipants = participantsResult[0]?.total || 0;

    // 3. Participants approuvés
    const approvedResult = await query(
      'SELECT COUNT(*) as total FROM participants WHERE is_approved = 1'
    ) as any[];
    const approvedParticipants = approvedResult[0]?.total || 0;

    // 4. Users en attente (sans participant OU participant non approuvé)
    const pendingResult = await query(`
      SELECT COUNT(*) as total 
      FROM users u
      LEFT JOIN participants p ON u.id = p.user_id
      WHERE p.id IS NULL OR p.is_approved = 0
    `) as any[];
    const pendingParticipants = pendingResult[0]?.total || 0;

    // 5. Total des votes
    const votesResult = await query('SELECT COUNT(*) as total FROM votes') as any[];
    const totalVotes = votesResult[0]?.total || 0;

    // 6. Total des compétitions
    const competitionsResult = await query('SELECT COUNT(*) as total FROM competitions') as any[];
    const totalCompetitions = competitionsResult[0]?.total || 0;

    // 7. Compétitions actives
    const activeCompetitionsResult = await query(
      'SELECT COUNT(*) as total FROM competitions WHERE is_active = 1'
    ) as any[];
    const activeCompetitions = activeCompetitionsResult[0]?.total || 0;

    // Calculer le taux d'approbation
    const approvalRate = totalParticipants > 0 
      ? ((approvedParticipants / totalParticipants) * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalParticipants,
        approvedParticipants,
        pendingParticipants,
        totalVotes,
        totalCompetitions,
        activeCompetitions,
        approvalRate
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
