"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowLeft,
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Entry {
  entry_id: number;
  competition_id: number;
  participant_id: number;
  entry_status: string;
  votes_count: number;
  entry_date: string;
  id: number;
  user_id: number;
  stage_name: string;
  bio: string;
  style: string;
  photo_base64?: string;
  participant_approved: boolean;
  first_name: string;
  last_name: string;
  email: string;
}

interface GroupedEntries {
  pending: Entry[];
  approved: Entry[];
  rejected: Entry[];
  total: number;
}

export default function CompetitionEntriesPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const competitionId = params?.id as string;
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [groupedEntries, setGroupedEntries] = useState<GroupedEntries | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (token && competitionId) {
      fetchEntries();
    }
  }, [token, competitionId]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/competitions/${competitionId}/entries`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setEntries(data.allEntries);
        setGroupedEntries(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEntryStatus = async (entryId: number, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const response = await fetch(`/api/admin/competitions/entries/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await fetchEntries();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const removeEntry = async (entryId: number, stageName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer "${stageName}" de cette compétition ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/competitions/entries/${entryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await fetchEntries();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'inscription');
    }
  };

  const getFilteredEntries = () => {
    let filtered = entries;

    if (activeTab !== 'all') {
      filtered = entries.filter(e => e.entry_status === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.stage_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredEntries = getFilteredEntries();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des inscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/competitions')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inscriptions</h1>
            <p className="text-muted-foreground mt-1">Gérez les participants à cette compétition</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {groupedEntries && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900/70">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{groupedEntries.total}</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-900/70">En attente</p>
                  <p className="text-2xl font-bold text-amber-900">{groupedEntries.pending.length}</p>
                </div>
                <div className="p-3 bg-amber-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-900/70">Approuvées</p>
                  <p className="text-2xl font-bold text-emerald-900">{groupedEntries.approved.length}</p>
                </div>
                <div className="p-3 bg-emerald-500 rounded-xl">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-900/70">Rejetées</p>
                  <p className="text-2xl font-bold text-red-900">{groupedEntries.rejected.length}</p>
                </div>
                <div className="p-3 bg-red-500 rounded-xl">
                  <XCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              Tous ({entries.length})
            </Button>
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('pending')}
              className={activeTab === 'pending' ? 'bg-amber-500 hover:bg-amber-600' : ''}
            >
              <Clock className="h-4 w-4 mr-1" />
              En attente ({groupedEntries?.pending.length || 0})
            </Button>
            <Button
              variant={activeTab === 'approved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('approved')}
              className={activeTab === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approuvées ({groupedEntries?.approved.length || 0})
            </Button>
            <Button
              variant={activeTab === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('rejected')}
              className={activeTab === 'rejected' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejetées ({groupedEntries?.rejected.length || 0})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un participant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-border/50 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEntries.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Aucune inscription trouvée' : 'Aucune inscription'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery 
                  ? 'Essayez avec d\'autres termes' 
                  : 'Les participants inscrits à cette compétition apparaîtront ici'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card 
              key={entry.entry_id}
              className="group border-0 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Photo */}
                  {entry.photo_base64 && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={entry.photo_base64} 
                        alt={entry.stage_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Participant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {entry.stage_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {entry.first_name} {entry.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          variant="outline"
                          className={cn(
                            entry.entry_status === 'approved' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            entry.entry_status === 'pending' && 'bg-amber-50 text-amber-700 border-amber-200',
                            entry.entry_status === 'rejected' && 'bg-red-50 text-red-700 border-red-200'
                          )}
                        >
                          {entry.entry_status === 'approved' && <><CheckCircle2 className="h-3 w-3 mr-1" /> Approuvée</>}
                          {entry.entry_status === 'pending' && <><Clock className="h-3 w-3 mr-1" /> En attente</>}
                          {entry.entry_status === 'rejected' && <><XCircle className="h-3 w-3 mr-1" /> Rejetée</>}
                        </Badge>
                        <Badge variant="outline">
                          <Trophy className="h-3 w-3 mr-1" />
                          {entry.votes_count} votes
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {entry.style && (
                        <p className="text-sm">
                          <span className="font-medium">Style:</span> {entry.style}
                        </p>
                      )}
                      {entry.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.bio}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Inscrit le {new Date(entry.entry_date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-2 lg:min-w-[160px]">
                    {entry.entry_status !== 'approved' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => updateEntryStatus(entry.entry_id, 'approved')}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    {entry.entry_status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateEntryStatus(entry.entry_id, 'rejected')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    )}
                    {entry.entry_status !== 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateEntryStatus(entry.entry_id, 'pending')}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        En attente
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeEntry(entry.entry_id, entry.stage_name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Retirer
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
