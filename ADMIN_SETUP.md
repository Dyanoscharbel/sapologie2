# 📊 Configuration Admin - Documentation

## ✅ Système d'authentification avec rôles

### Connexion automatique par rôle

Lorsqu'un utilisateur se connecte, le système vérifie automatiquement :

1. **Est-ce un administrateur ?**
   - Vérification dans la table `admins`
   - Si oui → Redirection vers `/admin`
   - Token JWT avec `role: 'admin'` et `isAdmin: true`

2. **Est-ce un utilisateur normal ?**
   - Vérification dans la table `users`
   - Si oui → Redirection vers `/dashboard`
   - Token JWT avec `role: 'user'` et `isAdmin: false`

### API créées pour l'admin

#### 1. `/api/admin/stats` - Statistiques du dashboard
**Méthode:** GET  
**Headers:** `Authorization: Bearer {token}`

**Retourne:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 10,
    "totalParticipants": 5,
    "approvedParticipants": 3,
    "pendingParticipants": 2,
    "totalVotes": 150,
    "totalCompetitions": 2,
    "activeCompetitions": 1,
    "approvalRate": "60.0"
  }
}
```

**Statistiques disponibles:**
- 👥 Total des utilisateurs inscrits
- 🎭 Total des participants
- ✅ Participants approuvés
- ⏳ Participants en attente
- 🗳️ Total des votes
- 🏆 Nombre de compétitions
- ⚡ Compétitions actives
- 📊 Taux d'approbation

#### 2. `/api/admin/users` - Liste des utilisateurs
**Méthode:** GET  
**Headers:** `Authorization: Bearer {token}`  
**Paramètres:** 
- `limit` (optionnel, défaut: 10)
- `offset` (optionnel, défaut: 0)

**Retourne:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "createdAt": "16/10/2025",
        "status": "approved",
        "participant": {
          "id": 1,
          "stageName": "DJ John",
          "isApproved": true,
          "bio": "..."
        }
      }
    ],
    "total": 10,
    "limit": 10,
    "offset": 0
  }
}
```

#### 3. `/api/admin/init` - Initialisation admin
**Méthode:** GET  
**Accès:** Public (pour la première initialisation)

**Fonctions:**
- Crée la table `admins` si elle n'existe pas
- Crée le compte administrateur par défaut
- Empêche les doublons

### Page admin

La page `/admin` charge maintenant les **vraies données** de la base de données :

**Avant:**
```typescript
// Données mockées
import { adminUsers } from "@/lib/admin-data";
```

**Maintenant:**
```typescript
// Données réelles via API
const fetchData = async () => {
  const statsRes = await fetch('/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  setStats(statsData.data);
};
```

### Sécurité

**Vérifications implémentées:**

1. **Token JWT obligatoire**
   ```typescript
   const token = request.headers.get('authorization')?.split(' ')[1];
   if (!token) return 401;
   ```

2. **Vérification du rôle admin**
   ```typescript
   const user = await AuthService.getCurrentUser(token);
   if (!user || !user.isAdmin) return 403;
   ```

3. **Protection des routes**
   ```typescript
   // Utiliser le composant ProtectedRoute
   <ProtectedRoute requireAdmin={true}>
     {/* Contenu admin */}
   </ProtectedRoute>
   ```

### Utilisation

#### Initialiser l'admin

**Option 1 - Interface web:**
```
http://localhost:3000/init-admin
```

**Option 2 - Lien sur la page login:**
En bas de la page `/login`, cliquez sur "Initialiser l'administrateur"

#### Se connecter en tant qu'admin

1. Allez sur `/login`
2. Email: `admin@sapologie.com`
3. Mot de passe: `Admin123!`
4. → Automatiquement redirigé vers `/admin`

#### Se connecter en tant qu'utilisateur

1. Créez un compte sur `/register`
2. Connectez-vous sur `/login`
3. → Automatiquement redirigé vers `/dashboard`

### Données affichées dans le dashboard admin

**Cartes statistiques:**
- 📊 Utilisateurs totaux (avec détails validés/en attente)
- ⏳ Participants en attente de validation
- ✅ Participants validés (avec taux d'approbation)
- 🏆 Compétitions actives

**Graphiques:**
- 📈 Taux de validation des participants
- 📊 Participants en attente

**Liste d'activités:**
- 👥 5 derniers utilisateurs inscrits
- 📅 Date d'inscription
- ✅ Statut (Validé / En attente)

### Base de données

**Tables utilisées:**
- `admins` - Comptes administrateurs
- `users` - Utilisateurs normaux
- `participants` - Profils des participants
- `votes` - Système de votes
- `competitions` - Gestion des compétitions
- `media` - Photos/vidéos (base64)

### Prochaines étapes recommandées

1. **Gestion des participants**
   - Page pour approuver/rejeter les participants
   - Édition des profils participants
   - Gestion des médias

2. **Gestion des compétitions**
   - Créer/éditer/supprimer des compétitions
   - Assigner des participants
   - Gérer les prix

3. **Gestion des votes**
   - Voir les votes en temps réel
   - Détecter les fraudes
   - Exporter les résultats

4. **Analytiques avancées**
   - Graphiques de participation
   - Statistiques de votes
   - Rapports exportables

### Fichiers modifiés/créés

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── init/route.ts (NOUVEAU)
│   │   │   ├── stats/route.ts (NOUVEAU)
│   │   │   └── users/route.ts (NOUVEAU)
│   │   └── auth/
│   │       ├── login/route.ts (MODIFIÉ)
│   │       ├── register/route.ts (EXISTANT)
│   │       └── me/route.ts (MODIFIÉ)
│   ├── admin/
│   │   └── page.tsx (MODIFIÉ - Charge vraies données)
│   ├── init-admin/
│   │   └── page.tsx (NOUVEAU)
│   └── login/
│       └── page.tsx (MODIFIÉ - Gestion rôles)
├── services/
│   └── auth.service.ts (MODIFIÉ - Gestion rôles)
├── contexts/
│   └── AuthContext.tsx (MODIFIÉ - Support isAdmin)
└── components/
    └── ProtectedRoute.tsx (NOUVEAU)
```

### Tests

**Test 1 - Initialisation admin:**
```bash
curl http://localhost:3000/api/admin/init
```

**Test 2 - Connexion admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sapologie.com","password":"Admin123!"}'
```

**Test 3 - Récupérer stats (avec token):**
```bash
curl http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎉 Résultat

✅ Admin peut se connecter et voir les vraies données de la BD  
✅ Utilisateurs sont automatiquement redirigés vers la bonne page  
✅ Statistiques en temps réel depuis la base de données  
✅ Système de sécurité avec vérification des rôles  
✅ Interface d'initialisation simple et intuitive
