"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Calendar, 
  Euro, 
  Image as ImageIcon,
  User as UserIcon,
  FileText,
  Loader2,
  Heart,
  Trash2,
  Phone,
  Globe,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDetail {
  id: number;
  name: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  country?: string;
  countryCode?: string;
  phone?: string;
  whatsapp?: string;
  pseudo?: string;
  avatarBase64?: string;
  createdAt: string;
  isActive: boolean;
  participant?: {
    id: number;
    stageName: string;
    bio: string;
    isApproved: boolean;
    category?: string;
    location?: string;
    age?: number;
    votesCount: number;
    media: Array<{
      id: number;
      type: string;
      base64: string;
      fileName?: string;
      isPrimary: boolean;
      position: number;
    }>;
  } | null;
  status: string;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const id = Number(params.id);

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (token && id) {
      fetchUser();
    }
  }, [token, id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    if (!user) return;
    
    setApproving(true);
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isApproved: true,
          // Utiliser le nom de l'user comme nom de scène par défaut
          stageName: user.name || 'Participant',
          bio: '',
          category: null,
          location: null,
          age: null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recharger les données utilisateur
        await fetchUser();
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
    } finally {
      setApproving(false);
    }
  };

  const deleteUser = async () => {
    if (!user) return;

    // Confirmation avant suppression
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ?\n\nCette action est irréversible et supprimera également son profil participant et tous ses votes.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Rediriger vers la liste des utilisateurs
        router.push('/admin/users');
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Utilisateur introuvable</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Cet utilisateur n'existe pas ou a été supprimé.
            </p>
            <Button asChild variant="outline" className="btn-glow">
              <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Retour à la liste
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push("/admin/users")}
            className="btn-glow"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Retour
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={deleteUser}
            className="bg-red-500 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
            Supprimer
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={user.status === 'approved' ? 'default' : 'secondary'}
            className={cn(
              "px-3 py-1.5 text-sm",
              user.status === 'approved' && 'bg-emerald-500 hover:bg-emerald-600'
            )}
          >
            {user.status === 'approved' ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Validé
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-1.5" aria-hidden="true" />
                En attente
              </>
            )}
          </Badge>
          {(user.status === 'pending' || user.status === 'user') && (
            <Button 
              onClick={approve}
              disabled={approving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white btn-glow"
            >
              {approving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                  Validation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Valider le compte
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-purple-600 to-pink-600 relative">
          <div className="absolute inset-0 bg-[url('/placeholder-1.svg')] opacity-10 mix-blend-overlay" aria-hidden="true" />
        </div>
        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {user.avatarBase64 ? (
              <img 
                src={`data:image/jpeg;base64,${user.avatarBase64}`}
                alt={user.name}
                className="w-32 h-32 rounded-2xl object-cover shadow-2xl border-4 border-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-5xl shadow-2xl border-4 border-white">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="flex-1 sm:mb-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Inscrit le {user.createdAt}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                Informations de contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.username && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg mt-1">
                      <UserIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Nom d'utilisateur</p>
                      <p className="text-sm font-semibold text-foreground">{user.username}</p>
                    </div>
                  </div>
                )}
                
                {user.pseudo && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
                      <UserIcon className="h-4 w-4 text-purple-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Pseudo</p>
                      <p className="text-sm font-semibold text-foreground">{user.pseudo}</p>
                    </div>
                  </div>
                )}

                {user.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg mt-1">
                      <Phone className="h-4 w-4 text-green-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-semibold text-foreground">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.whatsapp && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-lg mt-1">
                      <MessageCircle className="h-4 w-4 text-teal-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">WhatsApp</p>
                      <p className="text-sm font-semibold text-foreground">{user.whatsapp}</p>
                    </div>
                  </div>
                )}

                {user.country && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg mt-1">
                      <Globe className="h-4 w-4 text-red-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Pays</p>
                      <p className="text-sm font-semibold text-foreground">
                        {user.countryCode && `${user.countryCode} - `}{user.country}
                      </p>
                    </div>
                  </div>
                )}

                {user.firstName || user.lastName ? (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg mt-1">
                      <UserIcon className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Nom complet</p>
                      <p className="text-sm font-semibold text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Bio Card */}
          {user.participant && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  Biographie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {user.participant.bio || 'Aucune biographie fournie'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Photos Gallery */}
          {user.participant && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    Photos ({user.participant.media.length})
                  </CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {user.participant.media.length} images
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {user.participant.media.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {user.participant.media.map((media, i) => (
                    <div 
                      key={media.id} 
                      className="group relative aspect-square bg-muted rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                    >
                      <img 
                        src={`data:image/jpeg;base64,${media.base64}`} 
                        alt={media.fileName || `Photo ${i + 1} de ${user.name}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white text-sm font-medium">{media.fileName || `Photo ${i + 1}`}</p>
                          {media.isPrimary && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-white text-xs rounded">
                              Photo principale
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aucune photo n'a été fournie par ce participant.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Statut</span>
                </div>
                <span className="font-semibold text-foreground">
                  {user.status === 'approved' ? 'Validé' : 'En attente'}
                </span>
              </div>

              {user.participant && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/10 rounded-lg">
                      <Heart className="h-5 w-5 text-pink-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Votes</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {user.participant.votesCount}
                  </span>
                </div>
              )}

              {user.participant && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Photos</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {user.participant.media.length}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Inscription</span>
                </div>
                <span className="font-semibold text-foreground text-sm">
                  {user.createdAt}
                </span>
              </div>

              {user.participant?.category && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <UserIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Catégorie</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {user.participant.category}
                  </span>
                </div>
              )}

              {user.participant?.location && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Mail className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Localisation</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {user.participant.location}
                  </span>
                </div>
              )}

              {user.participant?.age && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Âge</span>
                  </div>
                  <span className="font-semibold text-foreground text-sm">
                    {user.participant.age} ans
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Card */}
          {(user.status === 'pending' || user.status === 'user') && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500 rounded-lg">
                    <Clock className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Action requise</h3>
                    <p className="text-sm text-muted-foreground">
                      Ce compte est en attente de validation. Cliquez sur le bouton pour valider et créer automatiquement le profil participant.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white btn-glow" 
                  onClick={approve}
                  disabled={approving}
                  size="lg"
                >
                  {approving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                      Validation en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" aria-hidden="true" />
                      Valider le compte
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
