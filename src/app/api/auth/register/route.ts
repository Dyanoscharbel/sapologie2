import { NextResponse } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { COUNTRIES } from '@/lib/countries';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Validation des données requises
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name || !userData.country || !userData.phone) {
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation du pays
    const countryExists = COUNTRIES.some(c => c.name === userData.country);
    if (!countryExists) {
      return NextResponse.json(
        { success: false, message: 'Pays invalide' },
        { status: 400 }
      );
    }

    // Validation du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { success: false, message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe (minimum 6 caractères)
    if (userData.password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Validation du numéro de téléphone (minimum 10 chiffres)
    const phoneDigits = userData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Le numéro de téléphone doit contenir au moins 10 chiffres' },
        { status: 400 }
      );
    }

    const result = await AuthService.register(userData);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Inscription réussie',
      data: result 
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Erreur lors de l\'inscription' },
      { status: 400 }
    );
  }
}
