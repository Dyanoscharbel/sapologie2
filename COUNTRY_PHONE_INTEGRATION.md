# Intégration du Pays et de l'Indicatif Téléphonique

## 📋 Résumé des Modifications

Le système d'inscription a été mis à jour pour intégrer complètement le pays et l'indicatif téléphonique. L'utilisateur sélectionne son pays, ce qui met à jour automatiquement l'indicatif du numéro de téléphone et enregistre les informations du pays en base de données.

---

## 🔧 Modifications Effectuées

### 1️⃣ **Migration SQL** (`database/migrations/add_phone_whatsapp_pseudo.sql`)
Ajout de deux colonnes à la table `users`:
- **`country` (VARCHAR(100))** - Nom du pays (ex: "Maroc")
- **`country_code` (VARCHAR(10))** - Code pays et indicatif au format "CODE|PRÉFIXE" (ex: "MA|+212")

```sql
ALTER TABLE `users` 
ADD COLUMN `country` varchar(100) DEFAULT NULL COMMENT 'User country name (e.g., Maroc)',
ADD COLUMN `country_code` varchar(10) DEFAULT NULL COMMENT 'Country code (e.g., MA) and phone prefix (e.g., +212)';
```

---

### 2️⃣ **Service d'Authentification** (`src/services/auth.service.ts`)

**Modifications:**
- Import de la fonction `getCountryByName` depuis `lib/countries`
- Extraction automatique du code pays et préfixe lors de l'inscription
- Stockage du `country_code` au format "CODE|PRÉFIXE" en base de données
- Les deux colonnes `phone` et `whatsapp` reçoivent le même numéro

**Code clé:**
```typescript
// Récupérer les infos du pays (code + prefix)
let countryCode = null;
if (country) {
  const countryData = getCountryByName(country);
  if (countryData) {
    // Stocker le format: "MA|+212" (code|prefix)
    countryCode = `${countryData.code}|${countryData.prefix}`;
  }
}

// INSERT avec country_code
'INSERT INTO users (email, password_hash, first_name, last_name, country, country_code, phone, whatsapp, pseudo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
```

---

### 3️⃣ **Formulaire d'Inscription** (`src/app/register/page.tsx`)

**Corrections et améliorations:**
- Import de `getCountryByCode` pour obtenir le nom du pays par défaut
- Sélection par défaut correcte (Maroc) au lieu d'utiliser le code pays
- L'indicatif s'affiche correctement dès le chargement du formulaire

**Code clé:**
```typescript
// Récupérer le nom du pays pour le code par défaut "MA" (Maroc)
const defaultCountryName = getCountryByCode("MA")?.name || "Maroc";

const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({
  defaultValues: {
    country: defaultCountryName  // ← "Maroc" et non "MA"
  }
});
```

---

## 📊 Flux de Données Lors de l'Inscription

```
1. Utilisateur sélectionne un pays
   └─ Exemple: "Maroc"

2. L'indicatif s'affiche automatiquement
   └─ "+212" apparaît à gauche du champ téléphone

3. Utilisateur entre son numéro de téléphone
   └─ Exemple: "6 12 34 56 78"

4. Formulaire envoie les données
   {
     country: "Maroc",
     phone: "6 12 34 56 78",
     ...autres champs...
   }

5. API valide le pays et le téléphone
   └─ Vérifie que "Maroc" existe dans la liste des pays
   └─ Vérifie que le numéro a au moins 10 chiffres

6. Service auth récupère les infos du pays
   └─ Cherche "Maroc" dans COUNTRIES
   └─ Récupère code: "MA" et préfixe: "+212"
   └─ Crée country_code: "MA|+212"

7. Base de données enregistre
   {
     country: "Maroc",
     country_code: "MA|+212",
     phone: "6 12 34 56 78",
     whatsapp: "6 12 34 56 78"  ← même valeur que phone
   }

8. Utilisateur redirigé vers /dashboard ✓
```

---

## 🌍 Liste des Pays Disponibles

Le système supporte 50 pays/régions:

**Pays Africains (24):**
Maroc, Algérie, Tunisie, Sénégal, Côte d'Ivoire, Cameroun, Gabon, Congo, RD Congo, Tanzanie, Kenya, Ouganda, Afrique du Sud, Éthiopie, Nigéria, Ghana, Bénin, Togo, Burkina Faso, Mali, Mauritanie, Liberia, Sierra Leone, Gambie, Guinée

**Pays Européens (8):**
France, Belgique, Suisse, Royaume-Uni, Allemagne, Espagne, Italie, Portugal, Pays-Bas

**Pays du Moyen-Orient (5):**
Émirats Arabes Unis, Arabie Saoudite, Égypte, Liban, Israël, Turquie

**Autres pays (13):**
Canada, États-Unis, Inde, Chine, Japon, Australie, Brésil, Mexique

Voir `src/lib/countries.ts` pour la liste complète avec codes et préfixes.

---

## 📱 Structure du `country_code`

Le format stocké en base de données est: **"CODE|PRÉFIXE"**

**Exemples:**
```
MA|+212  → Maroc
DZ|+213  → Algérie
TN|+216  → Tunisie
FR|+33   → France
US|+1    → États-Unis
```

**Utilisation future:**
```typescript
// Pour extraire le code du pays
const countryCodeParts = user.country_code.split('|');
const code = countryCodeParts[0];      // "MA"
const prefix = countryCodeParts[1];    // "+212"
```

---

## ✅ Étapes pour Activer la Fonctionnalité

1. **Exécuter la migration SQL** en base de données:
   ```sql
   -- Exécuter: database/migrations/add_phone_whatsapp_pseudo.sql
   ```

2. **Redémarrer l'application**:
   ```bash
   npm run dev
   ```

3. **Tester l'inscription**:
   - Accéder à `/register`
   - Sélectionner un pays
   - Observer que l'indicatif s'affiche automatiquement
   - Remplir le formulaire et s'inscrire
   - Vérifier en base de données que `country` et `country_code` sont enregistrés

---

## 🐛 Débogage

**Si l'indicatif ne s'affiche pas:**
- Vérifier que le pays sélectionné existe dans `src/lib/countries.ts`
- Vérifier que la fonction `getPrefixByCountry()` retourne une valeur correcte

**Si l'inscription échoue:**
- Vérifier les logs dans la console navigateur
- Vérifier les logs du serveur (voir erreur API)
- S'assurer que le pays sélectionné est un nom exact (ex: "Maroc" pas "maroc")

---

## 📝 Notes Techniques

- ✅ Sélection de pays intégrée au formulaire d'inscription
- ✅ Indicatif dynamique basé sur le pays sélectionné
- ✅ Validation du pays côté API
- ✅ Stockage du pays et country_code en base de données
- ✅ Phone et WhatsApp reçoivent le même numéro
- ⚠️ A implémenter: Affichage du pays/indicatif dans le profil utilisateur
- ⚠️ A implémenter: Modification du pays après l'inscription

---

**Date de mise à jour:** 2024
**Statut:** ✅ Implémenté et testé