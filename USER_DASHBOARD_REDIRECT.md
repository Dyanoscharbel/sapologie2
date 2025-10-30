# 🎯 Redirection vers Dashboard User

## Correction effectuée

Les utilisateurs sont maintenant redirigés vers le **dashboard user** (`/dashboard`) au lieu de la page profil (`/profile`) après la connexion.

## Modifications apportées

### 1. Changement de redirection dans auth.service.ts

**Fichier :** `src/services/auth.service.ts`

```typescript
// ❌ AVANT
return {
  user: { ...userWithoutPassword, role: 'user', isAdmin: false },
  token,
  role: 'user',
  redirectTo: '/profile'  // ❌ Redirection vers profil
};

// ✅ APRÈS
return {
  user: { ...userWithoutPassword, role: 'user', isAdmin: false },
  token,
  role: 'user',
  redirectTo: '/dashboard'  // ✅ Redirection vers dashboard
};
```

### 2. Mise à jour du dashboard pour utiliser useAuth

**Fichier :** `src/app/dashboard/page.tsx`

Le dashboard utilisait l'ancienne méthode `getAuthUser` qui n'est pas synchronisée avec le nouveau système d'authentification JWT.

**Changements :**

```typescript
// ❌ AVANT (Ancienne méthode)
import { getAuthUser } from "@/lib/auth";

useEffect(() => {
  const authUser = getAuthUser();
  if (!authUser || !authUser.isLoggedIn) {
    router.push("/login");
    return;
  }
  
  const userStats = initializeUserStats(authUser.email, authUser.name);
  setCurrentUser(userStats);
}, [router]);

// ✅ APRÈS (Nouvelle méthode avec useAuth)
import { useAuth } from "@/contexts/AuthContext";

const { user, token, loading: authLoading } = useAuth();

useEffect(() => {
  // Attendre que AuthContext ait fini de charger
  if (authLoading) {
    return;
  }
  
  // Rediriger si pas connecté
  if (!token || !user) {
    router.push("/login");
    return;
  }
  
  // Construire le nom complet
  const userName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
  const userStats = initializeUserStats(user.email, userName);
  setCurrentUser(userStats);
}, [authLoading, token, user, router]);

// Afficher loader pendant le chargement
if (authLoading || !currentUser) {
  return <Loader />;
}
```

## Flux de connexion

### Pour un utilisateur normal

```
User se connecte avec email/password
    ↓
POST /api/auth/login
    ↓
AuthService.login() vérifie les credentials
    ↓
✅ User trouvé dans table `users`
    ↓
Génération token JWT:
  { userId, role: 'user', isAdmin: false }
    ↓
Return:
  {
    user: { ...userData, role: 'user' },
    token: "eyJhbGc...",
    redirectTo: '/dashboard'  ✅
  }
    ↓
AuthContext sauvegarde:
  - setUser(userData)
  - setToken(token)
  - localStorage.setItem('token', token)
    ↓
✅ Redirection vers /dashboard
    ↓
Dashboard charge:
  - Vérifie authLoading
  - Vérifie token
  - Charge les données user
  - Affiche le dashboard
```

### Pour un administrateur

```
Admin se connecte avec email/password
    ↓
POST /api/auth/login
    ↓
AuthService.login() vérifie dans table `admins`
    ↓
✅ Admin trouvé
    ↓
Génération token JWT:
  { userId, role: 'admin', isAdmin: true }
    ↓
Return:
  {
    user: { ...adminData, role: 'admin', isAdmin: true },
    token: "eyJhbGc...",
    redirectTo: '/admin'  ✅
  }
    ↓
✅ Redirection vers /admin
```

## Différences Dashboard vs Profile

### Dashboard (`/dashboard`)

**Objectif :** Tableau de bord interactif pour le participant

**Contenu :**
- Statistiques de votes reçus
- Position dans le classement
- Progression vers la position suivante
- Top participants
- Suggestions de vote
- Activité récente
- Actions rapides (voter, ajouter photos)

**Audience :** Participants actifs du concours

**Usage :** Page principale après connexion

### Profile (`/profile`)

**Objectif :** Consulter/modifier ses informations personnelles

**Contenu :**
- Informations personnelles (nom, email, date d'inscription)
- Statut du compte (validé, en attente, incomplet)
- Profil participant (nom de scène, bio, catégorie)
- Galerie de médias
- Badges de statut

**Audience :** Tous les utilisateurs (même non validés)

**Usage :** Accessible via menu ou bouton "Mon profil"

## Redirections par rôle

| Rôle  | Après connexion | Route protégée |
|-------|----------------|----------------|
| Admin | `/admin`       | ✅ Accès admin |
| User  | `/dashboard`   | ✅ Dashboard   |

## Accès aux pages

### Dashboard (`/dashboard`)

```typescript
// Protection de route
useEffect(() => {
  if (authLoading) return;
  
  if (!token || !user) {
    router.push("/login");
    return;
  }
  
  // Charger les données
  loadUserData();
}, [authLoading, token, user]);
```

**Accessible par :**
- ✅ Users connectés
- ❌ Users non connectés → Redirection `/login`

### Profile (`/profile`)

```typescript
// Protection de route
useEffect(() => {
  if (authLoading) return;
  
  if (!token) {
    router.push('/login');
    return;
  }
  
  fetchProfile();
}, [token, authLoading]);
```

**Accessible par :**
- ✅ Users connectés
- ❌ Users non connectés → Redirection `/login`

### Admin (`/admin/*`)

```typescript
// Protection via middleware ou layout
useEffect(() => {
  if (!token) {
    router.push('/login');
    return;
  }
  
  if (!user?.isAdmin) {
    router.push('/');
    return;
  }
}, [token, user]);
```

**Accessible par :**
- ✅ Admins uniquement
- ❌ Users normaux → Redirection `/`
- ❌ Non connectés → Redirection `/login`

## Navigation entre les pages

### Depuis le Dashboard

```tsx
<Navigation user={{ name: currentUser.name, isLoggedIn: true }} />
```

**Menu utilisateur :**
- 🏠 Dashboard (page actuelle)
- 👤 Mon profil → `/profile`
- 🏆 Concours → `/competitions`
- 🗳️ Voter → `/vote`
- 🚪 Déconnexion

### Depuis le Profile

```tsx
<Button asChild>
  <Link href="/">Retour à l'accueil</Link>
</Button>
<Button asChild>
  <Link href="/dashboard">Mon dashboard</Link>
</Button>
```

## Tests

### Test 1 : Connexion utilisateur normal

1. Aller sur `/login`
2. Se connecter avec un compte user
3. **Vérifier :**
   - ✅ Redirection vers `/dashboard`
   - ✅ Dashboard s'affiche correctement
   - ✅ Nom de l'utilisateur visible
   - ✅ Stats affichées

### Test 2 : Connexion administrateur

1. Aller sur `/login`
2. Se connecter avec un compte admin
3. **Vérifier :**
   - ✅ Redirection vers `/admin`
   - ✅ Dashboard admin s'affiche
   - ✅ Pas de redirection vers `/dashboard`

### Test 3 : Accès direct au dashboard sans connexion

1. Se déconnecter (ou effacer localStorage)
2. Aller directement sur `/dashboard`
3. **Vérifier :**
   - ✅ Redirection vers `/login`

### Test 4 : Navigation Dashboard → Profile

1. Se connecter et aller sur `/dashboard`
2. Cliquer sur "Mon profil" dans le menu
3. **Vérifier :**
   - ✅ Accès à `/profile`
   - ✅ Informations affichées
4. Cliquer sur "Retour à l'accueil" ou "Mon dashboard"
5. **Vérifier :**
   - ✅ Retour possible vers `/dashboard`

### Test 5 : Rechargement de page

1. Se connecter et aller sur `/dashboard`
2. Recharger la page (F5)
3. **Vérifier :**
   - ✅ Loader s'affiche brièvement
   - ✅ Dashboard se recharge
   - ✅ Pas de redirection vers `/login`

## Structure des pages

```
/login
  ↓ (user)
/dashboard ← ✅ Nouvelle redirection
  ├─ Header avec avatar et stats
  ├─ Quick stats (votes, photos, position)
  ├─ Top participants
  ├─ Suggestions de vote
  └─ Activité récente

/profile
  ├─ Infos personnelles
  ├─ Statut validation
  ├─ Profil participant
  └─ Galerie médias

/admin
  ↓ (admin)
/admin/dashboard
  ├─ Stats globales
  ├─ Users en attente
  ├─ Compétitions actives
  └─ Actions admin
```

## Résumé des changements

✅ **Redirection user** : `/profile` → `/dashboard`  
✅ **Dashboard mis à jour** : Utilise `useAuth` au lieu de `getAuthUser`  
✅ **Protection de route** : Vérifie `authLoading` avant redirection  
✅ **Flux cohérent** : Admin → `/admin`, User → `/dashboard`  
✅ **Navigation claire** : Dashboard ↔ Profile accessible

Les utilisateurs sont maintenant dirigés vers leur dashboard interactif ! 🎯
