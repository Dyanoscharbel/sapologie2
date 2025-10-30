'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_base64?: string;
  role?: string;
  isAdmin?: boolean;
  is_super_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ redirectTo: string }>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer le token du localStorage au chargement (uniquement côté client)
    if (typeof window !== 'undefined') {
      console.log('🔍 AuthContext: Vérification du token dans localStorage...');
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        console.log('✅ Token trouvé:', storedToken.substring(0, 20) + '...');
        setToken(storedToken);
        fetchUser(storedToken);
      } else {
        console.log('❌ Pas de token trouvé');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    console.log('📡 Récupération des infos utilisateur...');
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Utilisateur récupéré:', data.data.email);
        setUser(data.data);
      } else {
        console.log('❌ Token invalide, suppression...');
        // Token invalide, le supprimer
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setToken(null);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    } finally {
      console.log('✅ Chargement terminé (loading = false)');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la connexion');
    }

    const { user: userData, token: authToken, redirectTo } = data.data;
    
    // Mettre à jour les states
    setUser(userData);
    setToken(authToken);
    setLoading(false); // Important : marquer le chargement comme terminé
    
    // Sauvegarder le token dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
      console.log('✅ Token sauvegardé:', authToken.substring(0, 20) + '...');
    }
    
    return { redirectTo: redirectTo || '/dashboard' };
  };

  const register = async (userData: any) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    const { token: authToken, userId } = data.data;
    setToken(authToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', authToken);
    }
    
    // Récupérer les données complètes de l'utilisateur
    await fetchUser(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || user?.role === 'admin' || false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
