// Home Page Test
describe('Home page spec', () => {
  it('deployed angular app to localhost', () => {
    cy.visit('http://localhost:4200');
  });
});

// Admin Login Test
describe('Admin Login Test', () => {
  beforeEach(() => {
    // Mock la réponse pour les requêtes API
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { message: 'Login successful', token: 'mocked-token' },
    }).as('login');

    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [{ email: 'admin@example.com', name: 'Admin' }],
    }).as('getUsers');
  });

  it('should successfully log in as an admin', () => {
    cy.visit('http://localhost:4200/login');

    // Remplit le formulaire de connexion
    cy.get('[type="email"]').type('admin@example.com');
    cy.get('[type="password"]').type('adminpassword');

    // Soumet le formulaire
    cy.get('button[type="button"]').click();

    // Vérifie que la requête login a été interceptée
    cy.wait('@login');

    // Vérifie la redirection et le contenu
    cy.url().should('include', '/app/users');
    cy.contains('Liste des utilisateurs');
    cy.contains('admin@example.com');
  });
});

// Admin Login Failure Test
describe('Admin Login Failure Test', () => {
  it('should display an alert when login credentials are incorrect', () => {
    // Capture et vérifie le contenu de l'alerte
    cy.on('window:alert', (alertText) => {
      // Vérifie que le texte de l'alerte est correct
      expect(alertText).to.equal('Email ou mot de passe incorrect.');
    });

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

    // Vérifie que la requête a été interceptée
    cy.wait('@failedLogin');
  });
});

// User Registration Test
describe('User Registration Test', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/users', (req) => {
      if (req.body.email === 'newuser@example.com') {
        req.reply({
          statusCode: 201,
          body: { message: 'User registered successfully' },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: { error: 'Email already registered' },
        });
      }
    }).as('register');
  });

  it('should register a new user successfully', () => {
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

    // Vérifie la redirection et le message
    cy.url().should('include', '/login');
    cy.contains('Inscription réussie !');
  });

  it('should display an error when the email is already registered', () => {
    cy.visit('http://localhost:4200/login');

    // Clique sur le bouton d'inscription
    cy.get('a[routerlink="/register"]').click();

    // Remplit le formulaire avec un email déjà utilisé
    cy.get('#nom').type('Doe');
    cy.get('#prenom').type('Jane');
    cy.get('#email').type('newuser@example.com'); // Email déjà utilisé
    cy.get('#password').type('password');
    cy.get('#dateNaissance').type('1990-01-01');
    cy.get('#ville').type('Paris');
    cy.get('#codePostal').type('75000');

    // Soumet le formulaire
    cy.get('button[type="submit"]').click();

    // Vérifie que la requête a bien été interceptée
    cy.wait('@register');

    // Vérifie le message d'erreur
    cy.contains("Une erreur est survenue lors de l'inscription", { timeout: 5000 }).should('be.visible');
  });
});

// Form Validation - Required Fields
describe('Form Validation - Required Fields After Interaction', () => {
  it('should display error messages when fields are touched but left empty', () => {
    cy.visit('http://localhost:4200/login');
    cy.get('a[routerlink="/register"]').click();

    // Interagit avec chaque champ
    cy.get('#nom').click().blur();
    cy.contains('Le nom est requis.', { timeout: 5000 }).should('be.visible');

    cy.get('#prenom').click().blur();
    cy.contains('Le prénom est requis.', { timeout: 5000 }).should('be.visible');

    cy.get('#email').click().blur();
    cy.contains("L'email est requis.", { timeout: 5000 }).should('be.visible');

    cy.get('#password').click().blur();
    cy.contains('Le mot de passe est requis.', { timeout: 5000 }).should('be.visible');

    cy.get('#dateNaissance').click().blur();
    cy.contains('La date de naissance est requise.', { timeout: 5000 }).should('be.visible');

    cy.get('#ville').click().blur();
    cy.contains('La ville est requise.', { timeout: 5000 }).should('be.visible');

    cy.get('#codePostal').click().blur();
    cy.contains('Le code postal est requis.', { timeout: 5000 }).should('be.visible');

    // Vérifie que le bouton reste désactivé
    cy.get('button[type="submit"]').should('be.disabled');
  });
});

// Form Validation - Specific Field Validations
describe('Form Validation - Specific Field Validations', () => {
  it('should display error messages for postal code and birth date', () => {
    cy.visit('http://localhost:4200/login');
    cy.get('a[routerlink="/register"]').click();

    cy.get('#email').type('mail').blur();
    cy.contains('Le format de l\'email est invalide.', { timeout: 5000 }).should('be.visible');

    cy.get('#dateNaissance').type('2010-01-01').blur();
    cy.contains('Vous devez avoir au moins 18 ans.', { timeout: 5000 }).should('be.visible');

    cy.get('#codePostal').type('123').blur();
    cy.contains('Le code postal doit être un nombre à 5 chiffres.', { timeout: 5000 }).should('be.visible');
  });
});
