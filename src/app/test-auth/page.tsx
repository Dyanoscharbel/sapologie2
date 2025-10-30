'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      setResult({ type: '✅ Test BD', data });
    } catch (error: any) {
      setResult({ type: '❌ Test BD', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔵 Début inscription...');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          first_name: 'Test',
          last_name: 'User'
        })
      });
      
      console.log('🔵 Status:', res.status);
      const data = await res.json();
      console.log('🔵 Réponse:', data);
      
      setResult({ 
        type: res.ok ? '✅ Inscription' : '❌ Inscription', 
        status: res.status,
        data 
      });
    } catch (error: any) {
      console.error('🔴 Erreur inscription:', error);
      setResult({ type: '❌ Inscription', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🔵 Début connexion...');
      console.log('🔵 Email:', email);
      
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('🔵 Status:', res.status);
      const data = await res.json();
      console.log('🔵 Réponse:', data);
      
      setResult({ 
        type: res.ok ? '✅ Connexion' : '❌ Connexion', 
        status: res.status,
        data 
      });
    } catch (error: any) {
      console.error('🔴 Erreur connexion:', error);
      setResult({ type: '❌ Connexion', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🧪 Test d'Authentification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test DB */}
          <div className="space-y-2">
            <h3 className="font-semibold">1. Test Connexion BD</h3>
            <Button onClick={testConnection} disabled={loading}>
              Tester la BD
            </Button>
          </div>

          {/* Test Inscription */}
          <div className="space-y-2">
            <h3 className="font-semibold">2. Test Inscription</h3>
            <Button onClick={testRegister} disabled={loading} variant="secondary">
              Créer un utilisateur test
            </Button>
          </div>

          {/* Test Connexion */}
          <div className="space-y-2">
            <h3 className="font-semibold">3. Test Connexion</h3>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={testLogin} disabled={loading} variant="outline">
              Se connecter
            </Button>
          </div>

          {/* Résultats */}
          {loading && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              ⏳ Chargement...
            </div>
          )}

          {result && (
            <div className={`p-4 rounded border ${
              result.type.includes('✅') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-bold mb-2">{result.type}</h3>
              {result.status && <p className="text-sm mb-2">Status: {result.status}</p>}
              <pre className="text-xs overflow-auto max-h-96 bg-white p-2 rounded">
                {JSON.stringify(result.data || result.error, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-gray-50 rounded text-sm space-y-2">
            <p className="font-semibold">📋 Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Testez d'abord la connexion à la BD</li>
              <li>Créez un utilisateur test</li>
              <li>Utilisez les identifiants générés pour vous connecter</li>
              <li>Vérifiez les logs dans la console du navigateur (F12)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
