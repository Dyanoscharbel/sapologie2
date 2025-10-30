"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prize {
  id: string;
  name: string;
  image: string | null;
}

export default function NewCompetitionPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gender, setGender] = useState("Mixte");
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([
    { id: "1", name: "", image: null },
    { id: "2", name: "", image: null },
  ]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setBannerImage(base64);
      setBannerPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handlePrizeImageUpload = (prizeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPrizes(prizes.map(p => p.id === prizeId ? { ...p, image: base64 } : p));
    };
    reader.readAsDataURL(file);
  };

  const addPrize = () => {
    if (prizes.length < 5) {
      setPrizes([...prizes, { id: String(prizes.length + 1), name: "", image: null }]);
    }
  };

  const removePrize = (prizeId: string) => {
    setPrizes(prizes.filter(p => p.id !== prizeId));
  };

  const updatePrizeName = (prizeId: string, name: string) => {
    setPrizes(prizes.map(p => p.id === prizeId ? { ...p, name } : p));
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
      const response = await fetch('/api/admin/competitions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: title,
          description,
          start_date: startDate,
          end_date: endDate,
          gender,
          banner_image: bannerImage,
          is_active: isActive,
          prizes: prizes.filter(p => p.name.trim()).map((p, index) => ({
            name: p.name,
            image: p.image,
            position: index + 1
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Compétition créée avec succès"
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
        description: "Impossible de créer la compétition",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-foreground">Nouvelle compétition</h1>
          <p className="text-muted-foreground mt-1">Créez une nouvelle compétition</p>
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

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                Type de compétition <span className="text-red-500">*</span>
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mixte">Mixte</SelectItem>
                  <SelectItem value="Masculin">Masculin</SelectItem>
                  <SelectItem value="Féminin">Féminin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bannière */}
            <div className="space-y-2">
              <Label htmlFor="banner">Bannière de la compétition</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                {bannerPreview ? (
                  <div className="space-y-4">
                    <img src={bannerPreview} alt="Bannière" className="w-full h-40 object-cover rounded-lg" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBannerImage(null);
                        setBannerPreview(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Supprimer la bannière
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Glissez-déposez ou cliquez pour uploader une bannière
                    </p>
                    <input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("banner")?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir une image
                    </Button>
                  </div>
                )}
              </div>
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
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Prix et récompenses</Label>
                <span className="text-sm text-muted-foreground">{prizes.length}/5 prix</span>
              </div>
              <div className="space-y-4">
                {prizes.map((prize, index) => (
                  <Card key={prize.id} className="p-4">
                    <div className="space-y-4">
                      {/* Position Medal */}
                      <div className="text-sm font-medium">
                        {index === 0 ? "🥇 1er prix" : index === 1 ? "🥈 2e prix" : index === 2 ? "🥉 3e prix" : `🏅 ${index + 1}e prix`}
                      </div>

                      {/* Prix Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`prize-name-${prize.id}`}>Description du prix</Label>
                        <Input
                          id={`prize-name-${prize.id}`}
                          value={prize.name}
                          onChange={(e) => updatePrizeName(prize.id, e.target.value)}
                          placeholder={index === 0 ? "Ex: 500€ + Couronne" : index === 1 ? "Ex: 300€" : "Ex: 150€"}
                        />
                      </div>

                      {/* Prize Image */}
                      <div className="space-y-2">
                        <Label htmlFor={`prize-image-${prize.id}`}>Image du prix</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                          {prize.image ? (
                            <div className="space-y-2">
                              <img src={prize.image} alt="Prix" className="w-full h-24 object-cover rounded-lg" />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPrizes(prizes.map(p => p.id === prize.id ? { ...p, image: null } : p))}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Supprimer
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2 py-4">
                              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                              <input
                                id={`prize-image-${prize.id}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePrizeImageUpload(prize.id, e)}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById(`prize-image-${prize.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Ajouter une image
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Remove Prize Button */}
                      {prizes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removePrize(prize.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Supprimer ce prix
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {prizes.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addPrize}
                >
                  + Ajouter un prix
                </Button>
              )}
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
                    Création...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Créer la compétition
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
