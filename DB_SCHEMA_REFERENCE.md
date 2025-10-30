# 📚 Référence Schéma Base de Données - Sapologie

## Structure de la base de données

### Tables principales

#### 1. `users` - Utilisateurs
Utilisateurs inscrits sur la plateforme.

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_base64 LONGTEXT,
  is_active TINYINT(1) DEFAULT 1,
  email_verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Champs clés :**
- `username` : Nom d'utilisateur unique (peut être vide)
- `email` : Email unique pour la connexion
- `password_hash` : Mot de passe hashé avec bcrypt
- `avatar_base64` : Avatar en base64 (LONGTEXT)

---

#### 2. `admins` - Administrateurs
Comptes administrateurs du site.

```sql
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  is_super_admin TINYINT(1) DEFAULT 0,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Champs clés :**
- `is_super_admin` : Super administrateur avec tous les droits
- `last_login` : Date de dernière connexion

---

#### 3. `participants` - Participants au concours
Profils des participants au concours de sapologie.

```sql
CREATE TABLE participants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  stage_name VARCHAR(100) NOT NULL,
  bio TEXT,
  category VARCHAR(50),
  location VARCHAR(100),
  age INT,
  favorite_style VARCHAR(100),
  inspiration TEXT,
  is_approved TINYINT(1) DEFAULT 0,
  is_featured TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Champs clés :**
- `stage_name` : Nom de scène du participant
- `is_approved` : Statut d'approbation (0 = en attente, 1 = approuvé)
- `is_featured` : Participant mis en avant
- **Un user ne peut avoir qu'un seul profil participant**

---

#### 4. `media` - Médias des participants
Photos et vidéos des participants en base64.

```sql
CREATE TABLE media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_id INT,
  media_data LONGTEXT NOT NULL,
  media_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255),
  file_size INT,
  is_primary TINYINT(1) DEFAULT 0,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);
```

**Champs clés :**
- `media_data` : Données en base64 (LONGTEXT)
- `media_type` : Type de média (image, video, etc.)
- `is_primary` : Photo principale du participant
- `position` : Ordre d'affichage
- **Les médias sont supprimés si le participant est supprimé (CASCADE)**

---

#### 5. `votes` - Votes des utilisateurs
Système de vote pour les participants.

```sql
CREATE TABLE votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_id INT,
  voter_id INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_vote (participant_id, voter_id)
);
```

**Règles :**
- **Un utilisateur ne peut voter qu'une fois par participant** (UNIQUE)
- Enregistrement de l'IP et user-agent pour prévenir la fraude
- Si l'utilisateur est supprimé, le vote reste mais voter_id = NULL

---

#### 6. `competitions` - Compétitions
Gestion des compétitions/concours.

```sql
CREATE TABLE competitions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  max_votes_per_user INT DEFAULT 1,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);
```

**Champs clés :**
- `is_active` : Compétition active ou non
- `max_votes_per_user` : Limite de votes par utilisateur
- **Créée par un admin**

---

#### 7. `competition_entries` - Inscriptions aux compétitions
Association participants ↔ compétitions.

```sql
CREATE TABLE competition_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT,
  participant_id INT,
  status VARCHAR(20) DEFAULT 'pending',
  votes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_competition_participant (competition_id, participant_id)
);
```

**Règles :**
- **Un participant ne peut s'inscrire qu'une fois par compétition** (UNIQUE)
- `votes_count` : Cache du nombre de votes (pour performance)

---

#### 8. `social_links` - Liens réseaux sociaux
Liens vers les profils sociaux des participants.

```sql
CREATE TABLE social_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_id INT,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(100) NOT NULL,
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  UNIQUE KEY unique_platform_per_participant (participant_id, platform)
);
```

**Plateformes supportées :**
- Instagram, Facebook, Twitter, TikTok, etc.
- **Un seul lien par plateforme par participant**

---

#### 9. `prizes` - Prix des compétitions
Prix à gagner dans les compétitions.

```sql
CREATE TABLE prizes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  position INT NOT NULL,
  value DECIMAL(10,2),
  sponsor VARCHAR(100),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);
```

**Champs clés :**
- `position` : Classement (1er, 2ème, 3ème prix, etc.)
- `value` : Valeur du prix en euros
- `sponsor` : Sponsor du prix

---

#### 10. `winners` - Gagnants
Association des gagnants aux compétitions et prix.

```sql
CREATE TABLE winners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT,
  participant_id INT,
  prize_id INT,
  position INT NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
  FOREIGN KEY (prize_id) REFERENCES prizes(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
);
```

---

#### 11. `categories` - Catégories
Catégories pour organiser les participants.

```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### 12. `admin_activities` - Logs d'activité admin
Traçabilité des actions administrateurs.

```sql
CREATE TABLE admin_activities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT,
  action_type VARCHAR(50) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);
```

**Actions tracées :**
- Approbation/rejet de participants
- Création/modification de compétitions
- Assignation de gagnants
- etc.

---

## Relations importantes

### User → Participant (1:1)
```
users.id → participants.user_id
```
Un utilisateur peut devenir un participant.

### Participant → Media (1:N)
```
participants.id → media.participant_id
```
Un participant peut avoir plusieurs photos/vidéos.

### Participant → Votes (1:N)
```
participants.id → votes.participant_id
```
Un participant peut recevoir plusieurs votes.

### User → Votes (1:N)
```
users.id → votes.voter_id
```
Un utilisateur peut voter pour plusieurs participants (1 fois chacun).

### Competition → Entries (1:N)
```
competitions.id → competition_entries.competition_id
```
Une compétition peut avoir plusieurs participants inscrits.

---

## Points importants pour les APIs

### Champs en base64
- `users.avatar_base64` : Avatar utilisateur
- `media.media_data` : Photos/vidéos participants

### Règles d'unicité
- Un utilisateur = un email unique
- Un participant par utilisateur
- Un vote par utilisateur par participant
- Une inscription par participant par compétition
- Un lien par plateforme sociale par participant

### Suppressions en cascade (CASCADE)
- Supprimer un user → supprime son participant
- Supprimer un participant → supprime ses médias, votes, liens sociaux
- Supprimer une compétition → supprime ses inscriptions, prix, gagnants

### Suppressions en NULL (SET NULL)
- Supprimer un admin → les éléments créés restent mais created_by = NULL
- Supprimer un user voteur → le vote reste mais voter_id = NULL

---

## Requêtes utiles

### Récupérer un participant avec ses médias et votes
```sql
SELECT 
  p.*,
  u.email,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT v.id) as votes_count,
  COUNT(DISTINCT m.id) as media_count
FROM participants p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN votes v ON p.id = v.participant_id
LEFT JOIN media m ON p.id = m.participant_id
WHERE p.id = ?
GROUP BY p.id;
```

### Top participants par votes
```sql
SELECT 
  p.id,
  p.stage_name,
  COUNT(v.id) as votes_count
FROM participants p
LEFT JOIN votes v ON p.id = v.participant_id
WHERE p.is_approved = 1
GROUP BY p.id
ORDER BY votes_count DESC
LIMIT 10;
```

### Vérifier si un user a voté pour un participant
```sql
SELECT COUNT(*) as has_voted
FROM votes
WHERE participant_id = ? AND voter_id = ?;
```

---

## Différences avec le code initial

### Table `media`
- **Colonne** : `media_data` (pas `media_base64`)
- **Colonne** : `position` (pas `display_order`)
- **Pas de colonne** : `caption`

### Table `participants`
- **Pas de colonne** : `profile_photo_base64`
- La photo principale est dans `media` avec `is_primary = 1`

### Codes corrigés
✅ `src/app/api/admin/users/[id]/route.ts`  
✅ `src/app/admin/users/[id]/page.tsx`

---

## Encodage et performances

### Base64 et LONGTEXT
- Les champs `LONGTEXT` peuvent stocker jusqu'à **4 GB**
- Une image de 1 MB en base64 ≈ 1.33 MB
- Recommandation : limiter la taille des uploads à 5 MB

### Indexation
- Tous les ID ont des index
- Les foreign keys ont des index automatiques
- Index sur `votes(participant_id, voter_id)` pour la contrainte d'unicité

### Optimisations possibles
- Utiliser `votes_count` dans `competition_entries` au lieu de compter à chaque fois
- Mettre en cache les statistiques fréquemment demandées
- Paginer les résultats de recherche
