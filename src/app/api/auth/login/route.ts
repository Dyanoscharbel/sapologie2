import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const result = await AuthService.login(email, password);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connexion réussie',
      data: result 
    });
  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Email ou mot de passe incorrect' },
      { status: 401 }
    );
  }
}
