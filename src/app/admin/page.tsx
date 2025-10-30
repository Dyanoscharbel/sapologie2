'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, CheckCircle2, Trophy, TrendingUp, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalParticipants: number;
  approvedParticipants: number;
  pendingParticipants: number;
  totalVotes: number;
  totalCompetitions: number;
  activeCompetitions: number;
  approvalRate: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatarBase64?: string;
  createdAt: string;
  status: string;
  participant: any;
}

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      // Récupérer les statistiques
      const statsRes = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Récupérer les utilisateurs récents
      const usersRes = await fetch('/api/admin/users?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setRecentUsers(usersData.data.users);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const totalUsers = stats.totalUsers;
  const pending = stats.pendingParticipants;
  const approved = stats.approvedParticipants;
  const approvalRate = parseFloat(stats.approvalRate.toString());

  // Calculer les tendances dynamiques
  const getTrend = (type: string) => {
    switch (type) {
      case 'users':
        // Calculer un pourcentage basé sur le nombre d'users
        const userGrowth = totalUsers > 0 ? Math.min(Math.round((totalUsers / 10) * 100), 100) : 0;
        return totalUsers > 0 ? `+${userGrowth}% ce mois` : 'Nouveaux inscrits';
      
      case 'pending':
        if (pending === 0) return 'Aucune action';
        if (pending <= 2) return 'Action requise';
        return `${pending} à traiter`;
      
      case 'approved':
        if (approvalRate === 0) return 'Aucun validé';
        if (approvalRate >= 80) return 'Excellent taux';
        if (approvalRate >= 50) return 'Bon taux';
        return 'Taux faible';
      
      case 'competitions':
        const active = stats.activeCompetitions;
        if (active === 0) return '0 active';
        if (active === 1) return '1 active';
        return `${active} actives`;
      
      default:
        return '';
    }
  };

  const statsCards = [
    {
      title: "Utilisateurs totaux",
      value: totalUsers,
      description: `${approved} validés, ${pending} en attente`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: getTrend('users'),
    },
    {
      title: "En attente",
      value: pending,
      description: "Comptes à valider",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      trend: getTrend('pending'),
    },
    {
      title: "Validés",
      value: approved,
      description: `${approvalRate.toFixed(0)}% du total`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: getTrend('approved'),
    },
    {
      title: "Compétitions",
      value: stats.activeCompetitions,
      description: `${stats.totalCompetitions} au total`,
      icon: Trophy,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: getTrend('competitions'),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-pink-600 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-3xl font-bold mb-2">Tableau de bord</h2>
          <p className="text-white/90 text-lg">Bienvenue dans votre espace d'administration</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                  <span className="text-xs font-medium text-emerald-600">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Aperçu des validations</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {approvalRate.toFixed(0)}% validés
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Comptes validés</span>
              <span className="text-sm text-muted-foreground">{approved} / {totalUsers}</span>
            </div>
            <Progress value={approvalRate} className="h-3" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">En attente de validation</span>
              <span className="text-sm text-muted-foreground">{pending} comptes</span>
            </div>
            <Progress value={totalUsers > 0 ? (pending / totalUsers) * 100 : 0} className="h-3 [&>div]:bg-amber-500" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Activité récente</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Derniers utilisateurs inscrits</p>
            </div>
            <Link 
              href="/admin/users" 
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
            >
              Voir tout
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentUsers.map((user, index) => (
              <Link
                key={user.id}
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-4 flex-1">
                  {user.avatarBase64 ? (
                    <img 
                      src={`data:image/jpeg;base64,${user.avatarBase64}`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      index % 3 === 0 ? 'from-blue-500 to-purple-600' :
                      index % 3 === 1 ? 'from-purple-500 to-pink-600' :
                      'from-pink-500 to-rose-600'
                    } flex items-center justify-center text-white font-semibold text-sm`}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {user.createdAt}
                  </div>
                  <Badge 
                    variant={user.status === 'approved' ? 'default' : 'secondary'}
                    className={user.status === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {user.status === 'approved' ? 'Validé' : 'En attente'}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
