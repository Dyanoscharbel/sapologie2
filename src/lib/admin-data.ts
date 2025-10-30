// Données mock pour l'administration
// Statuts possibles: 'pending' | 'approved'
export type AdminUser = {
  id: number;
  name: string;
  email: string;
  bio: string;
  photos: string[];
  status: 'pending' | 'approved';
  revenue: number; // montant rapporté par l'utilisateur
  createdAt: string;
};

export const adminUsers: AdminUser[] = [
  {
    id: 1,
    name: 'Alex Style',
    email: 'alex@exemple.com',
    bio: "Passionné de mode depuis 10 ans, j'adore mixer les styles classiques avec des touches modernes.",
    photos: ['/placeholder-1.svg', '/placeholder-2.svg', '/placeholder-3.svg'],
    status: 'pending',
    revenue: 154.5,
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    name: 'Jordan Fashion',
    email: 'jordan@exemple.com',
    bio: "Créateur de contenu mode et lifestyle. La sapologie, c'est ma passion !",
    photos: ['/placeholder-2.svg', '/placeholder-4.svg'],
    status: 'approved',
    revenue: 320.0,
    createdAt: '2025-01-20',
  },
  {
    id: 3,
    name: 'Sam Elegance',
    email: 'sam@exemple.com',
    bio: 'Styliste personnel et consultant en image. Chaque tenue raconte une histoire.',
    photos: ['/placeholder-3.svg'],
    status: 'pending',
    revenue: 87.2,
    createdAt: '2025-01-10',
  },
  {
    id: 4,
    name: 'Maya Chic',
    email: 'maya@exemple.com',
    bio: 'La mode est mon langage, le style ma signature.',
    photos: ['/placeholder-2.svg'],
    status: 'approved',
    revenue: 245.75,
    createdAt: '2025-01-25',
  },
];

export function getTotalRevenue(list: AdminUser[] = adminUsers) {
  return list.reduce((sum, u) => sum + u.revenue, 0);
}
