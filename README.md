# Projet Angular : Test Inscription Form

![Build Status](https://github.com/hugomyb/test-inscription-form/actions/workflows/build_test_deploy_angular.yml/badge.svg)
[![Coverage Status](https://codecov.io/gh/hugomyb/test-inscription-form/branch/main/graph/badge.svg)](https://codecov.io/gh/hugomyb/test-inscription-form)

Ce projet est une application Angular avec un formulaire d'inscription, construite avec plusieurs outils et fonctionnalités pour le développement, les tests et la documentation.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :
- [Node.js](https://nodejs.org/) (version 20.x recommandée)
- [Angular CLI](https://angular.io/cli)

## Installation

Clonez le dépôt, puis installez les dépendances du projet avec la commande suivante :

```bash
npm install
```

## Scripts disponibles

Voici une liste des commandes disponibles dans ce projet :

### Démarrage du serveur de développement

```bash
npm start
```

Cette commande démarre le serveur de développement Angular. L'application sera accessible à l'adresse `http://localhost:4200/`.

### Construction de l'application

```bash
npm run build
```

Construit le projet Angular pour la production. Les fichiers générés seront placés dans le répertoire `dist/`. L'option `--base-href=/test-inscription-form/` est utilisée pour configurer le chemin de base pour le déploiement.

### Tests unitaires

```bash
npm test
```

Lance les tests unitaires avec [Jest](https://jestjs.io/).

### Couverture des tests

```bash
npm run test:coverage
```

Exécute les tests unitaires et génère un rapport de couverture pour vous permettre de voir quelle partie de votre code est testée.

### Génération de la documentation

```bash
npm run doc
```

Génère la documentation du projet à l'aide de [Typedoc](https://typedoc.org/). La documentation est produite dans le répertoire `docs`.

## Déploiement GitHub Pages

Ce projet est configuré pour être déployé sur GitHub Pages.
L'application principale est déployée à la racine (`/`) et la documentation est déployée dans le sous-dossier `/docs`.

## Déploiement Backend

Le backend du projet est déployé sur Vercel via le workflow, et la bdd est également hebergée sur vercel.

## Routes de l'application

- `/` : Page d'accueil de l'application.
- `/docs` : Documentation générée par Typedoc.

## Structure du Projet

back
front :
- `src/` : Contient le code source de l'application Angular.
- `dist/` : Contient les fichiers construits de l'application après le build.
- `docs/` : Contient la documentation générée par Typedoc.

## NPMJS

Le front du projet est déployé automatiquement sur [npmjs.com](https://www.npmjs.com/package/cours-1-1?activeTab=readme) au moment du workflow à chaque push.
Lors du workflow la version est automatiquement incrémentée sur npmjs et dans le package.json du front via un script js à la racine du dossier front (increment-version.js).
