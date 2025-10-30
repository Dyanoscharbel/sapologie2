# 👤 Page de Profil Utilisateur

## Objectif

Quand un utilisateur se connecte (que son compte soit validé ou pas), il est redirigé vers sa page de profil avec toutes ses informations.

## Implémentation

### 1. API de profil utilisateur

**Fichier :** `src/app/api/user/profile/route.ts`

**Endpoint :** `GET /api/user/profile`

**Headers requis :**
```
Authorization: Bearer {token}
```

**Fonctionnement :**
1. Vérifie le token JWT
2. Récupère l'user depuis la BD
3. Récupère son participant (si existe)
4. Récupère ses médias (si existe)
5. Compte ses votes (si existe)
6. Détermine son statut

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "avatarBase64": "...",
    "createdAt": "16/10/2025",
    "isActive": true,
    "status": "user",  // 'user' | 'pending' | 'approved'
    "participant": {
      "id": 1,
      "stageName": "Le Sap",
      "bio": "Passionné de mode...",
      "isApproved": false,
      "category": "Élégance classique",
      "location": "Paris",
      "age": 25,
      "votesCount": 42,
      "media": [
        {
          "id": 1,
          "type": "image",
          "base64": "...",
          "fileName": "photo.jpg",
          "isPrimary": true,
          "position": 1
        }
      ]
    }
  }
}
```

### 2. Page de profil

**Fichier :** `src/app/profile/page.tsx`

**URL :** `/profile`

**Fonctionnalités :**
- ✅ Affiche les informations de l'user
- ✅ Affiche le statut du compte (validé, en attente, incomplet)
- ✅ Affiche les informations du participant (si existe)
- ✅ Affiche les médias (photos/vidéos)
- ✅ Affiche les statistiques (votes, photos)
- ✅ Loader pendant le chargement
- ✅ Gestion des erreurs

### 3. Redirection après connexion

**Fichier :** `src/services/auth.service.ts`

**Modification :**
```typescript
// AVANT
redirectTo: '/dashboard'

// APRÈS
redirectTo: '/profile'
```

**Comportement :**
- **Admin** : Redirigé vers `/admin`
- **User** : Redirigé vers `/profile`

## Statuts possibles

### 1. Status: 'user' (Profil incomplet)

**Condition :** User sans participant

**Affichage :**
```
┌─────────────────────────────────────────┐
│ 👤 John Doe                  [Profil   │
│ 📧 john@example.com          incomplet]│
│                                         │
│ ⚠️ Votre profil participant n'est pas  │
│    encore créé. Contactez un admin.    │
└─────────────────────────────────────────┘
```

### 2. Status: 'pending' (En attente de validation)

**Condition :** User avec participant non approuvé

**Affichage :**
```
┌─────────────────────────────────────────┐
│ 👤 Le Sap                    [En attente│
│ 📧 john@example.com          validation]│
│                                         │
│ ⏳ Votre compte est en attente de      │
│    validation. Un admin examinera...   │
│                                         │
│ 📸 Mes médias (3)                      │
│ ┌───┐ ┌───┐ ┌───┐                     │
│ │   │ │   │ │   │                     │
│ └───┘ └───┘ └───┘                     │
└─────────────────────────────────────────┘
```

### 3. Status: 'approved' (Compte validé)

**Condition :** User avec participant approuvé

**Affichage :**
```
┌─────────────────────────────────────────┐
│ 👤 Le Sap                     [✅ Compte│
│ 📧 john@example.com            validé] │
│                                         │
│ 🎯 Votes reçus: 42                     │
│ 📸 Photos publiées: 5                  │
│                                         │
│ 📸 Mes médias (5)                      │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
│ │   │ │   │ │   │ │   │ │   │        │
│ └───┘ └───┘ └───┘ └───┘ └───┘        │
└─────────────────────────────────────────┘
```

## Structure de la page

```
┌─────────────────────────────────────────────────┐
│ [Navigation]                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Header avec banner gradient]                 │
│     ┌────┐                                     │
│     │ 👤 │  Nom de scène / Nom complet        │
│     └────┘  📧 Email                           │
│             [Badge statut]                      │
│                                                 │
│  [Alerte si non validé]                        │
│                                                 │
│  ┌─────────────────────┬───────────────┐       │
│  │ Informations        │ Stats         │       │
│  │ personnelles        │               │       │
│  │                     │ 🎯 42 votes   │       │
│  │ 👤 Nom              │               │       │
│  │ 📧 Email            │ 📸 5 photos   │       │
│  │ 📅 Inscrit le       │               │       │
│  │ 🏆 Statut           │ [Actions]     │       │
│  │                     │ • Retour      │       │
│  │ [Profil participant]│ • Modifier    │       │
│  │ • Nom de scène      │               │       │
│  │ • Bio               └───────────────┘       │
│  │ • Catégorie                                 │
│  │ • Localisation                              │
│  │ • Âge                                       │
│  │                                             │
│  │ 📸 Mes médias (3)                           │
│  │ ┌────┐ ┌────┐ ┌────┐                       │
│  │ │    │ │    │ │    │                       │
│  │ │ [P]│ │    │ │    │                       │
│  │ └────┘ └────┘ └────┘                       │
│  └─────────────────────────────────────────────┘
│                                                 │
└─────────────────────────────────────────────────┘
[Footer]
```

## Détails des sections

### Header

- **Avatar :** Photo principale du participant ou initiale
- **Nom :** Nom de scène (si participant) ou nom complet
- **Email :** Email de l'utilisateur
- **Badge :** Statut visuel (✅ Validé, ⏳ En attente, 📋 Incomplet)

### Alerte conditionnelle

**Si status !== 'approved' :**
- Badge orange avec icône horloge
- Message explicatif selon le statut
- Instructions pour l'utilisateur

### Informations personnelles

**Données affichées :**
- 👤 Nom complet
- 📧 Email
- 📅 Date d'inscription
- 🏆 Statut du compte

**Si participant existe :**
- Nom de scène
- Biographie
- Catégorie (badge)
- Localisation (badge avec icône)
- Âge (badge)

### Médias

**Si participant a des médias :**
- Grid de photos/vidéos
- Badge "Principal" sur la photo primaire
- Hover effect (zoom)
- Responsive (2 colonnes mobile, 3 colonnes desktop)

### Stats (sidebar)

**Carte 1 : Votes reçus**
- Nombre de votes
- Icône TrendingUp
- Couleur violette

**Carte 2 : Photos publiées**
- Nombre de médias
- Icône ImageIcon
- Couleur verte

**Carte 3 : Actions**
- Bouton "Retour à l'accueil"
- Bouton "Modifier mon profil" (si validé)

## Workflow

### Connexion d'un user

```
User entre email/password
    ↓
POST /api/auth/login
    ↓
Vérification credentials
    ↓
Token JWT créé
    ↓
redirectTo: '/profile'
    ↓
User redirigé vers /profile
    ↓
GET /api/user/profile
    ↓
Affichage des données
```

### Chargement de la page

```
Accès à /profile
    ↓
Vérification token (useAuth)
    ↓
Si pas de token → Redirection /login
    ↓
Si token valide → GET /api/user/profile
    ↓
Affichage loader
    ↓
Réception données
    ↓
Affichage profil
```

## Gestion des cas d'erreur

### Pas de token
```typescript
if (!token) {
  router.push('/login');
  return;
}
```

### Token invalide
```typescript
// API retourne 401
// AuthContext supprime le token
// Redirection automatique vers /login
```

### Profil non trouvé
```typescript
if (!user) {
  return (
    <AlertCircle />
    <p>Profil non trouvé</p>
  );
}
```

## Améliorations futures

1. **Modification du profil**
   - Formulaire d'édition
   - Upload de nouvelles photos
   - Modification bio, réseaux sociaux

2. **Upload de médias**
   - Drag & drop
   - Crop d'image
   - Compression automatique

3. **Statistiques avancées**
   - Graphique d'évolution des votes
   - Classement par catégorie
   - Comparaison avec d'autres participants

4. **Partage social**
   - Bouton "Partager mon profil"
   - QR code du profil
   - Carte de visite virtuelle

5. **Notifications**
   - Nouveau vote reçu
   - Profil validé
   - Message admin

## Tests

### Test 1 : User sans participant

1. Se connecter avec un user sans participant
2. **Vérifier** :
   - Redirection vers `/profile`
   - Badge "Profil incomplet"
   - Message d'alerte affiché
   - Pas de section médias
   - Pas de stats de votes

### Test 2 : User avec participant non approuvé

1. Se connecter avec un user ayant un participant (is_approved = 0)
2. **Vérifier** :
   - Badge "En attente de validation"
   - Message d'alerte approprié
   - Informations participant affichées
   - Médias affichés (si existent)
   - Stats affichées

### Test 3 : User avec participant approuvé

1. Se connecter avec un user validé
2. **Vérifier** :
   - Badge "Compte validé" (vert)
   - Pas de message d'alerte
   - Toutes les infos affichées
   - Bouton "Modifier mon profil" visible

### Test 4 : Affichage des médias

1. User avec 3 photos
2. **Vérifier** :
   - 3 photos affichées
   - Photo primaire avec badge "Principal"
   - Grid responsive
   - Images chargées en base64

## Résumé

✅ **API `/api/user/profile` créée**  
✅ **Page `/profile` complète**  
✅ **Redirection après login vers `/profile`**  
✅ **Affichage adaptatif selon le statut**  
✅ **Alertes pour profils non validés**  
✅ **Médias et statistiques affichés**  
✅ **Loader et gestion d'erreurs**  
✅ **Design moderne et responsive**

Les utilisateurs sont maintenant redirigés vers leur profil après connexion ! 👤
