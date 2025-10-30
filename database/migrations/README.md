# Migrations de la base de données

## Migration: Ajout des prix aux compétitions

### Date: 17 octobre 2025

### Description
Cette migration ajoute les colonnes nécessaires pour gérer les prix des compétitions directement dans la table `competitions`.

### Colonnes ajoutées:
- `prize_first` (VARCHAR 255) - Prix de la première place
- `prize_second` (VARCHAR 255) - Prix de la deuxième place  
- `prize_third` (VARCHAR 255) - Prix de la troisième place
- `updated_at` (TIMESTAMP) - Date de dernière modification

### Comment appliquer la migration:

#### Option 1: Via phpMyAdmin
1. Ouvrez phpMyAdmin
2. Sélectionnez la base de données `sapologie`
3. Allez dans l'onglet "SQL"
4. Copiez-collez le contenu du fichier `add_prizes_to_competitions.sql`
5. Cliquez sur "Exécuter"

#### Option 2: Via ligne de commande MySQL
```bash
mysql -u root -p sapologie < add_prizes_to_competitions.sql
```

### Vérification
Après avoir exécuté la migration, vérifiez que les colonnes ont été ajoutées:

```sql
DESCRIBE competitions;
```

Vous devriez voir les nouvelles colonnes:
- prize_first
- prize_second
- prize_third
- updated_at

### Notes importantes
- ⚠️ Cette migration est **non destructive** - elle ajoute uniquement des colonnes
- Les colonnes de prix acceptent NULL (optionnel)
- La colonne `updated_at` se mettra à jour automatiquement lors des modifications
- Le code de l'application utilise `name` de la BDD mais l'affiche comme `title` dans l'interface
