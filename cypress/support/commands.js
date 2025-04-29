
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

// Custom command to create a new battle
Cypress.Commands.add('createBattle', (title, battleType = 'public', rounds = 3, timePerTurn = 60) => {
  cy.visit('/battles/new');
  cy.get('input[id="title"]').type(title);
  
  // Select battle type
  cy.get(`#${battleType}`).check();
  
  // Set rounds
  cy.contains(`${rounds} Rounds`).click();
  
  // Set time per turn
  cy.contains(`${timePerTurn} seconds`).click();
  
  // Create battle
  cy.contains('button', 'Create Battle').click();
  
  // Verify battle was created
  cy.contains(title).should('be.visible');
});

// Custom command to check notifications
Cypress.Commands.add('checkNotifications', () => {
  // Look for the notification bell and click it
  cy.get('button').contains('notification', { matchCase: false }).click();
  
  // Verify notifications panel is open
  cy.contains(/Notifications|Recent Activity/).should('be.visible');
  
  // Close notifications
  cy.get('body').type('{esc}');
});

// Custom command to update profile information
Cypress.Commands.add('updateProfile', (displayName, bio) => {
  cy.visit('/profile');
  cy.contains('Edit Profile').click();
  
  // Update fields
  cy.get('input[id="displayName"]').clear().type(displayName);
  cy.get('textarea[id="bio"]').clear().type(bio);
  
  // Save changes
  cy.contains('button', 'Save').click();
  
  // Verify success message
  cy.contains(/Profile updated|Changes saved/).should('be.visible');
});
