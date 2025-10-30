# 🗑️ Fonctionnalité de Suppression d'Utilisateurs

## Implémentation

### 1. API DELETE ajoutée

**Fichier :** `src/app/api/admin/users/[id]/route.ts`

**Méthode :** `DELETE /api/admin/users/:id`

**Headers requis :**
```
Authorization: Bearer {token}
```

**Comportement :**
1. Vérifie l'authentification admin
2. Vérifie que l'utilisateur existe
3. Supprime l'utilisateur de la table `users`
4. **Suppression en CASCADE automatique** :
   - Participant supprimé (si existe)
   - Médias supprimés (photos/vidéos)
   - Votes supprimés
   - Liens sociaux supprimés
   - Etc.

**Response succès :**
```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

**Response erreur :**
```json
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

### 2. Bouton de suppression dans la liste

**Fichier :** `src/app/admin/users/page.tsx`

**Position :** À côté des boutons "Voir" et "Valider"

**Apparence :**
- ❌ Icône poubelle (Trash2)
- 🔴 Couleur rouge
- 📏 Taille "sm"

**Code :**
```tsx
<Button 
  size="sm" 
  variant="destructive"
  onClick={() => deleteUser(user.id, user.name)}
  className="bg-red-500 hover:bg-red-600"
>
  <Trash2 className="h-4 w-4 mr-1" />
  Supprimer
</Button>
```

### 3. Bouton de suppression dans la page de détails

**Fichier :** `src/app/admin/users/[id]/page.tsx`

**Position :** En haut à gauche, à côté du bouton "Retour"

**Comportement :** Identique à la liste + redirection vers `/admin/users` après suppression

## Sécurité

### Confirmation obligatoire

Avant la suppression, une popup de confirmation s'affiche :

```
Êtes-vous sûr de vouloir supprimer l'utilisateur "Dyanos Charbel" ?

Cette action est irréversible et supprimera également son profil participant et tous ses votes.
```

**Deux choix :**
- ❌ **Annuler** → Rien ne se passe
- ✅ **OK** → Suppression effectuée

### Vérifications côté serveur

1. ✅ **Token JWT valide** requis
2. ✅ **Rôle admin** vérifié
3. ✅ **Utilisateur existe** avant suppression
4. ✅ **Pas de suppression du super admin** (optionnel)

### Messages d'erreur

```typescript
// Erreur réseau
alert('Erreur lors de la suppression de l\'utilisateur');

// Erreur API
alert(`Erreur : ${data.message}`);
```

## Suppression en CASCADE

Grâce aux contraintes `ON DELETE CASCADE` dans la base de données :

### Automatiquement supprimés :

| Table | Relation | Comportement |
|-------|----------|--------------|
| `participants` | `user_id` | ✅ CASCADE |
| `media` | `participant_id` | ✅ CASCADE |
| `votes` (voteur) | `voter_id` | ⚠️ SET NULL |
| `votes` (participant) | `participant_id` | ✅ CASCADE |
| `social_links` | `participant_id` | ✅ CASCADE |
| `competition_entries` | `participant_id` | ✅ CASCADE |

### Explication :

**CASCADE** = Supprimé automatiquement
```sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

**SET NULL** = Référence mise à NULL
```sql
FOREIGN KEY (voter_id) REFERENCES users(id) ON DELETE SET NULL
```

## Workflow

### Depuis la liste (`/admin/users`)

```
Admin clique "Supprimer"
    ↓
Popup de confirmation
    ↓
Admin confirme "OK"
    ↓
DELETE /api/admin/users/:id
    ↓
Utilisateur + données liées supprimés
    ↓
Liste rechargée automatiquement
    ↓
Utilisateur disparaît de la liste
```

### Depuis la page de détails (`/admin/users/:id`)

```
Admin clique "Supprimer"
    ↓
Popup de confirmation
    ↓
Admin confirme "OK"
    ↓
DELETE /api/admin/users/:id
    ↓
Utilisateur + données liées supprimés
    ↓
Redirection vers /admin/users
```

## Fonctions JavaScript

### Dans la liste

```typescript
const deleteUser = async (id: number, name: string) => {
  // Confirmation
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ?...`)) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      await fetchUsers(); // Recharge la liste
    }
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
};
```

### Dans la page de détails

```typescript
const deleteUser = async () => {
  // Confirmation
  if (!confirm(`Êtes-vous sûr...`)) return;

  try {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      router.push('/admin/users'); // Redirection
    }
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
};
```

## Tests

### Test 1 : Suppression depuis la liste

1. Aller sur `/admin/users`
2. Cliquer sur "Supprimer" pour un user
3. **Vérifier** : Popup de confirmation s'affiche
4. Cliquer "Annuler"
5. **Vérifier** : Rien ne se passe
6. Re-cliquer "Supprimer"
7. Cliquer "OK"
8. **Vérifier** : 
   - User supprimé de la BD
   - Liste rechargée
   - User n'apparaît plus

### Test 2 : Suppression depuis la page de détails

1. Aller sur `/admin/users/1`
2. Cliquer sur "Supprimer" (bouton rouge en haut)
3. Confirmer
4. **Vérifier** :
   - User supprimé
   - Redirection vers `/admin/users`
   - User n'apparaît plus dans la liste

### Test 3 : Vérifier CASCADE

1. Créer un user avec participant + médias + votes
2. Supprimer le user
3. **Vérifier dans la BD** :
   ```sql
   SELECT * FROM participants WHERE user_id = 1; -- Vide
   SELECT * FROM media WHERE participant_id = 1; -- Vide
   SELECT * FROM votes WHERE participant_id = 1; -- Vide
   ```

### Test 4 : Sécurité

1. Essayer de supprimer sans être admin
2. **Vérifier** : Erreur 403 Forbidden
3. Essayer sans token
4. **Vérifier** : Erreur 401 Unauthorized

## Apparence visuelle

### Liste des utilisateurs

```
┌─────────────────────────────────────────────┐
│ [D]  Dyanos Charbel           [En attente]  │
│      📧 sannicharbel@gmail.com              │
│      📅 16/10/2025                          │
│      [Voir] [Valider] [🗑️ Supprimer]       │
└─────────────────────────────────────────────┘
```

### Page de détails

```
[← Retour] [🗑️ Supprimer]              [Validé]
                                   [Valider le compte]
```

## Améliorations futures possibles

1. **Modal de confirmation stylisée** (au lieu de confirm())
2. **Raison de suppression** (champ texte optionnel)
3. **Soft delete** (marquer comme supprimé au lieu de supprimer)
4. **Log d'activité** (tracer qui a supprimé qui et quand)
5. **Restauration** (si soft delete implémenté)
6. **Suppression en masse** (sélectionner plusieurs users)
7. **Export avant suppression** (sauvegarder les données)

## Sécurité renforcée (optionnel)

### Empêcher la suppression du super admin

```typescript
// Dans l'API DELETE
const users = await query(
  'SELECT id FROM users WHERE id = ?',
  [userId]
) as any[];

// Vérifier si c'est l'admin principal
const admins = await query(
  'SELECT is_super_admin FROM admins WHERE user_id = ?',
  [userId]
) as any[];

if (admins.length > 0 && admins[0].is_super_admin) {
  return NextResponse.json(
    { success: false, message: 'Impossible de supprimer le super administrateur' },
    { status: 403 }
  );
}
```

### Exiger un mot de passe admin

```typescript
// Demander le mot de passe avant suppression
const password = prompt('Entrez votre mot de passe admin pour confirmer :');

// Envoyer avec la requête
body: JSON.stringify({ password })
```

## Résumé

✅ **API DELETE créée** (`/api/admin/users/:id`)  
✅ **Bouton de suppression dans la liste**  
✅ **Bouton de suppression dans la page de détails**  
✅ **Confirmation obligatoire** avant suppression  
✅ **Suppression CASCADE** automatique des données liées  
✅ **Sécurité** : Admin uniquement, token requis  
✅ **Feedback** : Messages d'erreur, rechargement auto  
✅ **UX** : Bouton rouge, icône poubelle

La fonctionnalité de suppression est maintenant complète et sécurisée ! 🗑️
