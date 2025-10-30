import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token non fourni' },
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

    return NextResponse.json({ 
      success: true, 
      data: user 
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token non fourni' },
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

    const updates = await request.json();
    await AuthService.updateUser(user.id, updates);

    return NextResponse.json({ 
      success: true, 
      message: 'Profil mis à jour avec succès'
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
