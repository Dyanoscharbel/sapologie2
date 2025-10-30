# 📊 Dashboard User - Données Réelles

## Objectif

Afficher les vraies données de la base de données dans le dashboard utilisateur au lieu du template par défaut avec des données mockées.

## Modifications apportées

### 1. Création de l'API Dashboard

**Fichier :** `src/app/api/user/dashboard/route.ts`

**Endpoint :** `GET /api/user/dashboard`

**Fonctionnalités :**
- ✅ Récupère l'utilisateur connecté via token JWT
- ✅ Charge les informations du participant (si existe)
- ✅ Compte les votes reçus
- ✅ Compte les photos/médias
- ✅ Calcule la position dans le classement
- ✅ Récupère le top 10 des participants
- ✅ Génère des suggestions aléatoires
- ✅ Compile l'activité récente (votes donnés + reçus)

**Données retournées :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "base64..."
    },
    "stats": {
      "votes": 42,
      "photos": 5,
      "position": 3,
      "isApproved": true
    },
    "participant": {
      "id": 1,
      "stageName": "Le Sap",
      "bio": "...",
      "category": "Élégance"
    },
    "topParticipants": [
      {
        "id": 1,
        "name": "Sophie",
        "votes": 89,
        "avatar": "base64...",
        "position": 1
      }
    ],
    "suggested": [
      {
        "id": 4,
        "name": "Emma",
        "style": "Classique",
        "avatar": "base64..."
      }
    ],
    "recentActivity": [
      {
        "type": "vote_given",
        "text": "Vous avez voté pour Sophie",
        "time": "Il y a 2h"
      }
    ]
  }
}
```

### 2. Mise à jour du Dashboard Page

**Fichier :** `src/app/dashboard/page.tsx`

#### Avant (❌ Template avec données mockées)

```typescript
// Données hardcodées
const suggestedToVote = [
  { id: 4, name: "Emma Martin", style: "Classique Élégant", ... },
  ...
];

const recentActivity = [
  { id: 1, type: "vote", text: "Vous avez voté...", ... },
  ...
];

// Utilisation de l'ancien système d'auth
const authUser = getAuthUser();
const userStats = initializeUserStats(authUser.email, authUser.name);
```

#### Après (✅ Chargement des vraies données)

```typescript
// Interface TypeScript pour les données
interface DashboardData {
  user: { id, name, email, avatar };
  stats: { votes, photos, position, isApproved };
  participant: { ... } | null;
  topParticipants: Array<...>;
  suggested: Array<...>;
  recentActivity: Array<...>;
}

// Chargement depuis l'API
const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

const fetchDashboardData = async () => {
  const response = await fetch('/api/user/dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (data.success) {
    setDashboardData(data.data);
  }
};
```

### 3. Sections mises à jour

#### Header (Hero Section)

```typescript
// ✅ Avatar avec base64
<AvatarImage src={getUserAvatar(currentUser.avatar)} />

// ✅ Message conditionnel selon statut
{stats.isApproved 
  ? (stats.position > 0 ? `Position #${stats.position}` : "Commencez à briller !") 
  : "Votre compte est en attente de validation"}

// ✅ Badge position
{stats.position > 0 ? `#${stats.position}` : "-"}
```

#### Quick Stats

```typescript
// Votes reçus
<p className="text-3xl font-bold">{stats.votes}</p>

// Mes photos
<p className="text-3xl font-bold">{stats.photos}</p>
<Camera className="h-6 w-6 text-white" /> // Icône corrigée

// Participants totaux
<p className="text-3xl font-bold">{topParticipants.length}</p>

// Classement
<p className="text-3xl font-bold">
  {stats.position > 0 ? `#${stats.position}` : "-"}
</p>
```

#### Progression vers position suivante

```typescript
// Calcul dynamique
const nextPosition = topParticipants.find(p => p.position === stats.position - 1);
const progressToNext = nextPosition 
  ? Math.min(100, (stats.votes / nextPosition.votes) * 100) 
  : 0;

// Affichage conditionnel
{nextPosition && (
  <div className="space-y-2">
    <span>Progression vers #{nextPosition.position}</span>
    <span>{stats.votes}/{nextPosition.votes}</span>
    <Progress value={progressToNext} />
  </div>
)}
```

#### Top Participants

```typescript
// Top 10 au lieu de Top 3
{topParticipants.slice(0, 10).map((participant) => (
  <div className={participant.id === dashboardData.participant?.id 
    ? 'bg-white shadow-md border-2 border-primary/30'  // Highlight si c'est vous
    : 'bg-white/50'
  }>
    <Badge>#{participant.position}</Badge>
    <Avatar>
      <AvatarImage src={getUserAvatar(participant.avatar)} />
    </Avatar>
    <div>
      <p>{participant.name}</p>
      <p>{participant.votes} votes</p>
    </div>
    {participant.id === dashboardData.participant?.id && (
      <Badge>Vous</Badge>
    )}
  </div>
))}
```

#### Activité Récente

```typescript
// Affichage dynamique avec fallback
{recentActivity.length > 0 ? (
  recentActivity.slice(0, showAll ? undefined : 3).map((activity, index) => {
    const Icon = getActivityIcon(activity.type); // vote_given, vote_received, etc.
    return (
      <div key={index}>
        <Icon className="h-4 w-4 text-primary" />
        <p>{activity.text}</p>
        <p>{activity.time}</p>
      </div>
    );
  })
) : (
  <p>Aucune activité récente</p>
)}
```

#### Suggestions À Découvrir

```typescript
// Participants suggérés depuis l'API
{suggested.length > 0 ? (
  suggested.map((participant) => (
    <div key={participant.id}>
      <Avatar>
        <AvatarImage src={getUserAvatar(participant.avatar)} />
      </Avatar>
      <div>
        <p>{participant.name}</p>
        <p>{participant.style}</p>
      </div>
      <Link href={`/participant/${participant.id}`}>
        <ChevronRight />
      </Link>
    </div>
  ))
) : (
  <p>Aucune suggestion</p>
)}
```

#### Concours Info

```typescript
// Nombre réel de participants
<span>{topParticipants.length}</span>
```

### 4. Helpers Functions

```typescript
// Convertir avatar base64 en URL data
const getUserAvatar = (avatar?: string) => {
  return avatar ? `data:image/jpeg;base64,${avatar}` : undefined;
};

// Déterminer l'icône selon le type d'activité
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'vote_given': return Heart;
    case 'vote_received': return Star;
    case 'photo': return Camera;
    case 'rank': return Trophy;
    default: return Heart;
  }
};
```

## Calculs effectués par l'API

### Position dans le classement

```sql
SELECT COUNT(*) + 1 as position
FROM participants p
LEFT JOIN (
  SELECT participant_id, COUNT(*) as vote_count
  FROM votes
  GROUP BY participant_id
) v ON p.id = v.participant_id
WHERE COALESCE(v.vote_count, 0) > ?
```

**Logique :** Compter combien de participants ont plus de votes que l'utilisateur actuel.

### Top Participants

```sql
SELECT 
  p.id,
  p.stage_name,
  u.avatar_base64,
  COUNT(v.id) as votes,
  p.category
FROM participants p
INNER JOIN users u ON p.user_id = u.id
LEFT JOIN votes v ON p.id = v.participant_id
WHERE p.is_approved = 1
GROUP BY p.id
ORDER BY votes DESC
LIMIT 10
```

### Suggestions aléatoires

```sql
SELECT 
  p.id,
  p.stage_name,
  p.category,
  u.avatar_base64
FROM participants p
INNER JOIN users u ON p.user_id = u.id
WHERE p.is_approved = 1
AND p.user_id != ?  -- Exclure l'utilisateur actuel
ORDER BY RAND()
LIMIT 3
```

### Activité récente

**Votes donnés :**
```sql
SELECT 
  v.created_at,
  p.stage_name,
  'vote' as type
FROM votes v
INNER JOIN participants p ON v.participant_id = p.id
WHERE v.user_id = ?
ORDER BY v.created_at DESC
LIMIT 10
```

**Votes reçus :**
```sql
SELECT 
  v.created_at,
  u.first_name,
  u.last_name,
  'received' as type
FROM votes v
INNER JOIN users u ON v.user_id = u.id
WHERE v.participant_id = ?
ORDER BY v.created_at DESC
LIMIT 10
```

**Fusion et tri :**
```typescript
const allActivity = [
  ...recentVotes.map(v => ({
    type: 'vote_given',
    text: `Vous avez voté pour ${v.stage_name}`,
    time: formatTime(v.created_at),
    timestamp: new Date(v.created_at).getTime()
  })),
  ...votesReceived.map(v => ({
    type: 'vote_received',
    text: `${v.first_name} ${v.last_name} a voté pour vous`,
    time: formatTime(v.created_at),
    timestamp: new Date(v.created_at).getTime()
  }))
].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
```

### Formatage du temps relatif

```typescript
function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return days === 1 ? 'Il y a 1 jour' : `Il y a ${days} jours`;
  if (hours > 0) return hours === 1 ? 'Il y a 1h' : `Il y a ${hours}h`;
  if (minutes > 0) return minutes === 1 ? 'Il y a 1 min' : `Il y a ${minutes} min`;
  return 'À l\'instant';
}
```

## Affichage selon les cas

### Cas 1 : User sans participant

```
Hero: "Votre compte est en attente de validation"
Stats:
  - Votes: 0
  - Photos: 0
  - Position: -
Top Participants: Affichés (sans highlight)
Progression: Masquée (pas de nextPosition)
```

### Cas 2 : Participant non approuvé

```
Hero: "Votre compte est en attente de validation"
Stats:
  - Votes: 0 (même si des médias existent)
  - Photos: 3
  - Position: -
Top Participants: Affichés (sans highlight)
```

### Cas 3 : Participant approuvé avec votes

```
Hero: "Vous êtes actuellement en position #3"
Stats:
  - Votes: 42
  - Photos: 5
  - Position: #3
Top Participants: Affichés avec highlight "Vous"
Progression: "Encore X votes pour atteindre #2"
```

### Cas 4 : Premier du classement

```
Hero: "Vous êtes actuellement en position #1"
Badge: 🏆 #1 (avec style or)
Progression: "Continuez votre progression !" (pas de nextPosition)
```

## Tests

### Test 1 : Dashboard avec participant approuvé

1. Se connecter avec un participant approuvé
2. **Vérifier** :
   - ✅ Votes réels affichés
   - ✅ Position correcte
   - ✅ Top 10 avec données réelles
   - ✅ Avatar en base64
   - ✅ "Vous" sur votre ligne

### Test 2 : Dashboard participant en attente

1. Se connecter avec un participant non approuvé
2. **Vérifier** :
   - ✅ Message "en attente de validation"
   - ✅ Position = "-"
   - ✅ Photos comptées
   - ✅ Pas de votes affichés

### Test 3 : Dashboard sans participant

1. Se connecter avec un user sans participant
2. **Vérifier** :
   - ✅ Message "en attente de validation"
   - ✅ Toutes les stats à 0
   - ✅ Top participants affichés
   - ✅ Suggestions affichées

### Test 4 : Activité récente

1. Voter pour un participant
2. Recharger le dashboard
3. **Vérifier** :
   - ✅ Vote apparaît dans l'activité
   - ✅ Temps relatif correct
   - ✅ Icône appropriée

### Test 5 : Suggestions

1. Vérifier qu'il y a au moins 3 participants approuvés
2. **Vérifier** :
   - ✅ 3 suggestions affichées
   - ✅ Différentes de l'utilisateur actuel
   - ✅ Catégories affichées
   - ✅ Liens fonctionnels

## Résumé des changements

✅ **API `/api/user/dashboard` créée** : Toutes les données en une requête  
✅ **Dashboard mis à jour** : Charge les vraies données via API  
✅ **Calculs dynamiques** : Position, progression, top participants  
✅ **Avatars base64** : Affichage correct des images  
✅ **Activité en temps réel** : Votes donnés + reçus  
✅ **Suggestions aléatoires** : 3 participants à découvrir  
✅ **Gestion des cas** : Participant approuvé, en attente, inexistant  
✅ **Fallbacks** : Messages si pas de données  
✅ **Loader** : Pendant le chargement des données

Le dashboard affiche maintenant les vraies données de la base ! 📊
