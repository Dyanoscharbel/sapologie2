# 🏆 Système de Compétitions - Guide Complet

## Vue d'ensemble

Le système de compétitions permet aux utilisateurs de voir les compétitions actives et de s'y inscrire pour participer. Les administrateurs peuvent créer et gérer les compétitions, tandis que les utilisateurs peuvent rejoindre celles qui sont ouvertes.

---

## 📁 Structure des fichiers

### APIs

```
src/app/api/competitions/
├── route.ts                    # GET: Liste des compétitions, POST: Créer une compétition
├── [id]/
│   ├── route.ts               # GET: Détail d'une compétition
│   └── join/
│       └── route.ts           # POST: S'inscrire, GET: Vérifier le statut
```

### Pages

```
src/app/competitions/
├── page.tsx                    # Liste des compétitions
└── [id]/
    └── page.tsx               # Détail d'une compétition + inscription
```

---

## 🔄 Flux d'utilisation

### Pour les utilisateurs

1. **Voir les compétitions**
   - Accéder à `/competitions`
   - Voir toutes les compétitions actives avec leurs détails

2. **S'inscrire à une compétition**
   - Cliquer sur une compétition
   - Voir les détails, prix et participants
   - Cliquer sur "Participer"
   
3. **Conditions pour participer**
   - ✅ Être connecté
   - ✅ Avoir créé un profil participant
   - ✅ Profil participant approuvé par un admin
   - ✅ Compétition active et dans les dates

4. **Statuts d'inscription**
   - `pending` : En attente d'approbation
   - `approved` : Inscrit et approuvé
   - `rejected` : Inscription refusée

---

## 📊 Base de données

### Tables utilisées

#### `competitions`
```sql
- id (PK)
- name
- description
- start_date
- end_date
- is_active
- max_votes_per_user
- created_by (FK -> admins)
- created_at
```

#### `competition_entries`
```sql
- id (PK)
- competition_id (FK -> competitions)
- participant_id (FK -> participants)
- status ('pending', 'approved', 'rejected')
- votes_count
- created_at
- updated_at
UNIQUE(competition_id, participant_id)
```

#### `prizes`
```sql
- id (PK)
- competition_id (FK -> competitions)
- name
- description
- position
- value
- sponsor
```

---

## 🔌 APIs disponibles

### 1. Liste des compétitions actives
```http
GET /api/competitions
```

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Concours Printemps 2025",
      "description": "...",
      "start_date": "2025-03-01",
      "end_date": "2025-05-31",
      "is_active": true,
      "participantsCount": 15,
      "participants": [...],
      "prizes": [...]
    }
  ]
}
```

### 2. Détail d'une compétition
```http
GET /api/competitions/:id
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Concours Printemps 2025",
    "participants": [
      {
        "id": 1,
        "stage_name": "Sapeur Élégant",
        "votes_count": 45,
        "status": "approved"
      }
    ],
    "prizes": [...]
  }
}
```

### 3. S'inscrire à une compétition
```http
POST /api/competitions/:id/join
Authorization: Bearer {token}
```

**Réponse succès:**
```json
{
  "success": true,
  "message": "Inscription réussie ! Votre participation sera examinée par les administrateurs.",
  "data": {
    "status": "pending"
  }
}
```

**Erreurs possibles:**
- 401: Non authentifié
- 404: Compétition introuvable
- 400: Compétition non active
- 400: Pas de profil participant
- 400: Profil non approuvé
- 400: Déjà inscrit

### 4. Vérifier le statut d'inscription
```http
GET /api/competitions/:id/join
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "isRegistered": true,
    "hasParticipant": true,
    "isApproved": true,
    "entryStatus": "approved",
    "votesCount": 12
  }
}
```

---

## 🎨 Pages utilisateur

### Page liste (`/competitions`)

**Fonctionnalités:**
- ✅ Affiche toutes les compétitions actives
- ✅ Badges de statut (En cours, À venir, Terminée)
- ✅ Nombre de participants
- ✅ Nombre de prix
- ✅ Dates de début/fin
- ✅ Jours restants
- ✅ Aperçu des prix (3 premiers)
- ✅ Bouton vers les détails

### Page détail (`/competitions/:id`)

**Fonctionnalités:**
- ✅ Informations complètes de la compétition
- ✅ Statistiques (participants, prix, jours restants)
- ✅ Carte d'inscription avec gestion des états:
  - Non connecté → Boutons Se connecter/S'inscrire
  - Pas de profil → Bouton Créer mon profil
  - Profil non approuvé → Message d'attente
  - Peut s'inscrire → Bouton Participer
  - Déjà inscrit → Badge de confirmation
- ✅ Liste complète des prix
- ✅ Liste des participants inscrits avec classement
- ✅ Avatars et photos
- ✅ Nombre de votes par participant

---

## 🛡️ Sécurité et validations

### Côté API
1. **Authentification JWT**
   - Toutes les actions nécessitent un token valide
   
2. **Validations métier**
   - Vérification des dates (début/fin)
   - Vérification du statut de la compétition
   - Unicité de l'inscription (UNIQUE KEY en DB)
   
3. **Autorisations**
   - Seuls les utilisateurs avec profil approuvé peuvent s'inscrire
   - Impossible de s'inscrire plusieurs fois

### Côté Frontend
1. **Gestion des états**
   - Désactivation des boutons pendant les requêtes
   - Messages d'erreur clairs
   - Feedback visuel des actions
   
2. **Redirection intelligente**
   - Redirection vers login si non connecté
   - Redirection vers création de profil si nécessaire

---

## 🎯 Intégrations

### Navigation principale
- Ajout du lien "Compétitions" dans le menu principal
- Visible pour tous les utilisateurs (connectés ou non)

### Dashboard utilisateur
- Carte "Compétitions" avec:
  - Lien vers `/competitions`
  - Lien vers le règlement
  - Statistiques de participation

### Page d'accueil
- Section dédiée possible (à ajouter)

---

## 👨‍💼 Côté Administration

Les administrateurs peuvent:
1. ✅ Créer des compétitions via `/admin/competitions`
2. ✅ Définir les prix
3. ✅ Approuver/rejeter les inscriptions
4. ✅ Voir les statistiques
5. ✅ Désigner les gagnants

---

## 🚀 Utilisation pour l'utilisateur final

### Étape 1: Découvrir les compétitions
```
Page d'accueil → Menu "Compétitions" → Liste des compétitions
```

### Étape 2: Voir les détails
```
Cliquer sur une compétition → Page de détail
- Voir les prix
- Voir les participants
- Voir les conditions
```

### Étape 3: S'inscrire
```
Si connecté + profil approuvé → Bouton "Participer"
↓
Inscription en attente d'approbation admin
↓
Admin approuve
↓
Participation active + comptage des votes
```

### Étape 4: Suivre sa participation
```
Dashboard → Voir son classement
Page compétition → Voir son nombre de votes
```

---

## 📝 Messages utilisateur

### Messages de succès
- ✅ "Inscription réussie ! Votre participation sera examinée par les administrateurs."
- ✅ "Vous participez à cette compétition avec X vote(s)"

### Messages d'erreur
- ❌ "Vous devez créer un profil participant pour vous inscrire"
- ❌ "Votre profil doit être approuvé par un administrateur"
- ❌ "La compétition n'a pas encore commencé"
- ❌ "La compétition est terminée"
- ❌ "Les inscriptions sont fermées pour cette compétition"

---

## 🎨 Design

### Couleurs par statut
- 🟢 **En cours**: `bg-green-500`
- 🔵 **À venir**: `bg-blue-500`
- ⚫ **Terminée**: `bg-gray-500`

### Badges de position
- 🥇 Position 1: Badge doré (`bg-amber-500`)
- 🥈 Position 2: Badge argenté (`bg-slate-400`)
- 🥉 Position 3: Badge bronze (`bg-orange-600`)

---

## 🔧 Maintenance et évolution

### Points d'amélioration possibles
1. **Notifications**
   - Email lors de l'approbation
   - Notification fin de compétition
   
2. **Filtres et recherche**
   - Filtrer par statut (actives, terminées, à venir)
   - Recherche par nom
   
3. **Statistiques avancées**
   - Graphiques d'évolution des votes
   - Historique des participations
   
4. **Partage social**
   - Partager sa participation
   - Inviter des amis à voter

---

## ✅ Checklist de fonctionnement

Pour qu'un utilisateur puisse participer:
- [ ] Base de données MySQL configurée
- [ ] Tables `competitions`, `competition_entries`, `prizes` créées
- [ ] Utilisateur inscrit et connecté
- [ ] Profil participant créé
- [ ] Profil participant approuvé par admin
- [ ] Compétition créée par admin
- [ ] Compétition active (is_active = 1)
- [ ] Compétition dans les dates (start_date < now < end_date)

---

## 🆘 Dépannage

### Problème: "Vous devez créer un profil participant"
**Solution:** Aller sur `/profile/edit` et créer son profil

### Problème: "Votre profil doit être approuvé"
**Solution:** Attendre qu'un administrateur approuve le profil via le panel admin

### Problème: "Les inscriptions sont fermées"
**Solution:** Vérifier que la compétition est active et dans les dates

### Problème: Page vide de compétitions
**Solution:** Un admin doit créer des compétitions via `/admin/competitions`

---

## 📚 Ressources

- Page liste: `/competitions`
- Page détail: `/competitions/:id`
- API documentation: Ce fichier
- Schema DB: `DB_SCHEMA_REFERENCE.md`
- Panel admin: `/admin/competitions`
