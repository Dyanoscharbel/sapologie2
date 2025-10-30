"use client";

import { useState } from "react";
import { Crown, Heart, User, Star, Instagram, Youtube, Linkedin, Twitter, Globe, Camera, ArrowLeft, Share2, MapPin, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Navigation, Footer } from "@/components/navigation";
import { mockParticipants } from "@/lib/participants-data";

const socialIcons = {
  instagram: { icon: Instagram, color: "text-pink-500", bgColor: "bg-pink-50", label: "Instagram" },
  youtube: { icon: Youtube, color: "text-red-500", bgColor: "bg-red-50", label: "YouTube" },
  tiktok: { icon: Camera, color: "text-black", bgColor: "bg-gray-100", label: "TikTok" },
  linkedin: { icon: Linkedin, color: "text-blue-500", bgColor: "bg-blue-50", label: "LinkedIn" },
  twitter: { icon: Twitter, color: "text-blue-400", bgColor: "bg-blue-50", label: "Twitter" },
  website: { icon: Globe, color: "text-gray-600", bgColor: "bg-gray-100", label: "Site Web" }
};

export default function ParticipantDetailPage() {
  const params = useParams();
  const participantId = parseInt(params.id as string);
  
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  
  const participant = mockParticipants.find(p => p.id === participantId);
  
  if (!participant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Participant introuvable</h2>
              <p className="text-muted-foreground mb-6">
                Désolé, nous n'avons pas pu trouver ce participant.
              </p>
              <Button asChild className="btn-glow">
                <Link href="/vote">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux participants
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const handleVote = () => {
    if (!hasVoted) {
      setHasVoted(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild className="btn-glow">
              <Link href="/vote" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Retour aux participants
              </Link>
            </Button>
          </div>

          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="h-48 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/placeholder-1.svg')] opacity-10 mix-blend-overlay" aria-hidden="true" />
            </div>
            <div className="relative -mt-20 px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={participant.photos[0]} />
                  <AvatarFallback className="text-4xl">{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 sm:mb-4">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{participant.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {participant.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {participant.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleVote}
                    disabled={hasVoted}
                    size="lg"
                    className={`btn-glow ${hasVoted ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                  >
                    {hasVoted ? (
                      <>
                        <Heart className="h-5 w-5 mr-2 fill-current" />
                        Voté !
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 mr-2" />
                        Voter
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-square bg-gradient-to-br from-primary/5 to-purple-500/5">
                    <img
                      src={participant.photos[currentPhotoIndex]}
                      alt={`${participant.name} - Photo ${currentPhotoIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                        {currentPhotoIndex + 1} / {participant.photos.length}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Thumbnails */}
                  {participant.photos.length > 1 && (
                    <div className="p-4 bg-muted/30">
                      <div className="flex gap-3 overflow-x-auto">
                        {participant.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPhotoIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                              index === currentPhotoIndex 
                                ? "border-primary scale-110 shadow-lg" 
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img
                              src={photo}
                              alt={`Miniature ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bio */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    À propos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {participant.bio}
                  </p>
                  
                  {participant.inspiration && (
                    <>
                      <Separator />
                      <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-2">Source d'inspiration</h4>
                            <p className="text-muted-foreground italic">
                              "{participant.inspiration}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Heart className="h-5 w-5 text-purple-600" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Votes</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{participant.votes}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Camera className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Photos</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{participant.photos.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Info */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Âge</span>
                    <span className="font-semibold">{participant.age} ans</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Style favori</span>
                    <Badge variant="outline">{participant.favoriteStyle}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Membre depuis</span>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Calendar className="h-3 w-3" />
                      {participant.joinDate}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Localisation</span>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MapPin className="h-3 w-3" />
                      {participant.location}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              {Object.values(participant.socialLinks).some(link => link) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Réseaux sociaux</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(participant.socialLinks).map(([platform, handle]) => {
                      if (!handle) return null;
                      const social = socialIcons[platform as keyof typeof socialIcons];
                      const Icon = social.icon;
                      
                      return (
                        <a
                          key={platform}
                          href="#"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors group"
                        >
                          <div className={`p-2 ${social.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                            <Icon className={`h-4 w-4 ${social.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{social.label}</p>
                            <p className="text-sm font-medium">{handle}</p>
                          </div>
                        </a>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
