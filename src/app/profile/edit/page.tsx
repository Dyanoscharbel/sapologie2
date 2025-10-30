'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  User, 
  Camera,
  Save,
  ArrowLeft,
  Upload,
  X,
  Star,
  CheckCircle2,
  ImageIcon,
  Trash2,
  Mail,
  Lock,
  Share2,
  Plus,
  Link as LinkIcon
} from 'lucide-react';
import { Navigation, Footer } from '@/components/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { FaInstagram, FaFacebook, FaTwitter, FaTiktok, FaYoutube, FaLinkedin, FaSnapchat, FaWhatsapp, FaTelegram, FaPinterest, FaTwitch, FaDiscord } from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import { Globe, Link2 } from 'lucide-react';

interface Media {
  id: number;
  type: string;
  base64: string;
  fileName?: string;
  isPrimary: boolean;
  position: number;
}

interface SocialLink {
  id?: number;
  platform: string;
  username: string;
  url: string;
}

const SOCIAL_PLATFORMS = [
  { value: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { value: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { value: 'twitter', label: 'Twitter / X', icon: SiX, color: '#000000' },
  { value: 'tiktok', label: 'TikTok', icon: FaTiktok, color: '#000000' },
  { value: 'youtube', label: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { value: 'snapchat', label: 'Snapchat', icon: FaSnapchat, color: '#FFFC00' },
  { value: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { value: 'telegram', label: 'Telegram', icon: FaTelegram, color: '#26A5E4' },
  { value: 'pinterest', label: 'Pinterest', icon: FaPinterest, color: '#E60023' },
  { value: 'twitch', label: 'Twitch', icon: FaTwitch, color: '#9146FF' },
  { value: 'discord', label: 'Discord', icon: FaDiscord, color: '#5865F2' },
  { value: 'website', label: 'Site Web', icon: Globe, color: '#6B7280' },
  { value: 'other', label: 'Autre', icon: Link2, color: '#6B7280' },
];

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatarBase64?: string;
  participant?: {
    id: number;
    stageName: string;
    bio: string;
    category?: string;
    location?: string;
    age?: number;
    media: Media[];
    socialLinks: SocialLink[];
  } | null;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { token, user: authUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | undefined>(undefined);
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<number | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [media, setMedia] = useState<Media[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [token, authLoading]);

  const fetchProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const userData = data.data;
        setUser(userData);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setEmail(userData.email || '');
        setAvatarBase64(userData.avatarBase64);
        setAvatarPreview(userData.avatarBase64 ? `data:image/jpeg;base64,${userData.avatarBase64}` : undefined);
        
        if (userData.participant) {
          setStageName(userData.participant.stageName || '');
          setBio(userData.participant.bio || '');
          setLocation(userData.participant.location || '');
          setAge(userData.participant.age);
          setMedia(userData.participant.media || []);
          setSocialLinks(userData.participant.socialLinks || []);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le profil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5 Mo",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setAvatarBase64(base64Data);
      setAvatarPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (media.length >= 5) {
      toast({
        title: "Limite atteinte",
        description: "Vous pouvez uploader maximum 5 photos",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale est de 5 Mo",
        variant: "destructive"
      });
      return;
    }

    setUploadingMedia(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];

        const response = await fetch('/api/user/media', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mediaData: base64Data,
            mediaType: file.type,
            fileName: file.name,
            isPrimary: media.length === 0
          })
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Succès",
            description: "Photo ajoutée avec succès"
          });
          fetchProfile(); // Recharger le profil
        } else {
          toast({
            title: "Erreur",
            description: data.message,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Erreur upload:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'uploader la photo",
          variant: "destructive"
        });
      } finally {
        setUploadingMedia(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) return;

    try {
      const response = await fetch(`/api/user/media?id=${mediaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Photo supprimée avec succès"
        });
        fetchProfile();
      } else {
        toast({
          title: "Erreur",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo",
        variant: "destructive"
      });
    }
  };

  const handleSetPrimary = async (mediaId: number) => {
    try {
      const response = await fetch('/api/user/media', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mediaId })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Photo de profil mise à jour"
        });
        fetchProfile();
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
        description: "Impossible de définir la photo principale",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider les mots de passe
    if (password && password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: password || undefined,
          avatarBase64,
          participant: user?.participant ? {
            stageName,
            bio,
            location,
            age: age || null
          } : undefined,
          socialLinks
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès"
        });
        router.push('/dashboard');
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
        description: "Impossible de sauvegarder le profil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex flex-col">
      <Navigation user={{ name: user.name, isLoggedIn: true }} />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Modifier mon profil</h1>
            <p className="text-muted-foreground mt-2">Personnalisez vos informations et ajoutez vos photos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo de profil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Photo de profil
                </CardTitle>
                <CardDescription>Ajoutez ou modifiez votre avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="text-3xl">
                      {firstName.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-fit">
                        <Upload className="h-4 w-4" />
                        <span>Changer la photo</span>
                      </div>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG ou GIF. Max 5 Mo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Laisser vide pour ne pas changer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmer le nouveau mot de passe"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations participant */}
            {user.participant && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Profil participant
                  </CardTitle>
                  <CardDescription>Informations visibles sur votre profil public</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stageName">Nom de scène *</Label>
                    <Input
                      id="stageName"
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      placeholder="Votre nom de scène"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Présentez-vous en quelques mots..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: Paris"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Âge</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age || ''}
                        onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="25"
                      />
                    </div>
                  </div>

                  {/* Liens sociaux */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Réseaux sociaux
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSocialLinks([...socialLinks, { platform: '', username: '', url: '' }])}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un lien
                      </Button>
                    </div>
                    
                    {socialLinks.length > 0 ? (
                      <div className="space-y-3">
                        {socialLinks.map((link, index) => (
                          <div key={index} className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                              <Select
                                value={link.platform}
                                onValueChange={(value) => {
                                  const newLinks = [...socialLinks];
                                  newLinks[index].platform = value;
                                  setSocialLinks(newLinks);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  {link.platform ? (() => {
                                    const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.value === link.platform);
                                    if (selectedPlatform) {
                                      const IconComponent = selectedPlatform.icon;
                                      return (
                                        <div className="flex items-center gap-2">
                                          <IconComponent style={{ color: selectedPlatform.color }} className="h-4 w-4 flex-shrink-0" />
                                          <span>{selectedPlatform.label}</span>
                                        </div>
                                      );
                                    }
                                    return <SelectValue placeholder="Choisir une plateforme" />;
                                  })() : <span className="text-muted-foreground">Choisir une plateforme</span>}
                                </SelectTrigger>
                                <SelectContent>
                                  {SOCIAL_PLATFORMS.map((platform) => {
                                    const IconComponent = platform.icon;
                                    return (
                                      <SelectItem key={platform.value} value={platform.value}>
                                        <span className="flex items-center gap-2">
                                          <IconComponent style={{ color: platform.color }} className="h-4 w-4" />
                                          <span>{platform.label}</span>
                                        </span>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Nom d'utilisateur"
                                value={link.username}
                                onChange={(e) => {
                                  const newLinks = [...socialLinks];
                                  newLinks[index].username = e.target.value;
                                  setSocialLinks(newLinks);
                                }}
                              />
                              <Input
                                placeholder="URL complète"
                                value={link.url}
                                onChange={(e) => {
                                  const newLinks = [...socialLinks];
                                  newLinks[index].url = e.target.value;
                                  setSocialLinks(newLinks);
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Aucun lien ajouté. Cliquez sur "Ajouter un lien" pour commencer.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Galerie photos */}
            {user.participant && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Galerie photos ({media.length}/5)
                  </CardTitle>
                  <CardDescription>
                    Ajoutez jusqu'à 5 photos. Cliquez sur une photo pour la définir comme principale.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {media.map((m) => (
                      <div key={m.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                        <img
                          src={`data:image/jpeg;base64,${m.base64}`}
                          alt={m.fileName || 'Media'}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => !m.isPrimary && handleSetPrimary(m.id)}
                        />
                        {m.isPrimary && (
                          <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Principal
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(m.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {/* Upload button */}
                    {media.length < 5 && (
                      <Label htmlFor="media" className="cursor-pointer">
                        <div className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50">
                          {uploadingMedia ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Ajouter une photo</span>
                            </>
                          )}
                        </div>
                        <Input
                          id="media"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleMediaUpload}
                          disabled={uploadingMedia}
                        />
                      </Label>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="submit" disabled={saving} className="flex-1">
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
              <Button type="button" variant="outline" asChild>
                <Link href="/profile">Annuler</Link>
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
