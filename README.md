# Test Technique Taster

## Description

Bienvenue dans ce test technique ! L'application permet de gérer une liste paginée d'utilisateurs avec une fonctionnalité de recherche.

## Fonctionnalités développées

- Affichage d'une liste paginée d'utilisateurs avec défilement infini (20 utilisateurs par page).
- Colonnes affichant les informations des utilisateurs : photo, nom complet, email, liste de loisirs et date de dernière mise à jour.
- Création et mise à jour des utilisateurs.
- Recherche d'utilisateurs par nom complet.
- Mise à jour optimiste des informations utilisateur. (sans le hook spécifique)

## Problèmes Connus

- Problème avec l'API lors de la création ou de l'édition de l'utilisateur si une image est envoyée. L'API renvoie une erreur 500.

## Stack Technologique

- **Frontend** :
  - [ShadCN](https://github.com/shadcn)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Radix UI](https://www.radix-ui.com/)
  - [React ≥ 18](https://reactjs.org/)
- **Tests** :
  - [Cypress](https://www.cypress.io/) pour les tests end-to-end.

## Installation et Utilisation

1. Cloner le dépôt :
   ```sh
   git clone https://github.com/DjilanMouhous/test-taster
   cd test-taster
   ```
2. Installer les dépendances :
   ```sh
   npm install
   ```
3. Créer un fichier `.env` à la racine du projet et ajouter la variable d'environnement suivante :
   ```sh
   REACT_APP_API_KEY=XXXX
   REACT_APP_API_BASE_URL=XXXX (with / at the end)
   ```
4. Lancer l'application :
   ```sh
   npm start
   ```
5. Ouvrir l'application dans un navigateur à l'adresse [http://localhost:3000](http://localhost:3000).

6. Pour lancer les tests avec Cypress :
   ```sh
   npm run test
   ```
