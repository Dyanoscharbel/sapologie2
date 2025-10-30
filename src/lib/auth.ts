// Authentification mock (à remplacer plus tard par une vraie auth)
export const DEFAULT_ADMIN = {
  email: "admin@exemple.com",
  password: "123456789",
};

export function isAdminCredentials(email: string, password: string) {
  return email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password;
}

// --- Session utilisateur mock (localStorage) ---
export type AuthUser = {
  name: string;
  email: string;
  isAdmin?: boolean;
  isLoggedIn: boolean;
};

const AUTH_KEY = "auth_user";

export function setAuthUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {}
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export function logout() {
  clearAuthUser();
}

// ------------------------
// Local mock user database
// ------------------------
type StoredUser = {
  email: string;
  name: string;
  password?: string; // plaintext for mock only
};

type PasswordReset = {
  email: string;
  token: string;
  expiresAt: number; // epoch ms
};

const USERS_DB_KEY = "users_db";
const RESETS_DB_KEY = "password_resets";

function readUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredUser>) : {};
  } catch {
    return {};
  }
}

function writeUsers(db: Record<string, StoredUser>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  } catch {}
}

function readResets(): Record<string, PasswordReset> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(RESETS_DB_KEY);
    return raw ? (JSON.parse(raw) as Record<string, PasswordReset>) : {};
  } catch {
    return {};
  }
}

function writeResets(db: Record<string, PasswordReset>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESETS_DB_KEY, JSON.stringify(db));
  } catch {}
}

export function getStoredUser(email: string): StoredUser | null {
  const db = readUsers();
  return db[email.toLowerCase()] ?? null;
}

export function upsertStoredUser(user: StoredUser) {
  const db = readUsers();
  db[user.email.toLowerCase()] = user;
  writeUsers(db);
}

export function validateUserCredentials(email: string, password: string): boolean {
  // Admin bypasses local DB
  if (isAdminCredentials(email, password)) return true;
  const user = getStoredUser(email);
  if (!user) return false;
  return (user.password ?? "") === password;
}

export function ensureUser(email: string, name: string, password?: string): StoredUser {
  const existing = getStoredUser(email);
  if (existing) return existing;
  const created: StoredUser = { email: email.toLowerCase(), name, password };
  upsertStoredUser(created);
  return created;
}

export function changeUserPassword(email: string, currentPassword: string | null, newPassword: string): { ok: boolean; error?: string } {
  const db = readUsers();
  const key = email.toLowerCase();
  const user = db[key];
  if (!user) return { ok: false, error: "Utilisateur introuvable" };
  if (currentPassword !== null && (user.password ?? "") !== currentPassword) {
    return { ok: false, error: "Mot de passe actuel incorrect" };
  }
  db[key] = { ...user, password: newPassword };
  writeUsers(db);
  return { ok: true };
}

export function changeUserEmail(oldEmail: string, newEmail: string): { ok: boolean; error?: string } {
  const db = readUsers();
  const oldKey = oldEmail.toLowerCase();
  const newKey = newEmail.toLowerCase();
  if (!db[oldKey]) return { ok: false, error: "Ancien email introuvable" };
  if (db[newKey]) return { ok: false, error: "Le nouvel email est déjà utilisé" };
  const user = db[oldKey];
  delete db[oldKey];
  db[newKey] = { ...user, email: newKey };
  writeUsers(db);
  return { ok: true };
}

function randomToken(len = 32) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let t = "";
  for (let i = 0; i < len; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

export function createPasswordResetToken(email: string, ttlMinutes = 30): { ok: boolean; token?: string; error?: string } {
  const user = getStoredUser(email);
  if (!user && !isAdminCredentials(email, "")) {
    return { ok: false, error: "Email introuvable" };
  }
  const db = readResets();
  const token = randomToken(40);
  const expiresAt = Date.now() + ttlMinutes * 60_000;
  db[token] = { email: email.toLowerCase(), token, expiresAt };
  writeResets(db);
  return { ok: true, token };
}

export function validatePasswordResetToken(token: string): { ok: boolean; email?: string; error?: string } {
  const db = readResets();
  const rec = db[token];
  if (!rec) return { ok: false, error: "Token invalide" };
  if (Date.now() > rec.expiresAt) return { ok: false, error: "Token expiré" };
  return { ok: true, email: rec.email };
}

export function consumePasswordResetToken(token: string) {
  const db = readResets();
  if (db[token]) {
    delete db[token];
    writeResets(db);
  }
}
