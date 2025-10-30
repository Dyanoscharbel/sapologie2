"use client";

import { useState } from "react";
import { Crown, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// removed Separator since social login section is not needed
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const { redirectTo } = await login(data.email, data.password);
      // Redirection en fonction du rôle (admin ou user)
      router.push(redirectTo);
    } catch (error: any) {
      setErrorMsg(error.message || "Identifiants invalides. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 overflow-hidden">
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
            <span className="text-gradient">Le Royaume de la Sapologie</span>
          </Link>
        </div>

        <div className="card-premium shadow-2xl rounded-xl border bg-card text-card-foreground">
          <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 text-center space-y-2 py-6">
            <div className="leading-none font-semibold text-3xl">Bienvenue</div>
            <div className="text-muted-foreground text-base">Connectez-vous pour gérer votre profil et participer au concours</div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email invalide"
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
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
                    placeholder="Votre mot de passe"
                    className="pl-9 h-11 rounded-xl focus-ring pr-10"
                    {...register("password", { 
                      required: "Le mot de passe est requis",
                      minLength: {
                        value: 6,
                        message: "Le mot de passe doit contenir au moins 6 caractères"
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  Se souvenir de moi
                </label>
                <Link href="/forgot-password" className="text-gray-700 hover:text-black hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl btn-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>

              {errorMsg && (
                <p className="text-sm text-red-600 text-center">{errorMsg}</p>
              )}
            </form>

            {/* Lien vers inscription */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium focus-ring rounded">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6 space-y-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded block">
            ← Retour à l'accueil
          </Link>
          <Link href="/init-admin" className="text-xs text-gray-400 hover:text-primary transition-colors block">
            Initialiser l'administrateur
          </Link>
        </div>
      </div>
    </div>
  );
}