"use client";

import { useState, useEffect } from "react";
import { Crown, TrendingUp, Users, Trophy, Camera, Vote, Heart, ChevronRight, Calendar, Star, Award, User, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";


interface DashboardData {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  stats: {
    votes: number;
    photos: number;
    position: number;
    isApproved: boolean;
  };
  participant: {
    id: number;
    stageName: string;
    bio: string;
    category?: string;
    location?: string;
    age?: number;
  } | null;
  topParticipants: Array<{
    id: number;
    name: string;
    votes: number;
    avatar?: string;
    position: number;
    category?: string;
  }>;
  suggested: Array<{
    id: number;
    name: string;
    style: string;
    avatar?: string;
  }>;
  recentActivity: Array<{
    type: string;
    text: string;
    time: string;
  }>;
}

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attendre que AuthContext ait fini de charger
    if (authLoading) {
      return;
    }
    
    // Rediriger si pas connecté
    if (!token || !user) {
      router.push("/login");
      return;
    }
    
    fetchDashboardData();
  }, [authLoading, token, user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      } else {
        console.error('Erreur:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  const { user: currentUser, stats, topParticipants, suggested, recentActivity } = dashboardData;
  
  // Calculer la progression vers la position suivante
  const nextPosition = topParticipants.find(p => p.position === stats.position - 1);
  const progressToNext = nextPosition ? Math.min(100, (stats.votes / nextPosition.votes) * 100) : 0;
  
  // Avatar avec base64
  const getUserAvatar = (avatar?: string) => {
    return avatar ? `data:image/jpeg;base64,${avatar}` : undefined;
  };
  
  // Icônes pour l'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vote_given': return Heart;
      case 'vote_received': return Star;
      case 'photo': return Camera;
      case 'rank': return Trophy;
      default: return Heart;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
          {/* Hero Welcome Section */}
          <Card className="relative mb-8 overflow-hidden border-none shadow-2xl">
            {/* Background avec gradient moderne et pattern */}
            <div className="relative h-56 bg-gradient-to-br from-primary via-[#C8A200] to-[#B8860B]">
              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>
              
              {/* Orbs décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full opacity-20 blur-3xl" />
              
              {/* Badge de position */}
              {stats.position > 0 && (
                <div className="absolute top-6 right-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:blur-lg transition-all" />
                    <div className="relative px-5 py-2.5 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          #{stats.position}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contenu du header */}
              <div className="relative h-full flex items-center px-8">
                <div className="flex items-center gap-6 w-full">
                  {/* Avatar avec effet glassmorphism */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <Avatar className="relative h-28 w-28 border-4 border-white/30 shadow-2xl ring-4 ring-white/10 transition-transform group-hover:scale-105">
                      <AvatarImage src={getUserAvatar(currentUser.avatar)} alt={currentUser.name} className="object-cover" />
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-bold">
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Informations */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-lg flex items-center gap-3">
                        Bienvenue, {currentUser.name} ✨
                      </h1>
                      <p className="text-white/90 text-sm md:text-base font-medium drop-shadow">
                        {stats.isApproved 
                          ? (stats.position > 0 ? `Vous êtes actuellement en position #${stats.position}` : "Commencez à briller dans le concours !") 
                          : "Votre compte est en attente de validation"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section inférieure avec info */}
            <div className="bg-white px-8 py-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </div>
                {stats.isApproved && (
                  <>
                    <div className="h-4 w-px bg-border" />
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      <Award className="h-3 w-3 mr-1" />
                      Compte validé
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Votes reçus</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.votes}</p>
                    <p className="text-xs text-muted-foreground mt-1">Continuez à partager !</p>
                  </div>
                  <div className="p-4 bg-primary rounded-2xl">
                    <Heart className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Mes photos</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.photos}</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5 autorisé</p>
                  </div>
                  <div className="p-4 bg-primary rounded-2xl">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Participants</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{topParticipants.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Dans le concours</p>
                  </div>
                  <div className="p-4 bg-primary rounded-2xl">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/20 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/70">Classement</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stats.position > 0 ? `#${stats.position}` : "-"}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stats.position > 0 && stats.position <= 10 ? "Top 10 🔥" : "Gagnez des places !"}</p>
                  </div>
                  <div className="p-4 bg-primary rounded-2xl">
                    <Award className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Right Sidebar - Actions rapides */}
            <div className="lg:order-2 space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <Button asChild className="h-auto py-4 flex-col gap-2 bg-primary hover:bg-primary/90">
                      <Link href="/dashboard/profile">
                        <Camera className="h-6 w-6" />
                        <span className="font-medium">Gérer mes photos</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2">
                      <Link href="/rules">
                        <Trophy className="h-6 w-6" />
                        <span className="font-medium">Règles du concours</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 lg:order-1 space-y-6">
              {/* Progression Card */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Votre progression
                  </CardTitle>
                  <CardDescription>
                    {nextPosition 
                      ? `Encore ${nextPosition.votes - stats.votes} votes pour atteindre la position #${nextPosition.position}`
                      : "Continuez votre progression !"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nextPosition && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Progression vers #{nextPosition.position}</span>
                        <span className="text-muted-foreground">{stats.votes}/{nextPosition.votes}</span>
                      </div>
                      <Progress value={progressToNext} className="h-3" />
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Crown className="h-5 w-5 text-primary" />
                      Top 10 Participants
                    </h4>
                    <div className="space-y-3">
                      {topParticipants.slice(0, 10).map((participant) => (
                        <div key={participant.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          participant.id === dashboardData.participant?.id 
                            ? 'bg-white shadow-md border-2 border-primary/30' 
                            : 'bg-white/50'
                        }`}>
                          <Badge variant={participant.position === 1 ? "default" : "secondary"} className={`${
                            participant.position === 1 ? 'bg-amber-500' : ''
                          } min-w-[2rem] justify-center`}>
                            #{participant.position}
                          </Badge>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={getUserAvatar(participant.avatar)} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{participant.name}</p>
                            <p className="text-xs text-muted-foreground">{participant.votes} votes</p>
                          </div>
                          {participant.id === dashboardData.participant?.id && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">Vous</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Activité récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.length > 0 ? (
                      recentActivity.slice(0, showAll ? undefined : 3).map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{activity.text}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">Aucune activité récente</p>
                    )}
                  </div>
                  {recentActivity.length > 3 && (
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4"
                      onClick={() => setShowAll(!showAll)}
                    >
                      {showAll ? "Voir moins" : "Voir plus"}
                      <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Removed duplicate navigation items */}
          </div>
    </div>
  );
}
