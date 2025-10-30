'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function DebugAuth() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDBConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult({ type: 'DB Connection', data });
    } catch (error: any) {
      setResult({ type: 'DB Connection', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const data = await response.json();
      setResult({ type: 'Login Test', status: response.status, data });
    } catch (error: any) {
      setResult({ type: 'Login Test', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
          first_name: 'Test',
          last_name: 'User'
        })
      });
      const data = await response.json();
      setResult({ type: 'Register Test', status: response.status, data });
    } catch (error: any) {
      setResult({ type: 'Register Test', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>🔍 Débogage Authentification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testDBConnection} disabled={loading}>
            Test DB
          </Button>
          <Button onClick={testRegister} disabled={loading} variant="secondary">
            Test Inscription
          </Button>
          <Button onClick={testLogin} disabled={loading} variant="outline">
            Test Connexion
          </Button>
        </div>

        {loading && (
          <div className="p-4 bg-blue-50 rounded">
            Chargement...
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-bold mb-2">{result.type}</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
