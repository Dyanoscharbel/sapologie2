# 🔧 Guide de Dépannage - Authentification

## Problème: La page se recharge lors de la connexion

### Étapes de diagnostic

#### 1. Vérifier la base de données

```sql
-- Vérifier que la base de données existe
SHOW DATABASES LIKE 'sapologie';

-- Vérifier que les tables existent
USE sapologie;
SHOW TABLES;

-- Vérifier la table users
DESCRIBE users;
SELECT * FROM users LIMIT 5;
```

#### 2. Tester la connexion à la BD

Accédez à: `http://localhost:3000/api/test-db`

Vous devriez voir:
```json
{
  "success": true,
  "message": "Connexion à la base de données réussie"
}
```

#### 3. Utiliser la page de test

Accédez à: `http://localhost:3000/test-auth`

Cette page vous permet de:
- Tester la connexion BD
- Créer un utilisateur test
- Tester la connexion

#### 4. Vérifier les logs

Ouvrez la console du navigateur (F12) et recherchez:
- ❌ Erreurs en rouge
- 🔵 Messages de debug commençant par "🔵"
- 🔴 Erreurs commençant par "🔴"

### Solutions courantes

#### A. La base de données n'existe pas

```sql
CREATE DATABASE sapologie;
USE sapologie;

-- Exécutez le script SQL complet fourni
```

#### B. Les tables n'existent pas

Exécutez le script SQL complet fourni précédemment pour créer toutes les tables.

#### C. Variables d'environnement manquantes

Vérifiez que `.env.local` contient:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sapologie
JWT_SECRET=votre_secret_jwt_tres_long_et_securise
```

#### D. MySQL n'est pas démarré

Windows:
```bash
net start MySQL
```

#### E. Redémarrer le serveur Next.js

Après avoir modifié `.env.local`:
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

### Test manuel via API

#### Créer un utilisateur:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

#### Se connecter:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Erreurs fréquentes et solutions

| Erreur | Cause | Solution |
|--------|-------|----------|
| `ECONNREFUSED` | MySQL non démarré | Démarrez MySQL |
| `ER_BAD_DB_ERROR` | Base de données inexistante | Créez la base `sapologie` |
| `ER_NO_SUCH_TABLE` | Tables manquantes | Exécutez le script SQL |
| `ER_DUP_ENTRY` | Email déjà utilisé | Utilisez un autre email |
| `401 Unauthorized` | Mot de passe incorrect | Vérifiez le mot de passe |

### Logs utiles

Ajoutez des console.log dans votre code pour déboguer:

```typescript
// Dans onSubmit de la page login
console.log('🔵 Tentative de connexion:', data.email);

// Dans la fonction login du AuthContext
console.log('🔵 Appel API login');
console.log('🔵 Réponse:', response.status);
```

### Contact

Si le problème persiste:
1. Vérifiez tous les points ci-dessus
2. Consultez les logs du serveur dans le terminal
3. Consultez les logs du navigateur (F12 → Console)
4. Vérifiez la configuration de MySQL
