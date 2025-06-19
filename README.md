# Test Technique - API et Interface Équipements

## Objectif

Développer une application de gestion d'équipements comprenant une API et une interface utilisateur, permettant de créer, lire, modifier et supprimer des équipements.

## Spécifications fonctionnelles

L'application doit permettre de gérer un inventaire d'équipements.

Un équipement est défini par :

- Un identifiant unique
- Une précision sur le nom de l'équipement
- Un type d'équipement (ex: ascenseur électrique, chaudière gaz murale, etc.)
- Une marque (ex: Schindler, Thyssenkrupp, etc.)
- Un modèle (ex: KONE, Thyssenkrupp, etc.)
- Une date de création
- Une date de modification

Un type d'équipement est défini par :

- Un identifiant unique
- Un nom
- Un parent (null pour les domaines)

Un type d'équipement organisé en maximum 4 niveaux hiérarchiques.

Exemples de type d'équipement :

- LEVAGE ET MANUTENTION ( domaine )

  - Ascenseur ( type )
    - Ascenseur Électrique ( catégorie )
      - Ascenseur électrique à traction ( sous-catégorie )

- CHAUFFAGE ( domaine )

  - Chaudière ( type )
    - Chaudière gaz ( catégorie )
      - Chaudière gaz murale ( sous-catégorie )

- SÉCURITÉ ( domaine )
  - Détection incendie ( type )
    - Détecteur de fumée ( catégorie )
      - Détecteur optique de fumée ( sous-catégorie )
    - Centrale d'alarme ( catégorie )
      - Centrale d'alarme incendie conventionnelle ( sous-catégorie )

### API - Fonctionnalités CRUD

#### Mutations

- **Créer un équipement** : Validation des données
- **Modifier un équipement** : Mise à jour partielle ou complète des champs
- **Supprimer un équipement** : Suppression logique ou physique

### Interface utilisateur

- **Lister les équipements** :
  - Tableau d'équipements avec les colonnes : nom, domaine, type, catégorie, sous-catégorie, marque, modèle
  - Filtrage par domaine, type, catégorie ou sous-catégorie
  - Recherche par marque/modèle
- **Formulaire de création/édition** :
  - Sélection hiérarchique du type d'équipement (dropdowns en cascade)
  - Champs marque et modèle (texte libre)
  - Validation des données

## Consignes techniques

- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **Architecture** : Libre
- **Frameworks**: Libre
- **ORM**: Libre
- **Containerisation**: Libre
- **Librairies**: Libre
- **Style**: Libre
- **Tests**: Libre
- **Documentation**: Libre
- **Conventions**: Libre

Lors du briefing, nous discuterons des choix techniques et des motivations de ces choix.

### Recommandations

- Gestion d'erreurs appropriée
- Validation des données
- Code structuré et maintenable
- Tests unitaires et/ou intégration appréciés

## Bonus

### Gestion de l'offline

- Fonctionnement de l'interface en mode déconnecté
- Synchronisation des données lors de la reconnexion

### Gestion de gros volumes (100 000+ équipements)

- **Performance Base de donnée et API**
- **Performance Interface**

## Livrables attendus

**Code source** : Repository Git avec README.md

---

_Pour toute question concernant ce test technique, n'hésitez pas à nous contacter._
