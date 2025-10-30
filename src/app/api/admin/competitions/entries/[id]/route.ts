import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_tres_long_et_securise';

// Approuver ou rejeter une inscription
// PATCH /api/admin/competitions/entries/[id]
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const entryId = id;
    const { status } = await request.json();

    // Valider le statut
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Statut invalide. Utilisez: approved, rejected ou pending' },
        { status: 400 }
      );
    }

    // Vérifier que l'inscription existe
    const entries = await query(
      'SELECT * FROM competition_entries WHERE id = ?',
      [entryId]
    ) as any[];

    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    await query(
      'UPDATE competition_entries SET status = ? WHERE id = ?',
      [status, entryId]
    );

    const messages = {
      approved: 'Inscription approuvée avec succès',
      rejected: 'Inscription rejetée',
      pending: 'Inscription remise en attente'
    };

    return NextResponse.json({
      success: true,
      message: messages[status as keyof typeof messages],
      data: { status }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Supprimer une inscription (retirer un participant)
// DELETE /api/admin/competitions/entries/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const entryId = id;

    // Vérifier que l'inscription existe
    const entries = await query(
      'SELECT * FROM competition_entries WHERE id = ?',
      [entryId]
    ) as any[];

    if (entries.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer l'inscription
    await query(
      'DELETE FROM competition_entries WHERE id = ?',
      [entryId]
    );

    return NextResponse.json({
      success: true,
      message: 'Participant retiré de la compétition avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
