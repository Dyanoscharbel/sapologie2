"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPasswordResetToken } from "@/lib/auth";

type ForgotForm = {
  email: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setMessage(null);
    const res = createPasswordResetToken(data.email);
    if (!res.ok || !res.token) {
      setIsLoading(false);
      setMessage("Email introuvable ou erreur.");
      return;
    }
    // Dans ce mock, on affiche le token et le lien direct
    setToken(res.token);
    setMessage("Un lien de réinitialisation a été généré (mock).");
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-purple-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold group">
            <Crown className="h-8 w-8 text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
            <span className="text-gradient">Le Roi de la Sapologie</span>
          </Link>
        </div>

        <div className="card-premium shadow-2xl rounded-xl border bg-card text-card-foreground">
          <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 text-center space-y-2 py-6">
            <div className="leading-none font-semibold text-3xl">Mot de passe oublié</div>
            <div className="text-muted-foreground text-base">Entrez votre email pour recevoir un lien de réinitialisation</div>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                        message: "Email invalide",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl btn-glow" disabled={isLoading}>
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Génération...
                  </span>
                ) : (
                  "Envoyer le lien"
                )}
              </Button>

              {message && (
                <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{message}</span>
                </div>
              )}

              {token && (
                <div className="text-sm bg-muted/50 rounded-lg p-3">
                  <p className="mb-2">Lien mock de réinitialisation:</p>
                  <Link className="text-primary underline" href={`/reset-password?token=${token}`}>
                    {`/reset-password?token=${token}`}
                  </Link>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-ring rounded">
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
