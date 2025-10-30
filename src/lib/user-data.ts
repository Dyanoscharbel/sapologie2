export type UserStats = {
  email: string;
  name: string;
  avatar?: string;
  votes: number;
  position: number;
  photoCount: number;
  voteCount: number;
  bio?: string;
  photos?: string[];
};

const defaultUserStats: Omit<UserStats, 'email' | 'name'> = {
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  votes: 0,
  position: 0,
  photoCount: 0,
  voteCount: 0,
  bio: "",
  photos: [],
};

const STORAGE_KEY = "user_stats";

export function getUserStats(email: string): UserStats | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allStats: Record<string, UserStats> = stored ? JSON.parse(stored) : {};
    
    return allStats[email] || null;
  } catch {
    return null;
  }
}

export function setUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allStats: Record<string, UserStats> = stored ? JSON.parse(stored) : {};
    
    allStats[stats.email] = stats;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
  } catch {}
}

export function initializeUserStats(email: string, name: string): UserStats {
  const existing = getUserStats(email);
  if (existing) return existing;
  
  const newStats: UserStats = {
    email,
    name,
    ...defaultUserStats,
    position: Math.floor(Math.random() * 50) + 1,
    votes: Math.floor(Math.random() * 100),
    photoCount: Math.floor(Math.random() * 5),
    voteCount: Math.floor(Math.random() * 30),
  };
  
  setUserStats(newStats);
  return newStats;
}

export function updateUserName(email: string, newName: string) {
  const stats = getUserStats(email);
  if (!stats) return;
  setUserStats({ ...stats, name: newName });
}

export function migrateUserEmail(oldEmail: string, newEmail: string) {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allStats: Record<string, UserStats> = stored ? JSON.parse(stored) : {};
    const oldStats = allStats[oldEmail];
    if (!oldStats) return;
    delete allStats[oldEmail];
    allStats[newEmail] = { ...oldStats, email: newEmail };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
  } catch {}
}
