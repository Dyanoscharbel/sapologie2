"use client";

import { Crown, Users, Trophy, Target, Heart, Shield } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navigation, Footer } from "@/components/navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">
      <Navigation />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Crown className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              À propos du <span className="text-primary">Roi de la Sapologie</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez l'histoire et la mission de notre plateforme dédiée à la célébration du style et de l'élégance masculine et féminine.
            </p>
          </div>

          {/* Mission */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="h-6 w-6 text-primary" />
                Notre Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">
                <strong>Le Roi de la Sapologie</strong> est né de la passion pour l'art de s'habiller avec style et élégance. 
                Notre plateforme célèbre la <em>sapologie</em> - cet art de paraître, de se vêtir avec goût et d'exprimer sa personnalité à travers ses tenues.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Nous croyons que chaque personne a son propre style unique et mérite d'être mise en valeur. 
                Notre concours permet à chacun de partager sa passion pour la mode, d'inspirer les autres et de célébrer la diversité des styles.
              </p>
            </CardContent>
          </Card>

          {/* Qu'est-ce que la Sapologie */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                Qu'est-ce que la Sapologie ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Définition</h3>
                  <p className="text-gray-700">
                    La sapologie, du mot "sape" (Société des Ambianceurs et des Personnes Élégantes), 
                    est un mouvement culturel né en République du Congo qui prône l'élégance vestimentaire 
                    comme moyen d'expression personnelle et de distinction sociale.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Philosophie</h3>
                  <p className="text-gray-700">
                    Plus qu'une simple mode, la sapologie est un art de vivre qui valorise :
                  </p>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• L'élégance et le raffinement</li>
                    <li>• Le respect de soi et des autres</li>
                    <li>• L'expression de sa personnalité</li>
                    <li>• La créativité vestimentaire</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <p className="text-gray-600">Participants inscrits</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">15K+</div>
                <p className="text-gray-600">Votes exprimés</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">12</div>
                <p className="text-gray-600">Concours organisés</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Crown className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900">1</div>
                <p className="text-gray-600">Roi élu par mois</p>
              </CardContent>
            </Card>
          </div>

          {/* Valeurs */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Nos Valeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Respect</h3>
                  <p className="text-gray-600">
                    Nous valorisons le respect mutuel et la bienveillance entre tous les participants.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Inclusivité</h3>
                  <p className="text-gray-600">
                    Notre plateforme accueille tous les styles et toutes les expressions de la mode.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Excellence</h3>
                  <p className="text-gray-600">
                    Nous encourageons l'excellence vestimentaire et l'amélioration continue du style.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histoire */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Notre Histoire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1">2024</Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Lancement de la plateforme</h3>
                    <p className="text-gray-600">
                      Création de "Le Roi de la Sapologie" pour célébrer l'art vestimentaire et rassembler les passionnés de mode.
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-start gap-4">
                  <Badge variant="outline" className="mt-1">2025</Badge>
                  <div>
                    <h3 className="font-semibold text-lg">Expansion de la communauté</h3>
                    <p className="text-gray-600">
                      Croissance rapide avec plus de 500 participants et l'organisation de concours mensuels réguliers.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to action */}
          <Card className="bg-gradient-to-r from-foreground via-primary to-[#B8860B] text-white">
            <CardContent className="text-center py-8">
              <Crown className="h-12 w-12 mx-auto mb-4 text-white" />
              <h2 className="text-2xl font-bold mb-4">
                Rejoignez notre communauté !
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Exprimez votre style unique et participez à l'élection du prochain Roi de la Sapologie
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Badge className="bg-white text-foreground hover:bg-gray-100 px-6 py-2 text-base">
                    S'inscrire maintenant
                  </Badge>
                </Link>
                <Link href="/vote">
                  <Badge variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-2 text-base">
                    Découvrir les participants
                  </Badge>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}