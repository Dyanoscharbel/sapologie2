// Données des participants - fichier centralisé
export const mockParticipants = [
  {
    id: 1,
    name: "Alex Style",
    bio: "Passionné de mode depuis 10 ans, j'adore mixer les styles classiques avec des touches modernes. Chaque jour est une nouvelle occasion d'exprimer ma personnalité à travers mes tenues.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    ],
    votes: 142,
    socialLinks: {
      instagram: "@alexstyle",
      tiktok: "@alexstyle_fashion",
      youtube: "Alex Style Channel",
      website: "www.alexstyle.com"
    },
    category: "Classique",
    joinDate: "15 décembre 2024",
    location: "Paris, France",
    age: 25,
    favoriteStyle: "Smart Casual",
    inspiration: "Je m'inspire des icônes de mode intemporelles comme Cary Grant et Steve McQueen."
  },
  {
    id: 2,
    name: "Jordan Fashion",
    bio: "Créateur de contenu mode et lifestyle. La sapologie, c'est ma passion ! J'aime partager mes looks du jour et inspirer la communauté.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
    ],
    votes: 128,
    socialLinks: {
      instagram: "@jordanfashion",
      youtube: "Jordan Fashion",
      tiktok: "@jordan_style"
    },
    category: "Streetwear",
    joinDate: "20 décembre 2024",
    location: "Lyon, France",
    age: 23,
    favoriteStyle: "Urban Streetwear",
    inspiration: "Les cultures urbaines et les collaborations entre marques de luxe et streetwear."
  },
  {
    id: 3,
    name: "Sam Elegance",
    bio: "Styliste personnel et consultant en image. Chaque tenue raconte une histoire. Mon objectif est d'aider chacun à trouver son style unique.",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    ],
    votes: 95,
    socialLinks: {
      instagram: "@samelegance",
      linkedin: "sam-elegance",
      website: "samelegance-consulting.fr"
    },
    category: "Elegant",
    joinDate: "10 décembre 2024",
    location: "Monaco",
    age: 28,
    favoriteStyle: "Business Luxury",
    inspiration: "L'élégance italienne et le savoir-faire français de la haute couture."
  },
  {
    id: 4,
    name: "Rio Trendy",
    bio: "Influenceur mode, toujours à l'affût des dernières tendances ! Mes followers adorent mes looks audacieux et mes conseils style.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    ],
    votes: 87,
    socialLinks: {
      instagram: "@riotrendy",
      tiktok: "@rio_fashion",
      youtube: "Rio Trendy Style"
    },
    category: "Tendance",
    joinDate: "25 décembre 2024",
    location: "Marseille, France",
    age: 21,
    favoriteStyle: "Bold & Colorful",
    inspiration: "Les défilés de haute couture et les tendances émergentes des réseaux sociaux."
  },
  {
    id: 5,
    name: "Maya Chic",
    bio: "La mode est mon langage, le style ma signature. J'aime créer des looks sophistiqués qui reflètent la féminité moderne.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    ],
    votes: 76,
    socialLinks: {
      instagram: "@mayachic",
      youtube: "Maya Style",
      website: "mayachic-fashion.com"
    },
    category: "Chic",
    joinDate: "18 décembre 2024",
    location: "Nice, France",
    age: 26,
    favoriteStyle: "Feminine Chic",
    inspiration: "Les icônes de style comme Audrey Hepburn et les créateurs comme Chanel."
  }
];

export const socialIcons = {
  instagram: { icon: "Instagram", color: "text-pink-500", label: "Instagram" },
  youtube: { icon: "Youtube", color: "text-red-500", label: "YouTube" },
  tiktok: { icon: "Camera", color: "text-black", label: "TikTok" },
  linkedin: { icon: "Linkedin", color: "text-blue-500", label: "LinkedIn" },
  twitter: { icon: "Twitter", color: "text-blue-400", label: "Twitter" },
  website: { icon: "Globe", color: "text-gray-600", label: "Site Web" }
};

export type Participant = typeof mockParticipants[0];