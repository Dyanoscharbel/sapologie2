"use client";

import { useState } from "react";
import { Crown, Heart, Trophy, Filter, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation, Footer } from "@/components/navigation";
import { mockParticipants } from "@/lib/participants-data";

export default function VotePage() {
  const [participants, setParticipants] = useState([...mockParticipants]);
  const [votedFor, setVotedFor] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("votes");
  const [filterBy, setFilterBy] = useState("all");

  const filteredAndSortedParticipants = participants
    .filter(participant => filterBy === "all" || participant.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case "votes":
          return b.votes - a.votes;
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  const handleVote = (participantId: number) => {
    if (!votedFor.includes(participantId)) {
      setVotedFor([...votedFor, participantId]);
      setParticipants(prev => 
        prev.map(p => 
          p.id === participantId 
            ? { ...p, votes: p.votes + 1 }
            : p
        )
      );
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-amber-500" aria-hidden="true" />;
      case 1:
        return <Trophy className="h-5 w-5 text-slate-400" aria-hidden="true" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-700" aria-hidden="true" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const categories = ["all", "Classique", "Streetwear", "Elegant", "Tendance", "Chic"];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-20">
          <div className="container-premium">
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                Votez pour vos <span className="text-gradient">styles préférés</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Découvrez tous les participants et aidez à élire le roi de la sapologie !
              </p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="card-premium p-4 hover-lift">
                  <div className="text-2xl font-bold text-primary">{participants.length}</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </div>
                <div className="card-premium p-4 hover-lift">
                  <div className="text-2xl font-bold text-rose-500">
                    {participants.reduce((sum, p) => sum + p.votes, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Votes totaux</div>
                </div>
                <div className="card-premium p-4 hover-lift">
                  <div className="text-2xl font-bold text-green-500">{votedFor.length}</div>
                  <div className="text-sm text-muted-foreground">Mes votes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="pb-8">
          <div className="container-premium">
            <Card className="card-premium">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    <span className="font-semibold">Filtres et tri</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor="category-filter" className="text-sm text-muted-foreground">Catégorie:</label>
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-40" id="category-filter">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label htmlFor="sort-filter" className="text-sm text-muted-foreground">Trier par:</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40" id="sort-filter">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="votes">Votes</SelectItem>
                          <SelectItem value="name">Nom</SelectItem>
                          <SelectItem value="recent">Plus récents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Podium */}
        {filterBy === "all" && sortBy === "votes" && (
          <section className="pb-12">
            <div className="container-premium">
              <Card className="card-premium overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5" aria-hidden="true" />
                <CardHeader className="relative">
                  <CardTitle className="text-center text-3xl font-bold flex items-center justify-center gap-3">
                    <Trophy className="h-8 w-8 text-amber-500" aria-hidden="true" />
                    Podium Actuel
                    <Trophy className="h-8 w-8 text-amber-500" aria-hidden="true" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {filteredAndSortedParticipants.slice(0, 3).map((participant, index) => (
                      <div key={participant.id} className="text-center space-y-4">
                        <div className="flex justify-center">
                          {getRankIcon(index)}
                        </div>
                        <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20">
                          <AvatarImage src={participant.photos[0]} alt={participant.name} />
                          <AvatarFallback className="text-2xl">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-lg">{participant.name}</h3>
                          <Badge variant={index === 0 ? "default" : "secondary"} className="mt-2">
                            <Heart className="h-3 w-3 mr-1" aria-hidden="true" />
                            {participant.votes} votes
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Participants Grid */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedParticipants.map((participant, index) => (
                <Card key={participant.id} className="card-premium overflow-hidden group">
                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                    {getRankIcon(index)}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                      {participant.category}
                    </Badge>
                  </div>

                  <CardHeader className="text-center pb-4">
                    <div className="relative">
                      <div className="aspect-square bg-muted rounded-2xl overflow-hidden mb-4">
                        <img
                          src={participant.photos[0]}
                          alt={`Style de ${participant.name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      {participant.photos.length > 1 && (
                        <div className="flex justify-center gap-1 mb-4">
                          {participant.photos.slice(0, 4).map((photo, photoIndex) => (
                            <div key={photoIndex} className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-background shadow-sm">
                              <img
                                src={photo}
                                alt={`Photo ${photoIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-xl">{participant.name}</CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {participant.bio.length > 80 ? participant.bio.substring(0, 80) + "..." : participant.bio}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {participant.socialLinks && Object.keys(participant.socialLinks).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(participant.socialLinks).slice(0, 3).map(([platform, handle]) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className={`h-4 w-4 ${votedFor.includes(participant.id) ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} aria-hidden="true" />
                        <span className="font-semibold">{participant.votes}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleVote(participant.id)}
                          disabled={votedFor.includes(participant.id)}
                          size="sm"
                          variant={votedFor.includes(participant.id) ? "default" : "outline"}
                          className={votedFor.includes(participant.id) ? "bg-rose-500 hover:bg-rose-600" : "hover-lift"}
                        >
                          {votedFor.includes(participant.id) ? "Voté !" : "Voter"}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/participant/${participant.id}`}>
                            Voir
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
