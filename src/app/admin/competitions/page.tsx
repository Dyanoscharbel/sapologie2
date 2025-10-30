"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Trophy, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Trash2,
  Edit,
  Eye,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Competition {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startDateFormatted?: string;
  endDateFormatted?: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCompetitionsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchCompetitions();
    }
  }, [token]);

  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/admin/competitions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCompetitions(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des compétitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompetition = async (id: number, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la compétition "${title}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchCompetitions();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de la compétition');
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const comp = competitions.find(c => c.id === id);
      if (!comp) return;

      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: comp.title,
          description: comp.description,
          startDate: comp.startDate, // Déjà au format YYYY-MM-DD
          endDate: comp.endDate, // Déjà au format YYYY-MM-DD
          prizeFirst: comp.prizeFirst,
          prizeSecond: comp.prizeSecond,
          prizeThird: comp.prizeThird,
          isActive: !currentStatus
        })
      });
      
      if (response.ok) {
        await fetchCompetitions();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const filteredCompetitions = competitions.filter(comp =>
    comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = competitions.filter(c => c.isActive).length;
  const inactiveCount = competitions.filter(c => !c.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des compétitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compétitions</h1>
          <p className="text-muted-foreground mt-1">Gérez les compétitions et concours</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/competitions/new')}
          className="btn-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle compétition
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/70">Total</p>
                <p className="text-2xl font-bold text-blue-900">{competitions.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900/70">Actives</p>
                <p className="text-2xl font-bold text-emerald-900">{activeCount}</p>
              </div>
              <div className="p-3 bg-emerald-500 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900/70">Inactives</p>
                <p className="text-2xl font-bold text-amber-900">{inactiveCount}</p>
              </div>
              <div className="p-3 bg-amber-500 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une compétition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-border/50 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Competitions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCompetitions.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Aucune compétition trouvée' : 'Aucune compétition'}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {searchQuery ? 'Essayez avec d\'autres termes' : 'Commencez par créer votre première compétition'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => router.push('/admin/competitions/new')}
                  className="btn-glow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une compétition
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredCompetitions.map((comp) => (
            <Card 
              key={comp.id}
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Competition Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {comp.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {comp.description || 'Aucune description'}
                        </p>
                      </div>
                      <Badge 
                        variant={comp.isActive ? 'default' : 'secondary'}
                        className={cn(
                          "ml-4",
                          comp.isActive && 'bg-emerald-500 hover:bg-emerald-600'
                        )}
                      >
                        {comp.isActive ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Début: {comp.startDateFormatted || comp.startDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        Fin: {comp.endDateFormatted || comp.endDate}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Créée le {comp.createdAt}
                      </div>
                    </div>
                    
                    {/* Prix */}
                    {(comp.prizeFirst || comp.prizeSecond || comp.prizeThird) && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Prix :</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.prizeFirst && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              🥇 {comp.prizeFirst}
                            </Badge>
                          )}
                          {comp.prizeSecond && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              🥈 {comp.prizeSecond}
                            </Badge>
                          )}
                          {comp.prizeThird && (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              🥉 {comp.prizeThird}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:min-w-[180px]">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/admin/competitions/${comp.id}/entries`)}
                      className="btn-glow"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Inscriptions
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/competitions/${comp.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant={comp.isActive ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleActive(comp.id, comp.isActive)}
                    >
                      {comp.isActive ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCompetition(comp.id, comp.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
