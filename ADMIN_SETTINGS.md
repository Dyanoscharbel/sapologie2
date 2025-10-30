# ⚙️ Page Paramètres Admin

## Vue d'ensemble

Page permettant à l'administrateur de modifier ses informations personnelles et son mot de passe.

## Accès

**URL :** `/admin/settings`

**Menu :** Troisième élément de la navigation admin

```
📊 Tableau de bord
👥 Utilisateurs  
⚙️ Paramètres ← NOUVEAU
```

## Fonctionnalités

### 1. Modifier les informations personnelles

**Champs disponibles :**
- ✅ Nom complet
- ✅ Email

**Validation :**
- Nom complet : obligatoire
- Email : obligatoire, format email valide
- Email unique (erreur si déjà utilisé)

### 2. Changer le mot de passe

**Champs :**
- 🔒 Mot de passe actuel (obligatoire pour changer)
- 🔑 Nouveau mot de passe (min. 6 caractères)
- 🔑 Confirmer le nouveau mot de passe

**Validation :**
- Mot de passe actuel correct
- Nouveau mot de passe >= 6 caractères
- Confirmation identique au nouveau mot de passe

### 3. Informations du compte

**Affichage (lecture seule) :**
- 📅 Date de dernière connexion
- 📅 Date de création du compte
- 👑 Badge "Super Administrateur" (si applicable)

## API

### GET `/api/admin/profile`

Récupère les informations de l'admin connecté.

**Headers :**
```
Authorization: Bearer {token}
```

**Response :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@sapologie.com",
    "full_name": "Administrateur Principal",
    "is_super_admin": true,
    "last_login": "2025-10-16T15:18:54.000Z",
    "created_at": "2025-10-16T14:56:02.000Z"
  }
}
```

### PATCH `/api/admin/profile`

Met à jour les informations de l'admin.

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (informations de base) :**
```json
{
  "full_name": "Nouveau Nom",
  "email": "nouveau@email.com"
}
```

**Body (avec changement de mot de passe) :**
```json
{
  "full_name": "Nouveau Nom",
  "email": "nouveau@email.com",
  "current_password": "ancienMotDePasse",
  "new_password": "nouveauMotDePasse"
}
```

**Response succès :**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès"
}
```

**Response erreur :**
```json
{
  "success": false,
  "message": "Mot de passe actuel incorrect"
}
```

## Interface utilisateur

### Structure de la page

```
┌─────────────────────────────────────────┐
│ Paramètres                              │
│ Gérez vos informations personnelles... │
├─────────────────────────────────────────┤
│ [Message de succès/erreur si présent]  │
├─────────────────────────────────────────┤
│ 👤 Informations personnelles           │
│ ┌─────────────────────────────────────┐│
│ │ Nom complet: [              ]      ││
│ │ Email:       [              ]      ││
│ │ 👑 Vous êtes Super Administrateur  ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ 🔒 Sécurité                            │
│ ┌─────────────────────────────────────┐│
│ │ Mot de passe actuel:    [        ] ││
│ │ Nouveau mot de passe:   [        ] ││
│ │ Confirmer:              [        ] ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ ℹ️ Informations du compte              │
│ ┌─────────────────────────────────────┐│
│ │ Dernière connexion: 16/10/2025     ││
│ │ Compte créé le:     16/10/2025     ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│ [💾 Enregistrer les modifications]     │
└─────────────────────────────────────────┘
```

### Messages de feedback

**Succès (vert) :**
```
✅ Profil mis à jour avec succès
```

**Erreurs (rouge) :**
```
❌ Les mots de passe ne correspondent pas
❌ Le mot de passe doit contenir au moins 6 caractères
❌ Mot de passe actuel incorrect
❌ Cet email est déjà utilisé
```

## Sécurité

### Vérifications côté serveur

1. ✅ **Token JWT valide** obligatoire
2. ✅ **Rôle admin** vérifié
3. ✅ **Mot de passe actuel** vérifié avant changement
4. ✅ **Email unique** dans la table admins
5. ✅ **Mot de passe hashé** avec bcrypt (10 rounds)

### Validation côté client

```typescript
// Mots de passe correspondent
if (new_password !== confirm_password) {
  error("Les mots de passe ne correspondent pas");
}

// Longueur minimale
if (new_password.length < 6) {
  error("Le mot de passe doit contenir au moins 6 caractères");
}

// Mot de passe actuel requis
if (new_password && !current_password) {
  error("Le mot de passe actuel est requis");
}
```

## Workflow

### Modifier uniquement les informations

```
Admin modifie nom/email
    ↓
Clique "Enregistrer"
    ↓
PATCH /api/admin/profile
    ↓
UPDATE admins SET full_name = ?, email = ?
    ↓
Message de succès
    ↓
Profil rechargé
```

### Changer le mot de passe

```
Admin remplit:
  - Mot de passe actuel
  - Nouveau mot de passe
  - Confirmation
    ↓
Validation client (correspond, >= 6 chars)
    ↓
Clique "Enregistrer"
    ↓
PATCH /api/admin/profile
    ↓
Vérification mot de passe actuel (bcrypt.compare)
    ↓
Hash du nouveau mot de passe (bcrypt.hash)
    ↓
UPDATE admins SET password_hash = ?
    ↓
Message de succès
    ↓
Champs de mot de passe réinitialisés
    ↓
Profil rechargé
```

## Gestion des erreurs

### Erreur : Email déjà utilisé

```typescript
// Erreur MySQL: ER_DUP_ENTRY
if (error.code === 'ER_DUP_ENTRY') {
  return { message: 'Cet email est déjà utilisé' };
}
```

### Erreur : Mot de passe incorrect

```typescript
const isPasswordValid = await bcrypt.compare(
  current_password, 
  admin.password_hash
);

if (!isPasswordValid) {
  return { message: 'Mot de passe actuel incorrect' };
}
```

## Code source

### Fichiers créés

```
src/
├── app/
│   ├── api/
│   │   └── admin/
│   │       └── profile/
│   │           └── route.ts (NOUVEAU)
│   └── admin/
│       ├── layout.tsx (MODIFIÉ - ajout menu)
│       └── settings/
│           └── page.tsx (NOUVEAU)
```

### Dépendances

- ✅ `bcryptjs` (hashage mot de passe)
- ✅ `@/contexts/AuthContext` (token)
- ✅ `@/lib/db` (requêtes BD)
- ✅ `@/services/auth.service` (vérification admin)

## Tests

### Test 1 : Modifier le nom

1. Aller sur `/admin/settings`
2. Modifier le champ "Nom complet"
3. Cliquer "Enregistrer"
4. **Vérifier** :
   - Message de succès
   - Nom mis à jour dans la BD
   - Nouveau nom affiché après rechargement

### Test 2 : Changer l'email

1. Modifier le champ "Email"
2. Cliquer "Enregistrer"
3. **Vérifier** :
   - Email mis à jour
   - Peut se reconnecter avec le nouvel email

### Test 3 : Changer le mot de passe

1. Remplir :
   - Mot de passe actuel : `Admin123!`
   - Nouveau : `NewPass123!`
   - Confirmer : `NewPass123!`
2. Cliquer "Enregistrer"
3. **Vérifier** :
   - Message de succès
   - Champs de mot de passe vidés
   - Peut se reconnecter avec le nouveau mot de passe
4. Se déconnecter et reconnecter avec nouveau MDP

### Test 4 : Validation des erreurs

**Test A : Mots de passe ne correspondent pas**
```
Nouveau: "password123"
Confirmer: "password456"
→ Erreur affichée côté client
```

**Test B : Mot de passe trop court**
```
Nouveau: "pass"
→ Erreur: minimum 6 caractères
```

**Test C : Mot de passe actuel incorrect**
```
Actuel: "wrongpassword"
→ Erreur API: "Mot de passe actuel incorrect"
```

**Test D : Email déjà utilisé**
```
Email: (email d'un autre admin)
→ Erreur API: "Cet email est déjà utilisé"
```

### Test 5 : Badge super admin

1. Se connecter en tant que super admin
2. Aller sur `/admin/settings`
3. **Vérifier** : Badge "👑 Vous êtes Super Administrateur"

### Test 6 : Informations du compte

1. Vérifier que les dates s'affichent correctement
2. Format français attendu : "16/10/2025 17:28:54"

## Améliorations futures

1. **Avatar** : Upload d'image de profil
2. **Préférences** : Langue, thème, notifications
3. **Authentification 2FA** : Code OTP
4. **Sessions actives** : Liste et déconnexion
5. **Historique d'activité** : Logs des actions admin
6. **Changement d'email** : Avec confirmation par email
7. **Export de données** : Télécharger ses infos (RGPD)

## Sécurité avancée (optionnel)

### Forcer la déconnexion après changement de MDP

```typescript
// Invalider tous les tokens actuels
// Regénérer un nouveau token
// Forcer la reconnexion
```

### Log des modifications

```typescript
await query(`
  INSERT INTO admin_activities 
  (admin_id, action_type, description) 
  VALUES (?, 'profile_update', ?)
`, [admin.id, 'Modification du profil']);
```

### Notification par email

```typescript
// Envoyer un email à l'admin
sendEmail({
  to: admin.email,
  subject: 'Modification de votre profil',
  body: 'Votre profil a été modifié...'
});
```

## Résumé

✅ **Page de paramètres créée** (`/admin/settings`)  
✅ **API de profil créée** (GET et PATCH)  
✅ **Modification nom et email**  
✅ **Changement de mot de passe sécurisé**  
✅ **Validation côté client et serveur**  
✅ **Messages de feedback (succès/erreur)**  
✅ **Badge super admin**  
✅ **Informations du compte affichées**  
✅ **Menu de navigation mis à jour**

L'admin peut maintenant gérer son profil en toute sécurité ! ⚙️
