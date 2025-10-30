# ✅ Corrections Schéma Base de Données

## Problème identifié

Le code utilisait des noms de colonnes qui ne correspondaient pas à votre schéma de base de données réel.

## Différences entre code et schéma réel

### Table `media`

| Code initial | Schéma réel | Correction |
|-------------|-------------|------------|
| `media_base64` | `media_data` | ✅ Corrigé |
| `display_order` | `position` | ✅ Corrigé |
| `caption` | ❌ N'existe pas | ✅ Utilisé `file_name` à la place |

### Table `participants`

| Code initial | Schéma réel | Correction |
|-------------|-------------|------------|
| `profile_photo_base64` | ❌ N'existe pas | ✅ Utilise `media` avec `is_primary=1` |

## Fichiers corrigés

### 1. `/api/admin/users/[id]/route.ts`

**Avant :**
```typescript
SELECT 
  p.profile_photo_base64
FROM users u
LEFT JOIN participants p ON u.id = p.user_id
```

**Après :**
```typescript
SELECT 
  p.category,
  p.location,
  p.age
FROM users u
LEFT JOIN participants p ON u.id = p.user_id
```

**Avant :**
```typescript
SELECT 
  media_base64,
  caption,
  display_order
FROM media
ORDER BY display_order ASC
```

**Après :**
```typescript
SELECT 
  media_data,
  file_name,
  position,
  is_primary
FROM media
ORDER BY position ASC
```

### 2. `/admin/users/[id]/page.tsx`

**Avant :**
```typescript
interface UserDetail {
  participant?: {
    profilePhoto?: string;
    media: Array<{
      base64: string;
      caption?: string;
      order: number;
    }>;
  };
}
```

**Après :**
```typescript
interface UserDetail {
  participant?: {
    category?: string;
    location?: string;
    age?: number;
    media: Array<{
      base64: string;
      fileName?: string;
      position: number;
      isPrimary: boolean;
    }>;
  };
}
```

**Affichage images - Avant :**
```tsx
<img src={`data:image/jpeg;base64,${media.base64}`} />
<p>{media.caption || `Photo ${i + 1}`}</p>
```

**Affichage images - Après :**
```tsx
<img src={`data:image/jpeg;base64,${media.base64}`} />
<p>{media.fileName || `Photo ${i + 1}`}</p>
{media.isPrimary && <span>Photo principale</span>}
```

## Nouvelles fonctionnalités ajoutées

### Affichage des infos supplémentaires du participant

✅ **Catégorie** (si remplie)
✅ **Localisation** (si remplie)
✅ **Âge** (si rempli)
✅ **Indicateur "Photo principale"** sur le média avec `is_primary = 1`

## Structure de données complète

### API Response - GET /api/admin/users/:id

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dyanos Charbel",
    "email": "sannicharbel@gmail.com",
    "firstName": "Dyanos",
    "lastName": "Charbel",
    "avatarBase64": null,
    "createdAt": "16/10/2025",
    "isActive": true,
    "participant": {
      "id": 1,
      "stageName": "Stage Name",
      "bio": "Ma biographie...",
      "isApproved": false,
      "category": "Élégance classique",
      "location": "Paris",
      "age": 25,
      "votesCount": 0,
      "media": [
        {
          "id": 1,
          "type": "image",
          "base64": "data:image/jpeg;base64,...",
          "fileName": "photo1.jpg",
          "isPrimary": true,
          "position": 1
        }
      ]
    },
    "status": "pending"
  }
}
```

## Tables et colonnes utilisées

### Requête principale (users + participants)
```sql
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.avatar_base64,
  u.created_at,
  u.is_active,
  p.id as participant_id,
  p.stage_name,
  p.bio,
  p.is_approved,
  p.category,        -- AJOUTÉ
  p.location,        -- AJOUTÉ
  p.age              -- AJOUTÉ
FROM users u
LEFT JOIN participants p ON u.id = p.user_id
WHERE u.id = ?
```

### Requête médias
```sql
SELECT 
  id,
  media_type,
  media_data,        -- CORRIGÉ (était media_base64)
  file_name,         -- AJOUTÉ
  is_primary,        -- AJOUTÉ
  position,          -- CORRIGÉ (était display_order)
  created_at
FROM media
WHERE participant_id = ?
ORDER BY position ASC, created_at DESC
```

### Requête votes
```sql
SELECT COUNT(*) as total
FROM votes
WHERE participant_id = ?
```

## Tests de vérification

### 1. Vérifier la structure de votre table media
```sql
DESCRIBE media;
```

**Résultat attendu :**
- `media_data` LONGTEXT ✅
- `position` INT ✅
- `is_primary` TINYINT(1) ✅
- `file_name` VARCHAR(255) ✅

### 2. Tester l'API
```bash
curl http://localhost:3000/api/admin/users/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Doit retourner :**
- ✅ `participant.media[].base64` (données de `media_data`)
- ✅ `participant.media[].fileName`
- ✅ `participant.media[].isPrimary`
- ✅ `participant.media[].position`
- ✅ `participant.category`
- ✅ `participant.location`
- ✅ `participant.age`

### 3. Vérifier l'affichage
1. Connectez-vous en admin
2. Allez sur `/admin/users/1`
3. Vérifiez que :
   - ✅ Les photos s'affichent
   - ✅ "Photo principale" apparaît sur la bonne photo
   - ✅ Catégorie, localisation, âge s'affichent (si renseignés)

## Données de test

Vous avez actuellement dans votre BD :
- **1 admin** : admin@sapologie.com
- **1 user** : sannicharbel@gmail.com (Dyanos Charbel)
- **0 participants** (pour le moment)
- **0 médias**

### Pour tester complètement

Créez un participant pour l'utilisateur existant :

```sql
INSERT INTO participants (
  user_id, 
  stage_name, 
  bio, 
  category, 
  location, 
  age, 
  is_approved
) VALUES (
  1, 
  'Le Sap', 
  'Passionné de mode et d\'élégance', 
  'Élégance classique',
  'Paris',
  25,
  0
);
```

Ajoutez quelques médias :

```sql
-- Photo principale
INSERT INTO media (
  participant_id,
  media_data,
  media_type,
  file_name,
  is_primary,
  position
) VALUES (
  1,
  'BASE64_DATA_HERE',
  'image/jpeg',
  'photo_principale.jpg',
  1,
  1
);

-- Photo secondaire
INSERT INTO media (
  participant_id,
  media_data,
  media_type,
  file_name,
  is_primary,
  position
) VALUES (
  1,
  'BASE64_DATA_HERE',
  'image/jpeg',
  'photo_2.jpg',
  0,
  2
);
```

## Checklist finale

- [x] Colonnes `media_data`, `position`, `is_primary`, `file_name` utilisées
- [x] Colonnes `category`, `location`, `age` récupérées
- [x] Interface TypeScript mise à jour
- [x] Affichage des images corrigé
- [x] Indicateur "Photo principale" ajouté
- [x] Infos supplémentaires du participant affichées
- [x] Documentation créée (DB_SCHEMA_REFERENCE.md)
- [x] Toutes les requêtes SQL corrigées

## Résultat

✅ **Le code correspond maintenant exactement à votre schéma de base de données**  
✅ **Les pages affichent les vraies données depuis MySQL**  
✅ **Toutes les colonnes correctes sont utilisées**  
✅ **Documentation complète de votre schéma disponible**
