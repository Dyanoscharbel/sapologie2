"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, CheckCircle2, Clock, Euro, Eye, Mail, Calendar, X, Loader2, Trash2, Phone, MessageCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  pseudo?: string;
  avatarBase64?: string;
  createdAt: string;
  isActive: boolean;
  status: string;
  participant: any;
  bio?: string;
}

export default function AdminUsersListPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "approved" | "user">("all");

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesQ = q.trim()
        ? [u.name, u.email, u.bio || ''].some(v => v.toLowerCase().includes(q.toLowerCase()))
        : true;
      const matchesStatus = status === "all" ? true : u.status === status;
      return matchesQ && matchesStatus;
    });
  }, [users, q, status]);

  const approve = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isApproved: true,
          stageName: users.find(u => u.id === id)?.name || 'Participant'
        })
      });
      
      if (response.ok) {
        // Recharger les utilisateurs
        await fetchUsers();
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const deleteUser = async (id: number, name: string) => {
    // Confirmation avant suppression
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ?\n\nCette action est irréversible et supprimera également son profil participant et tous ses votes.`)) {
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
        // Recharger les utilisateurs
        await fetchUsers();
      } else {
        const data = await response.json();
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  const pendingCount = users.filter(u => u.status === 'pending' || u.status === 'user').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;

  const statusOptions = [
    { value: "all", label: "Tous", icon: Filter, count: users.length },
    { value: "pending", label: "En attente", icon: Clock, count: pendingCount },
    { value: "approved", label: "Validés", icon: CheckCircle2, count: approvedCount },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900/70">Total utilisateurs</p>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-xl">
                <Filter className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900/70">En attente de validation</p>
                <p className="text-2xl font-bold text-amber-900">{pendingCount}</p>
              </div>
              <div className="p-3 bg-amber-500 rounded-xl">
                <Clock className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Rechercher par nom, email ou bio..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 pr-10 h-11 border-border/50 focus:border-primary"
              />
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-md transition-colors"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isActive = status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setStatus(option.value as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {option.label}
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={cn(
                        "ml-1",
                        isActive && "bg-primary-foreground/20 text-primary-foreground border-0"
                      )}
                    >
                      {option.count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((user) => (
          <Card 
            key={user.id} 
            className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* User Avatar & Info */}
                <div className="flex items-start gap-4 flex-1">
                  {user.avatarBase64 ? (
                    <img 
                      src={`data:image/jpeg;base64,${user.avatarBase64}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Mail className="h-3 w-3" aria-hidden="true" />
                      {user.email}
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {user.bio}
                      </p>
                    )}
                    
                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {user.pseudo && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <span className="font-medium">{user.pseudo}</span>
                        </Badge>
                      )}
                      {user.country && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Globe className="h-2.5 w-2.5" aria-hidden="true" />
                          {user.country}
                        </Badge>
                      )}
                      {user.phone && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Phone className="h-2.5 w-2.5" aria-hidden="true" />
                          Tél.
                        </Badge>
                      )}
                      {user.whatsapp && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <MessageCircle className="h-2.5 w-2.5" aria-hidden="true" />
                          WhatsApp
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {user.createdAt}
                      </div>
                      {user.participant && (
                        <Badge variant="outline" className="text-xs">
                          {user.participant.isApproved ? 'Participant' : 'En attente'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:min-w-[180px]">
                  <Badge 
                    variant={user.status === 'approved' ? 'default' : 'secondary'}
                    className={cn(
                      "px-3 py-1",
                      user.status === 'approved' && 'bg-emerald-500 hover:bg-emerald-600'
                    )}
                  >
                    {user.status === 'approved' ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                        Validé
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                        En attente
                      </>
                    )}
                  </Badge>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="btn-glow">
                      <Link href={`/admin/users/${user.id}`}>
                        <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                        Voir
                      </Link>
                    </Button>
                    {(user.status === 'pending' || user.status === 'user') && (
                      <Button 
                        size="sm" 
                        onClick={() => approve(user.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" aria-hidden="true" />
                        Valider
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteUser(user.id, user.name)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">Aucun utilisateur trouvé</p>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
