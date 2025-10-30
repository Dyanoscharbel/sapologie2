"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Crown, Lock, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changeUserPassword, validatePasswordResetToken, consumePasswordResetToken, setAuthUser } from "@/lib/auth";

type ResetForm = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetForm>();
  const watchPassword = watch("password");

  useEffect(() => {
    if (!token) {
      setError("Token manquant");
      return;
    }
    const res = validatePasswordResetToken(token);
    if (!res.ok || !res.email) {
      setError(res.error || "Token invalide");
      return;
    }
    setEmail(res.email);
  }, [token]);

  const onSubmit = async (data: ResetForm) => {
    if (!email) return;
    setIsLoading(true);
    const res = changeUserPassword(email, null, data.password);
    if (!res.ok) {
      setError(res.error || "Erreur de mise à jour du mot de passe");
      setIsLoading(false);
      return;
    }
    consumePasswordResetToken(token);
    // Connect user directly after reset (mock)
    setAuthUser({ name: email.split("@")[0], email, isLoggedIn: true, isAdmin: false });
    setIsLoading(false);
    router.push("/dashboard");
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
            <div className="leading-none font-semibold text-3xl">Réinitialiser le mot de passe</div>
            <div className="text-muted-foreground text-base">Choisissez un nouveau mot de passe</div>
          </div>

          <div className="px-6 pb-6">
            {!email ? (
              <div className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error || "Vérification du token..."}</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input id="password" type="password" className="h-11 rounded-xl focus-ring" {...register("password", { required: "Requis", minLength: { value: 6, message: "Min. 6 caractères" } })} />
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type="password" className="h-11 rounded-xl focus-ring" {...register("confirmPassword", { required: "Requis", validate: v => v === watchPassword || "Les mots de passe ne correspondent pas" })} />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl btn-glow" disabled={isLoading}>
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Mise à jour...
                    </span>
                  ) : (
                    "Mettre à jour"
                  )}
                </Button>
              </form>
            )}

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="card-premium shadow-2xl rounded-xl border bg-card text-card-foreground p-6">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
