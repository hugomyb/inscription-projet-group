describe('Home page spec', () => {
  it('deployed angular app to localhost', () => {
    cy.visit('http://localhost:4200')
  })
})

describe('Admin Login Test', () => {
  it('should successfully log in as an admin', () => {
    // Visite la page de connexion
    cy.visit('http://localhost:4200/login'); // Modifie avec l'URL de ta page de connexion

    // Remplit le formulaire de connexion
    cy.get('[type="email"]').type('admin@example.com'); // Sélecteur pour l'email
    cy.get('[type="password"]').type('adminpassword');    // Sélecteur pour le mot de passe

    // Soumet le formulaire
    cy.get('button[type="button"]').click(); // Bouton de connexion

    // Vérifie que la connexion est réussie
    cy.url().should('include', '/app/users'); // Redirection vers la page dashboard
    cy.contains('Liste des utilisateurs'); // Vérifie un texte de bienvenue pour l'admin

    cy.contains('admin@example.com'); // Vérifie que l'email de l'admin est affiché
  });
});

describe('Admin Login Failure Test', () => {
  it('should display an alert when login credentials are incorrect', () => {
    // Intercepter l'alerte
    cy.on('window:alert', (alertText) => {
      // Vérifie le texte affiché dans l'alerte
      expect(alertText).to.equal('Email ou mot de passe incorrect.');
    });
    // Visite la page de connexion
    cy.visit('http://localhost:4200/login'); // Modifie l'URL selon ton application

    // Remplit le formulaire avec des identifiants incorrects
    cy.get('[type="email"]').type('wrong@example.com'); // Email incorrect
    cy.get('[type="password"]').type('wrongpassword');  // Mot de passe incorrect

    // Soumet le formulaire
    cy.get('button[type="button"]').click();

    // Optionnel : Vérifie que l'URL ne change pas
    cy.url().should('include', '/login');
  });
});

describe('User Registration Test', () => {
  it('should register a new user successfully', () => {
    // Visite la page de connexion
    cy.visit('http://localhost:4200/login'); // Modifie l'URL selon ton application

    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Remplit le formulaire d'inscription
    cy.get('#nom').type('Doe'); // Nom
    cy.get('#prenom').type('John'); // Prénom
    cy.get('#email').type('newuser@example.com'); // Email
    cy.get('#password').type('newpassword'); // Mot de passe
    cy.get('#dateNaissance').type('1990-01-01'); // Date de naissance (format YYYY-MM-DD)
    cy.get('#ville').type('Paris'); // Ville
    cy.get('#codePostal').type('75000'); // Code Postal

    // Soumet le formulaire
    cy.get('button[type="submit"]').click(); // Bouton d'inscription

    // Vérifie que l'inscription est réussie
    cy.url().should('include', '/login'); // Redirection vers la page de bienvenue
    cy.contains('Inscription réussie !'); // Message d'erreur
  });

  it('should display an error when the email is already registered', () => {
    // Visite la page de connexion
    cy.visit('http://localhost:4200/login'); // Modifie l'URL selon ton application

    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Remplit le formulaire d'inscription avec un email déjà utilisé
    cy.get('#nom').type('Doe'); // Nom
    cy.get('#prenom').type('Jane'); // Prénom
    cy.get('#email').type('newuser@example.com'); // Email déjà utilisé
    cy.get('#password').type('password'); // Mot de passe
    cy.get('#dateNaissance').type('1990-01-01'); // Date de naissance (format YYYY-MM-DD)
    cy.get('#ville').type('Paris'); // Ville
    cy.get('#codePostal').type('75000'); // Code Postal

    // Soumet le formulaire
    cy.get('button[type="submit"]').click(); // Bouton d'inscription

    // Vérifie qu'un message d'erreur est affiché
    cy.contains("Une erreur est survenue lors de l'inscription"); // Message d'erreur
  });
});

describe('Form Validation - Required Fields After Interaction', () => {
  it('should display error messages when fields are touched but left empty', () => {
    // Visite la page du formulaire
    cy.visit('http://localhost:4200/login'); // Modifie avec l'URL réelle du formulaire
    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Interagit avec chaque champ pour déclencher la validation
    cy.get('#nom').click().blur();
    cy.contains('Le nom est requis.').should('be.visible'); // Vérifie le message pour Nom

    cy.get('#prenom').click().blur();
    cy.contains('Le prénom est requis.').should('be.visible'); // Vérifie le message pour Prénom

    cy.get('#email').click().blur();
    cy.contains("L'email est requis.").should('be.visible'); // Vérifie le message pour Email

    cy.get('#password').click().blur();
    cy.contains('Le mot de passe est requis.').should('be.visible'); // Vérifie le message pour Mot de passe

    cy.get('#dateNaissance').click().blur();
    cy.contains('La date de naissance est requise.').should('be.visible'); // Vérifie pour Date de naissance

    cy.get('#ville').click().blur();
    cy.contains('La ville est requise.').should('be.visible'); // Vérifie pour Ville

    cy.get('#codePostal').click().blur();
    cy.contains('Le code postal est requis.').should('be.visible'); // Vérifie pour Code Postal

    // Vérifie que le bouton reste désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });
});

describe('Form Validation - Specific Field Validations', () => {
  it('should display error messages for postal code and birth date', () => {
    // Visite la page du formulaire
    cy.visit('http://localhost:4200/login'); // Modifie avec l'URL réelle du formulaire
    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    cy.get('#email').type('mail').blur();; // Remplit le champ mail
    cy.contains('Le format de l\'email est invalide.').should('be.visible'); // Message d'erreur pour l'adresse email

    // Remplit le champ Date de naissance avec une date qui rend l'utilisateur mineur
    cy.get('#dateNaissance').type('2010-01-01').blur();
    // Vérifie qu'un message d'erreur est affiché
    cy.contains('Vous devez avoir au moins 18 ans.').should('be.visible'); // Message d'erreur pour Date de naissance

    // Remplit le champ Code Postal avec une valeur incorrecte
    cy.get('#codePostal').type('123').blur();
    // Vérifie qu'un message d'erreur est affiché
    cy.contains('Le code postal doit être un nombre à 5 chiffres.').should('be.visible'); // Message d'erreur pour Code Postal
  });
});