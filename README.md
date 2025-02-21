# Projet groupe : Formulaire inscription, connexion et liste des utilisateurs

## Membres : 
- Hugo MAYONOBE
- Gabriel BOIG

## Installer le projet en local

1. Cloner le projet sur votre machine
2. Démarrer et build le projet avec Docker :
```bash
docker-compose up --build
```
3. Accéder à l'application sur votre navigateur à l'adresse suivante : http://localhost:4200
4. Accéder à l'API sur votre navigateur à l'adresse suivante : http://localhost:3000
5. Pour arrêter le projet, utiliser la commande suivante :
```bash
docker-compose down
```
6. Connexion admin par défaut :
- **Email** : admin@example.com
- **Mot de passe** : adminpassword

## Fonctionnalités
- Formulaire d'inscription
- Formulaire de connexion
- Liste des utilisateurs inscrits
- Suppression d'un utilisateur (Admin seulement)

## Technologies utilisées
- Angular
- Node.js
- Express.js
- MongoDB
- Docker

## Architecture du projet
- **frontend** : Application Angular
- **backend** : API Node.js
- **docker-compose.yml** : Fichier de configuration Docker

## Routes API
- **GET** /api/users : Récupérer la liste des utilisateurs
- **POST** /api/users : Créer un utilisateur
- **POST** /api/login : Connexion d'un utilisateur
- **DELETE** /api/users/:id : Supprimer un utilisateur

## Utilisation de l'application
1. **Accéder** à l'application sur votre navigateur à l'adresse suivante : https://hugomyb.github.io/inscription-projet-group/#/login
2. **Créer** un compte utilisateur :
- Sur la page d'accueil, cliquer sur "Créer un compte" en bas de la page.
- Enrichir les champs requis et cliquer sur "S'inscrire".
- Retourner sur la page d'accueil accompagné d'un toast de succès.
3. **Se connecter** à l'application :
- Sur la page d'accueil, enrichir les champs "Email" et "Mot de passe" et cliquer sur "Se connecter".
4. **Gérer** la liste des utilisateurs inscrits :
- Se connecter en tant qu'admin avec les identifiants **loise.fenoll@ynov.com** - mdp : **ANKymoUTFu4rbybmQ9Mt**
- Sur la liste des utilisateurs, cliquer sur "Supprimer" puis confirmer pour supprimer un utilisateur.