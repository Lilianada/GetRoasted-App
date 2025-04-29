
// Custom command for login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/signup');
  cy.contains('Login').click();
  cy.get('input[id="email"]').type(email);
  cy.get('input[id="password"]').type(password);
  cy.get('button').contains('Sign In').click();
  // Wait for redirect after successful login
  cy.url().should('include', '/battles');
});

// Custom command for signup
Cypress.Commands.add('signup', (username, email, password) => {
  cy.visit('/signup');
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="signup-email"]').type(email);
  cy.get('input[id="signup-password"]').type(password);
  cy.get('button').contains('Sign Up').click();
  // After signup, user should see a confirmation dialog
  cy.contains('Account created').should('be.visible');
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.get('button.menu-button').click();
  cy.contains('Sign Out').click();
  // Verify redirect to home
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});
