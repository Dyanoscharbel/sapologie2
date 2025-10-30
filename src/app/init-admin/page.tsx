'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Crown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function InitAdminPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const initializeAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/init');
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Erreur de connexion',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Crown className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Initialisation Administrateur</CardTitle>
          <CardDescription>
            Créez le compte administrateur pour gérer l'application
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!result && !loading && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Cliquez sur le bouton ci-dessous pour initialiser le compte administrateur.
              </p>
              <Button 
                onClick={initializeAdmin} 
                size="lg"
                className="w-full sm:w-auto"
              >
                Initialiser l'Administrateur
              </Button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Initialisation en cours...</p>
            </div>
          )}

          {result && (
            <div className={`p-6 rounded-lg border-2 ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                {result.success ? (
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                )}
                
                <div className="flex-1 space-y-3">
                  <h3 className={`font-bold text-lg ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {result.message}
                  </h3>

                  {result.data && (
                    <div className="space-y-2">
                      <div className="bg-white p-4 rounded border">
                        <p className="font-semibold mb-2">Identifiants:</p>
                        <div className="space-y-1 font-mono text-sm">
                          <p><strong>Email:</strong> {result.data.email}</p>
                          {result.data.password && (
                            <p><strong>Mot de passe:</strong> {result.data.password}</p>
                          )}
                        </div>
                      </div>

                      {result.data.warning && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                          <p className="text-amber-800 text-sm font-medium">
                            {result.data.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {result.error && (
                    <div className="bg-white p-3 rounded border border-red-200">
                      <p className="text-sm text-red-700 font-mono">{result.error}</p>
                    </div>
                  )}

                  {result.success && (
                    <div className="pt-4 space-y-2">
                      <Link href="/login">
                        <Button className="w-full">
                          Aller à la page de connexion
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          setResult(null);
                          setLoading(false);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Réinitialiser
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold">ℹ️ Informations:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Cette page crée automatiquement la table admins si elle n'existe pas</li>
                <li>Si un administrateur existe déjà, aucun nouveau compte ne sera créé</li>
                <li>Les identifiants par défaut peuvent être configurés dans le fichier .env.local</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
