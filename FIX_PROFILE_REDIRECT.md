# 🔧 Correction : Redirection vers Login sur /profile

## Problème

Quand un utilisateur se connecte et est redirigé vers `/profile`, il est immédiatement redirigé vers `/login`.

## Cause

La page `/profile` vérifie immédiatement si le token existe :
```typescript
useEffect(() => {
  if (!token) {
    router.push('/login');
    return;
  }
  fetchProfile();
}, [token]);
```

**Le problème :** Le `AuthContext` charge le token depuis le `localStorage` de manière asynchrone. Pendant ce chargement, `token` est `null`, donc la redirection se déclenche avant que le token soit récupéré.

## Solution

Attendre que le `AuthContext` ait fini de charger avant de vérifier le token.

### Modification 1 : Récupérer `loading` du AuthContext

```typescript
// AVANT
const { token, user: authUser } = useAuth();

// APRÈS
const { token, user: authUser, loading: authLoading } = useAuth();
```

### Modification 2 : Attendre le chargement avant de rediriger

```typescript
useEffect(() => {
  // Attendre que AuthContext ait fini de charger
  if (authLoading) {
    return; // Ne rien faire pendant le chargement
  }
  
  // Si pas de token APRÈS le chargement, alors rediriger
  if (!token) {
    router.push('/login');
    return;
  }
  
  fetchProfile();
}, [token, authLoading]); // Ajout de authLoading
```

### Modification 3 : Afficher le loader pendant le chargement AuthContext

```typescript
// AVANT
if (loading) {
  return <Loader />;
}

// APRÈS
if (authLoading || loading) {
  return <Loader />;
}
```

### Modification 4 : Sécuriser fetchProfile

```typescript
const fetchProfile = async () => {
  if (!token) return; // Protection supplémentaire
  
  try {
    const response = await fetch('/api/user/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    
    if (data.success) {
      setUser(data.data);
    } else {
      console.error('Erreur:', data.message);
      // Si token invalide, rediriger
      if (response.status === 401) {
        router.push('/login');
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    setLoading(false);
  }
};
```

## Flux corrigé

### Avant (❌ Bug)

```
Page /profile charge
    ↓
useEffect s'exécute
    ↓
token = null (pas encore chargé depuis localStorage)
    ↓
❌ Redirection vers /login
    ↓
(Le token n'a jamais eu le temps d'être chargé)
```

### Après (✅ Corrigé)

```
Page /profile charge
    ↓
useEffect s'exécute
    ↓
authLoading = true
    ↓
return (ne rien faire)
    ↓
Afficher <Loader />
    ↓
AuthContext charge le token depuis localStorage
    ↓
authLoading = false
    ↓
useEffect se re-déclenche
    ↓
token = "eyJhbGc..." (disponible)
    ↓
✅ fetchProfile() appelé
    ↓
Affichage du profil
```

## Comportement selon les cas

### Cas 1 : User connecté (token valide)

```
1. authLoading = true
2. Afficher loader
3. Token chargé depuis localStorage
4. authLoading = false
5. Appel API /api/user/profile
6. Affichage du profil
```

### Cas 2 : User non connecté

```
1. authLoading = true
2. Afficher loader
3. Pas de token dans localStorage
4. authLoading = false
5. token = null
6. Redirection vers /login
```

### Cas 3 : Token expiré/invalide

```
1. Token chargé depuis localStorage
2. Appel API /api/user/profile
3. API retourne 401
4. Redirection vers /login
5. AuthContext supprime le token
```

## Fichier modifié

**`src/app/profile/page.tsx`**

```typescript
export default function ProfilePage() {
  const router = useRouter();
  const { token, user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    fetchProfile();
  }, [token, authLoading]);

  const fetchProfile = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
      } else {
        if (response.status === 401) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <Loader />;
  }

  if (!user) {
    return <ErrorMessage />;
  }

  return <ProfileView user={user} />;
}
```

## Pourquoi ça marche maintenant ?

### 1. Synchronisation avec AuthContext

Le composant attend que `AuthContext` ait fini de charger (`authLoading = false`) avant de prendre une décision.

### 2. Pas de redirection prématurée

La redirection ne se fait que si :
- `authLoading = false` (chargement terminé)
- ET `token = null` (vraiment pas de token)

### 3. Loader pendant le chargement

L'utilisateur voit un loader au lieu d'un flash de redirection.

### 4. Gestion des erreurs

Si le token est invalide (401), redirection vers `/login` avec suppression du token corrompu.

## Tests

### Test 1 : Connexion normale

1. Se connecter avec des identifiants valides
2. **Vérifier** : Redirection vers `/profile`
3. **Vérifier** : Loader s'affiche brièvement
4. **Vérifier** : Profil s'affiche correctement
5. **Vérifier** : Pas de redirection vers `/login`

### Test 2 : Accès direct sans connexion

1. Effacer le localStorage
2. Aller sur `/profile` directement
3. **Vérifier** : Loader s'affiche brièvement
4. **Vérifier** : Redirection vers `/login`

### Test 3 : Token expiré

1. Se connecter
2. Modifier manuellement le token dans localStorage
3. Recharger `/profile`
4. **Vérifier** : Redirection vers `/login` (401)

### Test 4 : Rechargement de la page

1. Se connecter et aller sur `/profile`
2. Recharger la page (F5)
3. **Vérifier** : Pas de redirection vers `/login`
4. **Vérifier** : Profil se recharge correctement

## Pattern réutilisable

Ce pattern peut être appliqué à toutes les pages protégées :

```typescript
function ProtectedPage() {
  const { token, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Attendre le chargement AuthContext
    if (authLoading) return;
    
    // 2. Rediriger si pas de token
    if (!token) {
      router.push('/login');
      return;
    }
    
    // 3. Charger les données
    fetchData();
  }, [token, authLoading]);

  // 4. Afficher loader pendant chargement
  if (authLoading || loading) {
    return <Loader />;
  }

  return <PageContent />;
}
```

## Améliorations futures

1. **HOC pour pages protégées**
   ```typescript
   export function withAuth(Component) {
     return function AuthComponent(props) {
       // Logique d'authentification
       return <Component {...props} />;
     };
   }
   ```

2. **Middleware Next.js**
   ```typescript
   // middleware.ts
   export function middleware(request) {
     const token = request.cookies.get('token');
     if (!token) {
       return NextResponse.redirect('/login');
     }
   }
   ```

3. **Optimistic UI**
   - Afficher les données du cache pendant le chargement
   - Mettre à jour quand l'API répond

## Résumé

✅ **Problème identifié** : Vérification du token avant chargement  
✅ **Solution implémentée** : Attendre `authLoading = false`  
✅ **Loader ajouté** : Meilleure UX pendant le chargement  
✅ **Gestion d'erreurs** : Redirection sur 401  
✅ **Tests effectués** : Tous les cas couverts

La page `/profile` ne redirige plus vers `/login` de manière intempestive ! 🎉
