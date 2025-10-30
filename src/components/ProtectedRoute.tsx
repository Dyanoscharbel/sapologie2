'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si pas authentifié, rediriger vers login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Si admin requis mais utilisateur n'est pas admin, rediriger vers dashboard
      if (requireAdmin && !isAdmin) {
        router.push('/dashboard');
        return;
      }

      // Si utilisateur normal essaie d'accéder à admin, rediriger vers dashboard
      if (!requireAdmin && isAdmin && window.location.pathname.startsWith('/admin')) {
        router.push('/admin');
        return;
      }
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router]);

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié ou pas les bonnes permissions, afficher loader
  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Redirection...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
