import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT 1 as test') as any[];
    return NextResponse.json({ 
      success: true, 
      message: 'Connexion à la base de données réussie',
      data: result[0] 
    });
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur de connexion à la base de données',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
