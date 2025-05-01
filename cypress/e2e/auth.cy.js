
describe('Authentication Flow', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };

  before(() => {
    cy.task('cleanupTestUsers');
  });

  beforeEach(() => {
    // Clear cookies and localStorage between tests
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should allow a user to sign up', () => {
    cy.visit('/signup');
    
    // Verify we're on the signup page
    cy.contains('Create an account').should('be.visible');
    
    // Fill in the signup form
    cy.get('input[id="username"]').type(testUser.username);
    cy.get('input[id="signup-email"]').type(testUser.email);
    cy.get('input[id="signup-password"]').type(testUser.password);
    
    // Submit the form
    cy.get('button').contains('Sign Up').click();
    
    // Verify the AccountCreatedDialog success message
    cy.contains("You're Almost There!").should('be.visible');
  });

  it('should allow a user to log in', () => {
    cy.visit('/signup');
    
    // Switch to login tab
    cy.contains('Login').click();
    
    // Fill in login form
    cy.get('input[id="email"]').type(testUser.email);
    cy.get('input[id="password"]').type(testUser.password);
    
    // Submit the form
    cy.get('button').contains('Sign In').click();
    
    // Verify redirect to battles page after login
    cy.url().should('include', '/battles');
    
    // Verify user is logged in - check for components that only appear for logged-in users
    cy.get('button.menu-button').should('be.visible');
  });

  it('should allow a user to log out', () => {
    // First login
    cy.login(testUser.email, testUser.password);
    
    // Verify we're logged in and on the battles page
    cy.url().should('include', '/battles');
    
    // Open the menu and click logout
    cy.get('button.menu-button').click();
    cy.contains('Sign Out').click();
    
    // Verify redirect to home page after logout
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Verify logged out state - check for "Get Started" button
    cy.contains('Get Started').should('be.visible');
  });
});
