"use client";

import { useState } from "react";
import { Crown, Eye, EyeOff, User, Mail, Lock, Phone, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { COUNTRIES, getPrefixByCountry, getCountryByCode } from "@/lib/countries";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type RegisterForm = {
  first_name: string;
  last_name: string;
  pseudo?: string;
  email: string;
  country: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { register: registerUser } = useAuth();
  
  // Récupérer le nom du pays pour le code par défaut "MA" (Maroc)
  const defaultCountryName = getCountryByCode("MA")?.name || "Maroc";
  
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: {
      country: defaultCountryName,
      phone: ""
    }
  });
  const watchPassword = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        country: data.country,
        phone: data.phone,
        pseudo: data.pseudo,
      });
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMsg(error.message || "Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background decorative layers */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-purple-500/5 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold group">
            <Crown className="h-8 w-8 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="text-gradient">Le Roi de la Sapologie</span>
          </Link>
        </div>

        <Card className="card-premium shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold">Rejoignez-nous</CardTitle>
            <CardDescription className="text-base">
              Créez votre compte et participez au concours
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {errorMsg}
                </div>
              )}

              {/* Prénom et Nom */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Prénom</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="Prénom"
                      className="pl-9 h-11 rounded-xl focus-ring"
                      {...register("first_name", { 
                        required: "Le prénom est requis",
                        minLength: { value: 2, message: "Le prénom doit contenir au moins 2 caractères" }
                      })}
                    />
                  </div>
                  {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Nom</Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Nom"
                      className="pl-9 h-11 rounded-xl focus-ring"
                      {...register("last_name", { 
                        required: "Le nom est requis",
                        minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" }
                      })}
                    />
                  </div>
                  {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre-email@exemple.com"
                    className="pl-9 h-11 rounded-xl focus-ring"
                    {...register("email", { 
                      required: "L'email est requis",
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Email Invalide" }
                    })}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              {/* Pseudo */}
              <div className="space-y-2">
                <Label htmlFor="pseudo">Pseudo (optionnel)</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="pseudo"
                    type="text"
                    placeholder="Votre pseudo..."
                    className="pl-9 h-11 rounded-xl focus-ring"
                    {...register("pseudo", { 
                      minLength: { value: 2, message: "Le pseudo doit contenir au moins 2 caractères" }
                    })}
                  />
                </div>
                {errors.pseudo && <p className="text-sm text-red-600">{errors.pseudo.message}</p>}
              </div>

              {/* Numéro WhatsApp avec sélecteur de pays et drapeaux */}
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro WhatsApp</Label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ 
                    required: "Le numéro de téléphone est requis",
                    minLength: { value: 10, message: "Numéro invalide" }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={'ma'}
                      value={value}
                      onChange={onChange}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: false
                      }}
                      containerClass="phone-input-container"
                      inputClass="phone-input-field"
                      buttonClass="phone-input-button"
                      dropdownClass="phone-input-dropdown"
                      searchClass="phone-input-search"
                      enableSearch={true}
                      searchPlaceholder="Rechercher un pays..."
                      preferredCountries={['ma', 'fr', 'be', 'sn', 'ci', 'cm']}
                      placeholder="6 12 34 56 78"
                    />
                  )}
                />
                {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choisissez un mot de passe"
                    className="pl-9 h-11 rounded-xl border-gray-200 bg-white/60 placeholder:text-gray-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-400 pr-10"
                    {...register("password", { 
                      required: "Le mot de passe est requis",
                      minLength: { value: 6, message: "Le mot de passe doit contenir au moins 6 caractères" }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
              </div>

              {/* Confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    className="pl-9 h-11 rounded-xl border-gray-200 bg-white/60 placeholder:text-gray-500 text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-400 pr-10"
                    {...register("confirmPassword", { 
                      required: "La confirmation du mot de passe est requise",
                      validate: value => value === watchPassword || "Les mots de passe ne correspondent pas"
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>

              {/* Bouton d'inscription */}
              <Button type="submit" className="w-full h-11 rounded-xl btn-glow" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium focus-ring rounded">Se connecter</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}