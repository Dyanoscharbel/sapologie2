# 🚀 Guide de Démarrage Rapide

## Première utilisation de l'application

### Étape 1 : Vérifier la base de données

Assurez-vous que MySQL est démarré et que la base de données existe :

```sql
CREATE DATABASE IF NOT EXISTS sapologie;
USE sapologie;
```

### Étape 2 : Configuration

Vérifiez que le fichier `.env.local` existe à la racine du projet avec :

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sapologie

# JWT Secret
JWT_SECRET=votre_secret_jwt_tres_long_et_securise

# Admin (optionnel - valeurs par défaut)
ADMIN_EMAIL=admin@sapologie.com
ADMIN_PASSWORD=Admin123!
ADMIN_NAME=Administrateur Principal
```

### Étape 3 : Démarrer le serveur

```bash
pnpm dev
```

Le serveur démarre sur : `http://localhost:3000`

### Étape 4 : Initialiser l'administrateur

**Option A - Via l'interface web (RECOMMANDÉ)** :
1. Ouvrez votre navigateur
2. Allez sur : `http://localhost:3000/init-admin`
3. Cliquez sur "Initialiser l'Administrateur"
4. Notez les identifiants affichés

**Option B - Via la page de login** :
1. Allez sur : `http://localhost:3000/login`
2. En bas de la page, cliquez sur "Initialiser l'administrateur"
3. Suivez les instructions

### Étape 5 : Se connecter

1. Allez sur : `http://localhost:3000/login`
2. Utilisez les identifiants :
   - Email : `admin@sapologie.com`
   - Mot de passe : `Admin123!`
3. Cliquez sur "Se connecter"

### Étape 6 : Créer un compte utilisateur

1. Allez sur : `http://localhost:3000/register`
2. Remplissez le formulaire
3. Votre compte sera créé automatiquement

## 🧪 Tests

### Tester la connexion à la base de données

```
http://localhost:3000/api/test-db
```

Résultat attendu :
```json
{
  "success": true,
  "message": "Connexion à la base de données réussie"
}
```

### Page de test complète

```
http://localhost:3000/test-auth
```

Cette page permet de tester :
- Connexion BD
- Inscription
- Connexion

## 📌 URLs importantes

| Fonction | URL |
|----------|-----|
| Accueil | `http://localhost:3000` |
| Connexion | `http://localhost:3000/login` |
| Inscription | `http://localhost:3000/register` |
| Initialiser Admin | `http://localhost:3000/init-admin` |
| Test DB | `http://localhost:3000/api/test-db` |
| Tests Auth | `http://localhost:3000/test-auth` |

## 🔧 Problèmes courants

### MySQL ne démarre pas
```bash
# Windows
net start MySQL

# Vérifier le statut
net start | findstr MySQL
```

### La base de données n'existe pas
```sql
CREATE DATABASE sapologie;
```

### Erreur "Table doesn't exist"
La page `/init-admin` crée automatiquement les tables nécessaires.

### L'admin existe déjà
Normal ! Utilisez les identifiants existants ou modifiez l'email dans `.env.local`

## 📝 Structure de la base de données

Les tables seront créées automatiquement lors de l'initialisation :

- `admins` - Comptes administrateurs
- `users` - Utilisateurs de l'application
- `participants` - Profils des participants
- `votes` - Votes des utilisateurs
- `media` - Photos/vidéos (base64)
- `competitions` - Compétitions
- Et autres tables...

## ✅ Checklist de démarrage

- [ ] MySQL est démarré
- [ ] Base de données `sapologie` existe
- [ ] Fichier `.env.local` configuré
- [ ] Serveur Next.js démarré (`pnpm dev`)
- [ ] Admin initialisé via `/init-admin`
- [ ] Connexion testée avec les identifiants admin
- [ ] Compte utilisateur créé via `/register`

## 🎯 Prochaines étapes

1. **Changer le mot de passe admin** après la première connexion
2. **Créer des compétitions** dans l'interface admin
3. **Inviter des participants** à s'inscrire
4. **Configurer les règles** du concours

## 🆘 Besoin d'aide ?

Consultez le fichier `TROUBLESHOOTING.md` pour les solutions aux problèmes courants.
