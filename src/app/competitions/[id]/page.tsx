"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  Trophy, Calendar, Users, Award, Clock, Loader2, ArrowLeft, 
  Heart, Star, CheckCircle2, AlertCircle, Gift, Crown, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navigation, Footer } from "@/components/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: number;
  stage_name: string;
  bio: string;
  category?: string;
  location?: string;
  first_name?: string;
  last_name?: string;
  avatar_base64?: string;
  primary_photo?: string;
  votes_count: number;
  status: string;
}

interface Prize {
  id: number;
  name: string;
  description?: string;
  position: number;
  value?: number;
  sponsor?: string;
  image?: string;
}

interface Competition {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  gender?: string;
  banner_image?: string;
  max_votes_per_user: number;
  created_by_name?: string;
  participants: Participant[];
  prizes: Prize[];
  participantsCount: number;
}

interface RegistrationStatus {
  isRegistered: boolean;
  hasParticipant: boolean;
  isApproved?: boolean;
  entryStatus?: string;
  votesCount?: number;
}

export default function CompetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCompetition();
      if (user && token) {
        checkRegistrationStatus();
      }
    }
  }, [params.id, user, token]);

  const fetchCompetition = async () => {
    try {
      const response = await fetch(`/api/competitions/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setCompetition(data.data);
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la compétition:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la compétition",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`/api/competitions/${params.id}/join`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setRegistrationStatus(data.data);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  };

  const handleJoinCompetition = async () => {
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/competitions/${params.id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Inscription réussie !",
          description: data.message
        });
        checkRegistrationStatus();
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: "Impossible de s'inscrire à la compétition",
        variant: "destructive"
      });
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCompetitionStatus = (startDate: string, endDate: string, isActive: boolean) => {
    if (!isActive) return { status: 'inactive', label: 'Inactive', color: 'bg-gray-500' };
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'upcoming', label: 'À venir', color: 'bg-blue-500' };
    if (now > end) return { status: 'ended', label: 'Terminée', color: 'bg-gray-500' };
    return { status: 'active', label: 'En cours', color: 'bg-green-500' };
  };

  const getAvatar = (avatar?: string) => {
    return avatar ? `data:image/jpeg;base64,${avatar}` : undefined;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de la compétition...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Card className="card-premium max-w-md p-12 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Compétition introuvable</h2>
            <p className="text-muted-foreground mb-6">
              Cette compétition n'existe pas ou a été supprimée.
            </p>
            <Button asChild>
              <Link href="/competitions">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux compétitions
              </Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const status = getCompetitionStatus(competition.start_date, competition.end_date, competition.is_active);
  const daysRemaining = getDaysRemaining(competition.end_date);
  const canJoin = status.status === 'active' || status.status === 'upcoming';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Banner Image */}
        {competition.banner_image && (
          <div className="relative w-full h-64 md:h-80 overflow-hidden bg-muted">
            <img 
              src={competition.banner_image} 
              alt={competition.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        
        {/* Hero Section */}
        <section className={`relative py-12 overflow-hidden ${competition.banner_image ? 'bg-gradient-to-b from-background to-muted/30' : 'bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10'}`}>
          <div className="container-premium">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/competitions">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux compétitions
              </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <Badge className={`${status.color} text-white border-0`}>
                        {status.label}
                      </Badge>
                      {competition.gender && competition.gender !== 'Mixte' && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-900">
                          {competition.gender === 'Féminin' ? '👩' : '👨'} {competition.gender}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                      {competition.name}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      {competition.description}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <Trophy className="h-12 w-12 text-primary" />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="card-premium">
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-3xl font-bold">{competition.participantsCount}</p>
                      <p className="text-sm text-muted-foreground">Participants</p>
                    </CardContent>
                  </Card>
                  <Card className="card-premium">
                    <CardContent className="p-6 text-center">
                      <Gift className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold">{competition.prizes.length}</p>
                      <p className="text-sm text-muted-foreground">Prix</p>
                    </CardContent>
                  </Card>
                  <Card className="card-premium">
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold">{daysRemaining > 0 ? daysRemaining : 0}</p>
                      <p className="text-sm text-muted-foreground">Jours restants</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Registration Card */}
              <Card className="card-premium bg-gradient-to-br from-primary/5 to-purple-500/5 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Inscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!user ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Connectez-vous pour participer à cette compétition
                      </p>
                      <Button className="w-full" asChild>
                        <Link href="/login">Se connecter</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/register">Créer un compte</Link>
                      </Button>
                    </>
                  ) : registrationStatus?.isRegistered ? (
                    <>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Inscrit</span>
                        </div>
                        <p className="text-sm text-green-600">
                          {registrationStatus.entryStatus === 'approved' 
                            ? `Vous participez à cette compétition avec ${registrationStatus.votesCount || 0} vote(s)`
                            : 'Votre inscription est en attente d\'approbation'}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard">Voir mon dashboard</Link>
                      </Button>
                    </>
                  ) : canJoin ? (
                    <>
                      {!registrationStatus?.hasParticipant ? (
                        <>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                              Vous devez créer un profil participant pour vous inscrire
                            </p>
                          </div>
                          <Button className="w-full" asChild>
                            <Link href="/profile/edit">Créer mon profil</Link>
                          </Button>
                        </>
                      ) : !registrationStatus?.isApproved ? (
                        <>
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-amber-800">
                              Votre profil doit être approuvé par un administrateur
                            </p>
                          </div>
                          <Button variant="outline" className="w-full" disabled>
                            En attente d'approbation
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-muted-foreground">
                            Rejoignez cette compétition et montrez votre style !
                          </p>
                          <Button 
                            className="w-full btn-glow" 
                            onClick={handleJoinCompetition}
                            disabled={registering}
                          >
                            {registering ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Inscription...
                              </>
                            ) : (
                              <>
                                <Trophy className="h-4 w-4 mr-2" />
                                Participer
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600">
                        Les inscriptions sont fermées pour cette compétition
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Début</p>
                        <p className="text-muted-foreground">{formatDate(competition.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Fin</p>
                        <p className="text-muted-foreground">{formatDate(competition.end_date)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Prizes Section */}
        {competition.prizes.length > 0 && (
          <section className="py-16">
            <div className="container-premium">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Prix à gagner</h2>
                <p className="text-muted-foreground">
                  Des récompenses exceptionnelles pour les meilleurs participants
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {competition.prizes.map((prize) => (
                  <Card 
                    key={prize.id} 
                    className={`card-premium ${prize.position === 1 ? 'border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={prize.position === 1 ? 'bg-amber-500' : prize.position === 2 ? 'bg-slate-400' : 'bg-orange-600'}>
                          {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : prize.position === 3 ? '🥉' : `#${prize.position}`}
                          {' '}Position {prize.position}
                        </Badge>
                        {prize.value && (
                          <span className="text-xl font-bold text-primary">{prize.value}€</span>
                        )}
                      </div>
                      <CardTitle className="text-xl">{prize.name}</CardTitle>
                      {prize.description && (
                        <CardDescription>{prize.description}</CardDescription>
                      )}
                    </CardHeader>
                    {prize.sponsor && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Sponsorisé par <span className="font-semibold">{prize.sponsor}</span>
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Participants Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-premium">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Participants</h2>
                <p className="text-muted-foreground">
                  {competition.participantsCount} participant{competition.participantsCount > 1 ? 's' : ''} inscrit{competition.participantsCount > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {competition.participants.length === 0 ? (
              <Card className="card-premium p-12 text-center">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun participant</h3>
                <p className="text-muted-foreground">
                  Soyez le premier à rejoindre cette compétition !
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competition.participants.map((participant, index) => (
                  <Card key={participant.id} className="card-premium overflow-hidden group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage 
                              src={getAvatar(participant.avatar_base64 || participant.primary_photo)} 
                              alt={participant.stage_name} 
                            />
                            <AvatarFallback className="text-xl">
                              {participant.stage_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <Badge className="absolute -bottom-2 -right-2 bg-amber-500 text-white border-0">
                              #{index + 1}
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {participant.stage_name}
                          </CardTitle>
                          <CardDescription className="truncate">
                            {participant.category || 'Style'}
                          </CardDescription>
                          {participant.location && (
                            <p className="text-xs text-muted-foreground mt-1">{participant.location}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {participant.bio}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-rose-500" />
                          <span className="font-semibold">{participant.votes_count}</span>
                          <span className="text-sm text-muted-foreground">votes</span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/participant/${participant.id}`}>
                            Voir profil
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
