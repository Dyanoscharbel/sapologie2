"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Competition {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  prizeFirst: string;
  prizeSecond: string;
  prizeThird: string;
  isActive: boolean;
}

export default function EditCompetitionPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const { toast } = useToast();
  const id = Number(params.id);
  
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [prizeFirst, setPrizeFirst] = useState("");
  const [prizeSecond, setPrizeSecond] = useState("");
  const [prizeThird, setPrizeThird] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (token && id) {
      fetchCompetition();
    }
  }, [token, id]);

  const fetchCompetition = async () => {
    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const comp = data.data;
        setCompetition(comp);
        setTitle(comp.title);
        setDescription(comp.description);
        setStartDate(comp.startDate);
        setEndDate(comp.endDate);
        setPrizeFirst(comp.prizeFirst || '');
        setPrizeSecond(comp.prizeSecond || '');
        setPrizeThird(comp.prizeThird || '');
        setIsActive(comp.isActive);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la compétition:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être postérieure à la date de début",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/admin/competitions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          startDate,
          endDate,
          prizeFirst,
          prizeSecond,
          prizeThird,
          isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Compétition mise à jour avec succès"
        });
        router.push('/admin/competitions');
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la compétition",
        variant: "destructive"
      });
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

  if (!competition) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full border-0 shadow-xl">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium text-foreground mb-4">
              Compétition non trouvée
            </p>
            <Button onClick={() => router.push('/admin/competitions')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push("/admin/competitions")}
          className="btn-glow"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier la compétition</h1>
          <p className="text-muted-foreground mt-1">{competition.title}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Informations de la compétition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Titre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Concours Miss FOFO 2025"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez la compétition..."
                rows={4}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Date de fin <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Prix */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Prix et récompenses</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prizeFirst">🥇 1er prix</Label>
                  <Input
                    id="prizeFirst"
                    value={prizeFirst}
                    onChange={(e) => setPrizeFirst(e.target.value)}
                    placeholder="Ex: 500€ + Couronne"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prizeSecond">🥈 2e prix</Label>
                  <Input
                    id="prizeSecond"
                    value={prizeSecond}
                    onChange={(e) => setPrizeSecond(e.target.value)}
                    placeholder="Ex: 300€"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prizeThird">🥉 3e prix</Label>
                  <Input
                    id="prizeThird"
                    value={prizeThird}
                    onChange={(e) => setPrizeThird(e.target.value)}
                    placeholder="Ex: 150€"
                  />
                </div>
              </div>
            </div>

            {/* Statut actif */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">
                  Compétition active
                </Label>
                <p className="text-sm text-muted-foreground">
                  Les utilisateurs peuvent voter dès maintenant
                </p>
              </div>
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/competitions')}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="btn-glow"
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
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
