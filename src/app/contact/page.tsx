"use client";

import { useState } from "react";
import { Crown, Mail, Phone, MapPin, Send, MessageSquare, Clock, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Navigation, Footer } from "@/components/navigation";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
};

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    
    // Simulation de l'envoi du message
    setTimeout(() => {
      console.log("Message envoyé:", data);
      setIsLoading(false);
      setIsSubmitted(true);
      reset();
      
      // Réinitialiser après 3 secondes
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Contactez-nous par email",
      value: "contact@leroi-sapologie.com",
      href: "mailto:contact@leroi-sapologie.com"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Appelez-nous directement",
      value: "+33 1 23 45 67 89",
      href: "tel:+33123456789"
    },
    {
      icon: MapPin,
      title: "Adresse",
      description: "Notre bureau principal",
      value: "123 Rue de la Mode, 75001 Paris",
      href: "#"
    }
  ];

  const faqItems = [
    {
      question: "Comment participer au concours ?",
      answer: "Inscrivez-vous gratuitement, complétez votre profil avec vos photos et informations, puis laissez la communauté voter pour vous !"
    },
    {
      question: "Puis-je modifier mes photos après inscription ?",
      answer: "Oui, vous pouvez modifier vos photos et informations à tout moment depuis votre profil utilisateur."
    },
    {
      question: "Comment fonctionne le système de vote ?",
      answer: "Chaque visiteur peut voter une seule fois par participant. Les votes sont anonymes et sécurisés."
    },
    {
      question: "Y a-t-il des frais de participation ?",
      answer: "Non, la participation au concours est entièrement gratuite. Aucun frais n'est demandé."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col">
      <Navigation />

      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* En-tête */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <MessageSquare className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contactez <span className="text-purple-600">Notre Équipe</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous accompagner dans votre parcours sapologique.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Send className="h-6 w-6 text-purple-600" />
                    Envoyer un Message
                  </CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Message envoyé !
                      </h3>
                      <p className="text-green-600">
                        Merci pour votre message. Nous vous répondrons rapidement.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {/* Nom */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          placeholder="Votre nom complet"
                          {...register("name", { 
                            required: "Le nom est requis",
                            minLength: { value: 2, message: "Minimum 2 caractères" }
                          })}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre-email@exemple.com"
                          {...register("email", { 
                            required: "L'email est requis",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Email invalide"
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Catégorie */}
                      <div className="space-y-2">
                        <Label>Catégorie *</Label>
                        <Select onValueChange={(value) => setValue("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="support">Support technique</SelectItem>
                            <SelectItem value="contest">Question sur le concours</SelectItem>
                            <SelectItem value="account">Problème de compte</SelectItem>
                            <SelectItem value="suggestion">Suggestion d'amélioration</SelectItem>
                            <SelectItem value="partnership">Partenariat</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sujet */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          placeholder="Résumé de votre demande"
                          {...register("subject", { 
                            required: "Le sujet est requis",
                            minLength: { value: 5, message: "Minimum 5 caractères" }
                          })}
                        />
                        {errors.subject && (
                          <p className="text-sm text-red-600">{errors.subject.message}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Décrivez votre demande en détail..."
                          rows={6}
                          {...register("message", { 
                            required: "Le message est requis",
                            minLength: { value: 10, message: "Minimum 10 caractères" }
                          })}
                        />
                        {errors.message && (
                          <p className="text-sm text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      {/* Bouton */}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Informations de contact et FAQ */}
            <div className="space-y-8">
              {/* Méthodes de contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Autres moyens de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                        <method.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{method.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                        {method.href.startsWith('#') ? (
                          <p className="text-purple-600 font-medium">{method.value}</p>
                        ) : (
                          <a 
                            href={method.href}
                            className="text-purple-600 font-medium hover:underline"
                          >
                            {method.value}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Horaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Horaires de Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lundi - Vendredi :</span>
                      <span className="font-medium">9h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Samedi :</span>
                      <span className="font-medium">10h00 - 16h00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dimanche :</span>
                      <span className="font-medium">Fermé</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Temps de réponse moyen : 2-4 heures en jours ouvrables
                  </p>
                </CardContent>
              </Card>

              {/* FAQ rapide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Questions Fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2">{item.question}</h4>
                      <p className="text-sm text-gray-600">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to action */}
          <Card className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-white" />
              <h2 className="text-2xl font-bold mb-4">
                Rejoignez notre communauté !
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Vous n'avez pas encore de compte ? Inscrivez-vous pour participer au concours
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button variant="secondary" size="lg" className="text-purple-600">
                    Créer un compte
                  </Button>
                </Link>
                <Link href="/vote">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    Découvrir les participants
                  </Button>
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