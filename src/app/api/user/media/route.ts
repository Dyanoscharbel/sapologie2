import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { AuthService } from '@/services/auth.service';

// POST - Ajouter un média
export async function POST(request: Request) {
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

    // Vérifier si l'utilisateur a un profil participant
    const participants = await query(
      'SELECT id FROM participants WHERE user_id = ?',
      [user.id]
    ) as any[];

    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Profil participant non trouvé' },
        { status: 404 }
      );
    }

    const participantId = participants[0].id;

    // Vérifier le nombre de médias existants (limite de 5)
    const mediaCount = await query(
      'SELECT COUNT(*) as total FROM media WHERE participant_id = ?',
      [participantId]
    ) as any[];

    if (mediaCount[0].total >= 5) {
      return NextResponse.json(
        { success: false, message: 'Limite de 5 photos atteinte' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { mediaData, mediaType, fileName, isPrimary } = body;

    if (!mediaData || !mediaType) {
      return NextResponse.json(
        { success: false, message: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Si isPrimary est true, retirer le flag primary des autres médias
    if (isPrimary) {
      await query(
        'UPDATE media SET is_primary = 0 WHERE participant_id = ?',
        [participantId]
      );
    }

    // Calculer la position
    const maxPosition = await query(
      'SELECT MAX(position) as max_pos FROM media WHERE participant_id = ?',
      [participantId]
    ) as any[];

    const position = (maxPosition[0]?.max_pos || -1) + 1;

    // Insérer le média
    const result = await query(
      `INSERT INTO media (participant_id, media_data, media_type, file_name, is_primary, position) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [participantId, mediaData, mediaType, fileName, isPrimary ? 1 : 0, position]
    ) as any;

    return NextResponse.json({
      success: true,
      message: 'Média ajouté avec succès',
      data: {
        id: result.insertId,
        position
      }
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du média:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un média
export async function DELETE(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('id');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, message: 'ID du média manquant' },
        { status: 400 }
      );
    }

    // Vérifier que le média appartient à l'utilisateur
    const participants = await query(
      'SELECT id FROM participants WHERE user_id = ?',
      [user.id]
    ) as any[];

    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Profil participant non trouvé' },
        { status: 404 }
      );
    }

    const media = await query(
      'SELECT id FROM media WHERE id = ? AND participant_id = ?',
      [mediaId, participants[0].id]
    ) as any[];

    if (media.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Média non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Supprimer le média
    await query('DELETE FROM media WHERE id = ?', [mediaId]);

    return NextResponse.json({
      success: true,
      message: 'Média supprimé avec succès'
    });

  } catch (error: any) {
    console.error('Erreur lors de la suppression du média:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Définir un média comme principal
export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { mediaId } = body;

    if (!mediaId) {
      return NextResponse.json(
        { success: false, message: 'ID du média manquant' },
        { status: 400 }
      );
    }

    // Vérifier que le média appartient à l'utilisateur
    const participants = await query(
      'SELECT id FROM participants WHERE user_id = ?',
      [user.id]
    ) as any[];

    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Profil participant non trouvé' },
        { status: 404 }
      );
    }

    const participantId = participants[0].id;

    const media = await query(
      'SELECT id FROM media WHERE id = ? AND participant_id = ?',
      [mediaId, participantId]
    ) as any[];

    if (media.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Média non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Retirer le flag primary de tous les médias
    await query(
      'UPDATE media SET is_primary = 0 WHERE participant_id = ?',
      [participantId]
    );

    // Définir ce média comme principal
    await query(
      'UPDATE media SET is_primary = 1 WHERE id = ?',
      [mediaId]
    );

    return NextResponse.json({
      success: true,
      message: 'Média défini comme principal'
    });

  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du média:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur', error: error.message },
      { status: 500 }
    );
  }
}
