describe('Home page spec', () => {
  it('deployed angular app to localhost', () => {
    cy.visit('http://localhost:4200')
  })
})

describe('Admin Login Test', () => {
  it('should successfully log in as an admin', () => {
    // Mock la réponse de l'API de connexion
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { message: 'Login successful', token: 'mocked-token' },
    }).as('login');

    // Visite la page de connexion
    cy.visit('http://localhost:4200/login');

    // Remplit le formulaire de connexion
    cy.get('[type="email"]').type('admin@example.com');
    cy.get('[type="password"]').type('adminpassword');

    // Soumet le formulaire
    cy.get('button[type="button"]').click();

    // Vérifie que la requête a bien été interceptée
    cy.wait('@login');

    // Vérifie la redirection
    cy.url().should('include', '/app/users');
    cy.contains('Liste des utilisateurs');
    cy.contains('admin@example.com');
  });
});

describe('Admin Login Failure Test', () => {
  it('should display an alert when login credentials are incorrect', () => {
    // Mock la réponse d'échec de l'API de connexion
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' },
    }).as('failedLogin');

    // Visite la page de connexion
    cy.visit('http://localhost:4200/login');

    // Remplit le formulaire avec des identifiants incorrects
    cy.get('[type="email"]').type('wrong@example.com');
    cy.get('[type="password"]').type('wrongpassword');

    // Soumet le formulaire
    cy.get('button[type="button"]').click();

    // Vérifie que la requête a bien été interceptée
    cy.wait('@failedLogin');

    // Vérifie que l'alerte s'affiche
    cy.contains('Email ou mot de passe incorrect.');
  });
});


describe('User Registration Test', () => {
  it('should register a new user successfully', () => {
    // Mock l'API d'inscription
    cy.intercept('POST', '/api/register', {
      statusCode: 201,
      body: { message: 'User registered successfully' },
    }).as('register');

    // Visite la page de connexion
    cy.visit('http://localhost:4200/login');

    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Remplit le formulaire d'inscription
    cy.get('#nom').type('Doe');
    cy.get('#prenom').type('John');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('newpassword');
    cy.get('#dateNaissance').type('1990-01-01');
    cy.get('#ville').type('Paris');
    cy.get('#codePostal').type('75000');

    // Soumet le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifie que la requête a bien été interceptée
    cy.wait('@register');

    // Vérifie la redirection
    cy.url().should('include', '/login');
    cy.contains('Inscription réussie !');
  });

  it('should display an error when the email is already registered', () => {
    // Mock l'API pour simuler une erreur d'email déjà utilisé
    cy.intercept('POST', '/api/register', {
      statusCode: 400,
      body: { error: 'Email already registered' },
    }).as('failedRegister');

    // Visite la page de connexion
    cy.visit('http://localhost:4200/login');

    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Remplit le formulaire avec un email déjà utilisé
    cy.get('#nom').type('Doe');
    cy.get('#prenom').type('Jane');
    cy.get('#email').type('newuser@example.com');
    cy.get('#password').type('password');
    cy.get('#dateNaissance').type('1990-01-01');
    cy.get('#ville').type('Paris');
    cy.get('#codePostal').type('75000');

    // Soumet le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifie que la requête a bien été interceptée
    cy.wait('@failedRegister');

    // Vérifie le message d'erreur
    cy.contains("Une erreur est survenue lors de l'inscription");
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