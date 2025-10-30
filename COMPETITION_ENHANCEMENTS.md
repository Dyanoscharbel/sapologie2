# 🏆 Améliorations du Système de Compétitions

## 📋 Résumé des changements

Amélioration du système de création de compétitions pour inclure :
- 📸 Bannière pour la compétition (image Base64)
- 👥 Sélection du genre (Mixte, Masculin, Féminin)
- 🎁 Jusqu'à 5 prix (au lieu de 3) avec images individuelles

---

## 🗄️ Modifications de la Base de Données

### Nouvelle migration : `add_competition_features.sql`

**Colonnes ajoutées à `competitions` :**
- `banner_image` (LONGTEXT, NULL) - Image Base64 de la bannière
- `gender` (VARCHAR(50), DEFAULT 'Mixte') - Type de compétition

**Colonnes ajoutées à `prizes` :**
- `image` (LONGTEXT, NULL) - Image Base64 du prix

### Exécution de la migration :
```sql
-- Copier le contenu de database/migrations/add_competition_features.sql
-- Et l'exécuter dans votre base de données MySQL
```

---

## 🎨 Frontend - Page de Création

### Fichier : `src/app/admin/competitions/new/page.tsx`

#### Nouvelles fonctionnalités :

1. **Sélecteur de Genre**
   - Select dropdown avec 3 options : Mixte, Masculin, Féminin
   - Défaut : Mixte

2. **Upload de Bannière**
   - Drag-and-drop zone
   - Conversion automatique en Base64
   - Aperçu de l'image avant soumission
   - Bouton pour supprimer la bannière

3. **Gestion des Prix Améliorée**
   - De 2 à 5 prix possibles
   - Pour chaque prix :
     - Champ description (string)
     - Upload d'image individuelle (Base64)
     - Affichage d'émojis (🥇 🥈 🥉 🏅)
   - Bouton "Ajouter un prix" (max 5)
   - Bouton "Supprimer ce prix" (min 1)
   - Compteur "X/5 prix"

#### État du composant :
```typescript
interface Prize {
  id: string;
  name: string;
  image: string | null;
}

// États ajoutés
const [gender, setGender] = useState("Mixte");
const [bannerImage, setBannerImage] = useState<string | null>(null);
const [bannerPreview, setBannerPreview] = useState<string | null>(null);
const [prizes, setPrizes] = useState<Prize[]>([...]);
```

#### Méthodes ajoutées :
- `handleBannerUpload()` - Conversion image → Base64
- `handlePrizeImageUpload()` - Conversion image prix → Base64
- `addPrize()` - Ajouter un prix (max 5)
- `removePrize()` - Supprimer un prix
- `updatePrizeName()` - Modifier le nom du prix

---

## 🔌 Backend - APIs

### Route : `src/app/api/admin/competitions/route.ts`

#### Changements GET :
- Ajout des champs `gender` et `banner_image` dans la sélection
- Retour du genre dans la réponse (défaut 'Mixte')
- Retour de la bannière dans la réponse

#### Changements POST :
- Accepte maintenant : `name`, `description`, `start_date`, `end_date`, `gender`, `banner_image`, `is_active`, `prizes`
- Crée la compétition avec les nouveaux champs
- Insère les prix associés dans la table `prizes`

**Payload attendu :**
```json
{
  "name": "Concours Miss 2025",
  "description": "Description...",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "gender": "Féminin",
  "banner_image": "data:image/jpeg;base64,...",
  "is_active": true,
  "prizes": [
    {
      "name": "500€ + Couronne",
      "image": "data:image/jpeg;base64,...",
      "position": 1
    },
    {
      "name": "300€",
      "image": null,
      "position": 2
    }
  ]
}
```

### Route : `src/app/api/competitions/route.ts` (PUBLIC)

#### Changements GET :
- Sélectionne maintenant les champs `image` des prix
- Ajoute le champ `gender` à chaque compétition
- Défaut `gender = 'Mixte'` si non défini

#### Données retournées :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "...",
      "gender": "Féminin",
      "banner_image": "data:image/jpeg;base64,...",
      "prizes": [
        {
          "id": 1,
          "name": "500€ + Couronne",
          "position": 1,
          "image": "data:image/jpeg;base64,..."
        }
      ]
    }
  ]
}
```

---

## 🎯 Frontend - Pages Publiques

### Fichier : `src/app/competitions/page.tsx`

#### Interface mise à jour :
```typescript
interface Competition {
  gender?: string;
  banner_image?: string;
  prizes: Array<{
    image?: string;
    // ... autres champs
  }>;
}
```

#### Affichage amélioré :

1. **Bannière de la compétition**
   - Affichée en haut de chaque carte
   - Image de 192px de haut
   - Effet zoom au survol
   - Gradient sombre au-dessus pour lisibilité

2. **Badge de Genre**
   - Affiché à côté du badge de statut
   - Visible seulement si genre ≠ 'Mixte'
   - Émojis : 👩 pour Féminin, 👨 pour Masculin
   - Style violet discret

3. **Affichage des Prix**
   - Images des prix affichées si présentes
   - Taille : 40x40px
   - Arrondi et ombre légère
   - Fond blanc semi-transparent pour lisibilité

---

## 📝 Structure de la Base de Données

### Table `competitions` (modifiée)
```sql
CREATE TABLE competitions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200),
  description TEXT,
  start_date DATETIME,
  end_date DATETIME,
  gender VARCHAR(50) DEFAULT 'Mixte',           -- NOUVEAU
  banner_image LONGTEXT,                        -- NOUVEAU
  prize_first VARCHAR(255),
  prize_second VARCHAR(255),
  prize_third VARCHAR(255),
  is_active TINYINT(1),
  max_votes_per_user INT,
  created_by INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Table `prizes` (modifiée)
```sql
CREATE TABLE prizes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  competition_id INT,
  name VARCHAR(255),
  description TEXT,
  position INT,
  value INT,
  sponsor VARCHAR(255),
  image LONGTEXT,                               -- NOUVEAU
  FOREIGN KEY (competition_id) REFERENCES competitions(id)
);
```

---

## ✅ Checklist d'implémentation

- [x] Migration BD créée
- [x] Formulaire de création amélioré
- [x] API admin POST mise à jour
- [x] API admin GET mise à jour
- [x] API publique GET mise à jour
- [x] Page de liste améliorée
- [x] Affichage bannière et genre
- [x] Affichage images des prix

### À faire (optionnel) :
- [ ] Page de détail compétition : afficher bannière en grand
- [ ] Page de détail compétition : afficher tous les prix avec images
- [ ] Édition de compétition : mettre à jour avec les nouveaux champs
- [ ] Admin panel : afficher miniatures bannières et genres
- [ ] Filtrage par genre sur page publique
- [ ] Export des données avec images

---

## 🎨 Styles CSS appliqués

### Bannière
- Hauteur : `h-48` (192px)
- Objet-fit : `object-cover`
- Zoom au survol : `group-hover:scale-105`
- Gradient : `from-black/40 to-transparent`

### Badge Genre
- Couleur : `bg-purple-100 text-purple-900`
- Variante : secondary
- Toujours à côté du badge de statut

### Images Prix
- Taille : `w-10 h-10` (40x40px)
- Arrondi : `rounded-md`
- Fond blanc semi-transparent pour contraste

---

## 🔒 Sécurité

- ✅ Validation côté serveur (OAuth2)
- ✅ Images en Base64 directement en BD (pas de fichier externe)
- ✅ Vérification des droits admin pour création
- ✅ Limite à 5 prix maximum côté front ET back
- ✅ Validation des dates (fin > début)

---

## 📚 Notes supplémentaires

### Stockage des images
- **Format** : Base64 intégré dans LONGTEXT
- **Limite** : ~4MB par image (limite MySQL)
- **Avantage** : Pas de gestion de fichiers externe
- **Inconvénient** : Légèrement plus lourd en BD

### Compatibilité
- ✅ Mobile-friendly (responsive)
- ✅ Pas de dépendance externe pour upload
- ✅ Compatible avec tous les navigateurs modernes

---

## 🚀 Utilisation

### Créer une compétition avec tout les éléments :

1. **Admin panel** → Aller à `/admin/competitions/new`
2. **Remplir les infos** :
   - Titre
   - Description
   - Genre (Féminin, Masculin ou Mixte)
   - Bannière (upload image)
3. **Ajouter les prix** :
   - Jusqu'à 5 prix
   - Chaque prix : nom + image (optionnelle)
4. **Définir les dates** et activer la compétition
5. **Créer** !

### Voir sur page publique :
- Accéder à `/competitions`
- Voir bannière, genre et prix avec images

---

## 🔄 Migration depuis l'ancien système

Si vous aviez déjà des compétitions sans bannière/genre/images prix :
- Les anciens prix restent intacts
- Champ `gender` par défaut à 'Mixte'
- Champ `banner_image` null (pas d'affichage)
- Champ `image` null pour prix existants

Aucune donnée n'est perdue. C'est 100% rétro-compatible. ✅

---

## 📞 Support

Pour toute question sur l'implémentation :
- Vérifier que la migration SQL a été exécutée
- Tester l'API avec Postman
- Vérifier les logs navigateur (F12)
- Vérifier les logs serveur
