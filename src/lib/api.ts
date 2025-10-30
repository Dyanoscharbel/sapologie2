// Types de base
type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function fetchApi<T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  const url = `${baseUrl}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // Pour éviter les problèmes de cache en développement
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Une erreur est survenue');
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur API (${endpoint}):`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}

// Fonctions spécifiques pour les participants
export const participantsApi = {
  // Récupérer tous les participants
  getAll: () => fetchApi<Array<any>>('/participants'),
  
  // Créer un nouveau participant
  create: (data: any) => 
    fetchApi('/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Récupérer un participant par son ID
  getById: (id: number) => fetchApi(`/participants/${id}`),
};

// Fonctions pour les votes
export const votesApi = {
  // Voter pour un participant
  vote: (participantId: number, voterId: number) =>
    fetchApi('/votes', {
      method: 'POST',
      body: JSON.stringify({ participantId, voterId }),
    }),
  
  // Récupérer les votes d'un participant
  getByParticipant: (participantId: number) =>
    fetchApi(`/votes?participantId=${participantId}`),
};

// Fonctions pour les compétitions
export const competitionsApi = {
  // Récupérer toutes les compétitions
  getAll: () => fetchApi<Array<any>>('/competitions'),
  
  // Créer une nouvelle compétition
  create: (competitionData: any) =>
    fetchApi('/competitions', {
      method: 'POST',
      body: JSON.stringify(competitionData),
    }),
  
  // Récupérer une compétition par son ID
  getById: (id: number) => fetchApi(`/competitions/${id}`),
};

// Fonctions pour l'authentification
export const authApi = {
  // Connexion
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  // Inscription
  register: (userData: any) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  // Récupérer l'utilisateur connecté
  getMe: () => fetchApi('/auth/me'),
};
