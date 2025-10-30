import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

// GET - Récupérer une compétition spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const competitionId = parseInt(id);

    const competitions = await query(`
      SELECT 
        id,
        name as title,
        description,
        start_date,
        end_date,
        prize_first,
        prize_second,
        prize_third,
        is_active,
        created_at,
        updated_at
      FROM competitions
      WHERE id = ?
    `, [competitionId]) as any[];

    if (competitions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Compétition non trouvée' },
        { status: 404 }
      );
    }

    const comp = competitions[0];
    const startDate = new Date(comp.start_date);
    const endDate = new Date(comp.end_date);
    
    const formattedCompetition = {
      id: comp.id,
      title: comp.title,
      description: comp.description,
      startDate: startDate.toISOString().split('T')[0], // Format YYYY-MM-DD pour les inputs
      endDate: endDate.toISOString().split('T')[0], // Format YYYY-MM-DD pour les inputs
      prizeFirst: comp.prize_first,
      prizeSecond: comp.prize_second,
      prizeThird: comp.prize_third,
      isActive: Boolean(comp.is_active),
      createdAt: new Date(comp.created_at).toLocaleDateString('fr-FR'),
      updatedAt: comp.updated_at ? new Date(comp.updated_at).toLocaleDateString('fr-FR') : null
    };

    return NextResponse.json({
      success: true,
      data: formattedCompetition
    });

  } catch (error: any) {
    console.error('Erreur lors de la récupération de la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une compétition
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const competitionId = parseInt(id);
    const body = await request.json();
    const { title, description, startDate, endDate, prizeFirst, prizeSecond, prizeThird, isActive } = body;

    // Vérifier si la compétition existe
    const competitions = await query(
      'SELECT id FROM competitions WHERE id = ?',
      [competitionId]
    ) as any[];

    if (competitions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Compétition non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la compétition
    await query(`
      UPDATE competitions 
      SET name = ?,
          description = ?,
          start_date = ?,
          end_date = ?,
          prize_first = ?,
          prize_second = ?,
          prize_third = ?,
          is_active = ?
      WHERE id = ?
    `, [title, description || '', startDate, endDate, prizeFirst || '', prizeSecond || '', prizeThird || '', isActive ? 1 : 0, competitionId]);

    return NextResponse.json({
      success: true,
      message: 'Compétition mise à jour avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une compétition
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    const competitionId = parseInt(id);

    // Vérifier si la compétition existe
    const competitions = await query(
      'SELECT id FROM competitions WHERE id = ?',
      [competitionId]
    ) as any[];

    if (competitions.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Compétition non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la compétition
    await query('DELETE FROM competitions WHERE id = ?', [competitionId]);

    return NextResponse.json({
      success: true,
      message: 'Compétition supprimée avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la suppression de la compétition:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
