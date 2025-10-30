'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, User, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AdminProfile {
  id: number;
  email: string;
  full_name: string;
  is_super_admin: boolean;
  last_login: string;
  created_at: string;
}

export default function AdminSettingsPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        setFormData({
          full_name: data.data.full_name,
          email: data.data.email,
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (formData.new_password && formData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          current_password: formData.current_password || undefined,
          new_password: formData.new_password || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        // Réinitialiser les champs de mot de passe
        setFormData(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: ''
        }));
        // Recharger le profil
        await fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.message || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold">Profil non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et votre sécurité
        </p>
      </div>

      {/* Message de succès/erreur */}
      {message && (
        <Card className={`border-2 ${
          message.type === 'success' 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-red-500 bg-red-50'
        }`}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p className={`font-medium ${
                message.type === 'success' ? 'text-emerald-900' : 'text-red-900'
              }`}>
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Modifiez vos informations de base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
            </div>

            {profile.is_super_admin && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  👑 Vous êtes Super Administrateur
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Changement de mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Changez votre mot de passe (laissez vide pour ne pas modifier)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current_password">Mot de passe actuel</Label>
              <Input
                id="current_password"
                type="password"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_password">Nouveau mot de passe</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                placeholder="••••••••"
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dernière connexion :</span>
              <span className="font-medium">
                {profile.last_login 
                  ? new Date(profile.last_login).toLocaleString('fr-FR')
                  : 'Jamais'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compte créé le :</span>
              <span className="font-medium">
                {new Date(profile.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={saving}
            className="flex-1 sm:flex-none"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
