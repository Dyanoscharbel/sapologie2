"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trophy, Calendar, Users, Award, Clock, Loader2, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, Footer } from "@/components/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
  participantsCount: number;
  prizes: Array<{
    id: number;
    name: string;
    position: number;
    value?: number;
    image?: string;
  }>;
}

export default function CompetitionsPage() {
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions');
      const data = await response.json();
      
      if (data.success) {
        setCompetitions(data.data);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des compétitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCompetitionStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { status: 'upcoming', label: 'À venir', color: 'bg-blue-500' };
    if (now > end) return { status: 'ended', label: 'Terminée', color: 'bg-gray-500' };
    return { status: 'active', label: 'En cours', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des compétitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
          <div className="container-premium">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border text-sm font-medium">
                <Trophy className="h-4 w-4 text-primary" />
                <span>Compétitions de Sapologie</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="text-gradient">Participez aux</span>
                <br />
                <span className="text-gradient">compétitions</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Rejoignez les compétitions en cours, montrez votre style et gagnez des prix exceptionnels
              </p>
            </div>
          </div>
        </section>

        {/* Competitions List */}
        <section className="py-16">
          <div className="container-premium">
            {competitions.length === 0 ? (
              <Card className="card-premium p-12 text-center">
                <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune compétition active</h3>
                <p className="text-muted-foreground mb-6">
                  Les compétitions seront bientôt disponibles. Revenez plus tard !
                </p>
                <Button asChild>
                  <Link href="/">Retour à l'accueil</Link>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {competitions.map((competition) => {
                  const status = getCompetitionStatus(competition.start_date, competition.end_date);
                  const daysRemaining = getDaysRemaining(competition.end_date);
                  
                  return (
                    <Card key={competition.id} className="card-premium overflow-hidden group hover:shadow-2xl transition-all">
                      {/* Banner Image */}
                      {competition.banner_image && (
                        <div className="relative w-full h-48 overflow-hidden bg-muted">
                          <img 
                            src={competition.banner_image} 
                            alt={competition.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                      )}
                      
                      <CardHeader className="relative pb-4">
                        <div className="absolute top-6 right-6 flex gap-2">
                          <Badge className={`${status.color} text-white border-0`}>
                            {status.label}
                          </Badge>
                          {competition.gender && competition.gender !== 'Mixte' && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-900">
                              {competition.gender === 'Féminin' ? '👩' : '👨'} {competition.gender}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-4">
                          <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                            <Trophy className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                              {competition.name}
                            </CardTitle>
                            <CardDescription className="text-base line-clamp-2">
                              {competition.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Users className="h-4 w-4" />
                              <span className="text-xs font-medium">Participants</span>
                            </div>
                            <p className="text-2xl font-bold">{competition.participantsCount}</p>
                          </div>
                          
                          <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                              <Gift className="h-4 w-4" />
                              <span className="text-xs font-medium">Prix</span>
                            </div>
                            <p className="text-2xl font-bold">{competition.prizes.length}</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground">Date de début</p>
                              <p className="text-muted-foreground">{formatDate(competition.start_date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium text-foreground">Date de fin</p>
                              <p className="text-muted-foreground">
                                {formatDate(competition.end_date)}
                                {status.status === 'active' && daysRemaining > 0 && (
                                  <span className="ml-2 text-primary font-semibold">
                                    ({daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Prizes Preview */}
                        {competition.prizes.length > 0 && (
                          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Award className="h-4 w-4 text-amber-600" />
                              <span className="text-sm font-semibold text-amber-900">Prix à gagner</span>
                            </div>
                            <div className="space-y-3">
                              {competition.prizes.slice(0, 3).map((prize) => (
                                <div key={prize.id} className="flex items-center gap-3 text-sm bg-white/50 rounded-lg p-2">
                                  {prize.image && (
                                    <img 
                                      src={prize.image} 
                                      alt={prize.name}
                                      className="w-10 h-10 object-cover rounded-md"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <Badge variant="secondary" className="bg-amber-200 text-amber-900 mb-1">
                                      {prize.position === 1 ? '🥇' : prize.position === 2 ? '🥈' : '🥉'}
                                    </Badge>
                                    <p className="font-medium text-amber-900 truncate">{prize.name}</p>
                                  </div>
                                  {prize.value && (
                                    <span className="text-amber-700 font-semibold whitespace-nowrap">{prize.value}€</span>
                                  )}
                                </div>
                              ))}
                              {competition.prizes.length > 3 && (
                                <p className="text-xs text-amber-700 mt-2">
                                  +{competition.prizes.length - 3} autre{competition.prizes.length - 3 > 1 ? 's' : ''} prix
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <Button asChild className="flex-1 btn-glow" size="lg">
                            <Link href={`/competitions/${competition.id}`}>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Voir les détails
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {competitions.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container-premium">
              <Card className="card-premium bg-gradient-to-br from-primary/5 to-purple-500/5 border-0">
                <CardContent className="p-8 md:p-12 text-center">
                  <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Prêt à participer ?</h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    {user ? (
                      "Inscrivez-vous à une compétition et montrez votre style unique au monde entier !"
                    ) : (
                      "Créez votre compte pour participer aux compétitions et gagner des prix exceptionnels !"
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {user ? (
                      <Button size="lg" asChild className="btn-glow">
                        <Link href="/profile">
                          <Award className="h-5 w-5 mr-2" />
                          Voir mon profil
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button size="lg" asChild className="btn-glow">
                          <Link href="/register">
                            <Award className="h-5 w-5 mr-2" />
                            Créer un compte
                          </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                          <Link href="/login">Se connecter</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
