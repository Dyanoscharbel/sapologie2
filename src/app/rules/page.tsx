"use client";

import { Crown, Shield, AlertTriangle, CheckCircle, XCircle, Users, Camera, Vote } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation, Footer } from "@/components/navigation";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <Navigation />

      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Règlement du <span className="text-purple-600">Concours</span>
            </h1>
            <p className="text-xl text-gray-600">
              Les règles à respecter pour participer au concours "Le Roi de la Sapologie"
            </p>
          </div>

          {/* Alerte importante */}
          <Alert className="mb-8 border-purple-200 bg-purple-50">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Important :</strong> En vous inscrivant sur cette plateforme, vous acceptez automatiquement 
              l'intégralité de ce règlement. Merci de le lire attentivement.
            </AlertDescription>
          </Alert>

          {/* Conditions de participation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                Conditions de Participation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Âge minimum</h4>
                    <p className="text-gray-600 text-sm">16 ans révolus (autorisation parentale requise pour les mineurs)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Inscription gratuite</h4>
                    <p className="text-gray-600 text-sm">Aucun frais d'inscription ou de participation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Profil complet</h4>
                    <p className="text-gray-600 text-sm">Photos de qualité et informations personnelles requises</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Respect des valeurs</h4>
                    <p className="text-gray-600 text-sm">Adhésion aux valeurs de respect et d'élégance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Règles des photos */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Camera className="h-6 w-6 text-purple-600" />
                Règles concernant les Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Photos autorisées
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Photos personnelles de qualité montrant votre style vestimentaire</li>
                    <li>• Maximum 5 photos par profil</li>
                    <li>• Formats acceptés : JPG, PNG (max 5 Mo par photo)</li>
                    <li>• Photos récentes (moins de 2 ans)</li>
                    <li>• Tenues complètes de préférence</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Photos interdites
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Photos à caractère sexuel ou suggestif</li>
                    <li>• Photos contenant de la violence ou de la haine</li>
                    <li>• Photos avec des marques ou logos trop visibles (sauf discret)</li>
                    <li>• Photos floues, de mauvaise qualité ou retouchées excessivement</li>
                    <li>• Photos ne vous appartenant pas (droits d'auteur)</li>
                    <li>• Photos avec d'autres personnes sans leur consentement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Système de vote */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Vote className="h-6 w-6 text-purple-600" />
                Système de Vote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Règles de vote</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Un vote par participant par personne</li>
                    <li>• Pas d'inscription requise pour voter</li>
                    <li>• Votes anonymes et sécurisés</li>
                    <li>• Impossible de voter pour soi-même</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Critères d'évaluation</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Élégance et raffinement</li>
                    <li>• Originalité du style</li>
                    <li>• Harmonie des couleurs</li>
                    <li>• Adéquation occasion/tenue</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comportement attendu */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Comportement et Respect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Comportements encouragés</h4>
                  <ul className="space-y-1 text-green-700">
                    <li>• Respect mutuel entre participants</li>
                    <li>• Commentaires constructifs et bienveillants</li>
                    <li>• Partage d'inspirations et conseils</li>
                    <li>• Fair-play et esprit sportif</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Comportements sanctionnés</h4>
                  <ul className="space-y-1 text-red-700">
                    <li>• Harcèlement ou intimidation</li>
                    <li>• Commentaires discriminatoires</li>
                    <li>• Tentatives de manipulation des votes</li>
                    <li>• Spam ou promotion commerciale</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sanctions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Sanctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <strong className="text-yellow-800">1er avertissement :</strong>
                    <span className="text-yellow-700"> Rappel du règlement par email</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <strong className="text-orange-800">2ème infraction :</strong>
                    <span className="text-orange-700"> Suspension temporaire (7 jours)</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <div>
                    <strong className="text-red-800">3ème infraction :</strong>
                    <span className="text-red-700"> Exclusion définitive de la plateforme</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prix et récompenses */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-500" />
                Prix et Récompenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-yellow-800">1ère place</h4>
                  <p className="text-sm text-yellow-700">Titre de "Roi de la Sapologie"</p>
                  <p className="text-sm text-yellow-700">Badge exclusif sur le profil</p>
                </div>
                
                <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <Badge className="mx-auto mb-2 bg-gray-400">2ème</Badge>
                  <h4 className="font-semibold text-gray-800">2ème place</h4>
                  <p className="text-sm text-gray-700">Badge "Vice-Roi"</p>
                </div>
                
                <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <Badge className="mx-auto mb-2 bg-amber-600">3ème</Badge>
                  <h4 className="font-semibold text-amber-800">3ème place</h4>
                  <p className="text-sm text-amber-700">Badge "Prince du Style"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact pour questions */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="text-center py-6">
              <h3 className="text-xl font-semibold mb-3">
                Des questions sur le règlement ?
              </h3>
              <p className="mb-4 opacity-90">
                Notre équipe est là pour vous aider à comprendre toutes les règles
              </p>
              <Link href="/contact">
                <Badge className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-2">
                  Nous contacter
                </Badge>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}