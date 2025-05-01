
describe('Edge Cases and Error Handling', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  before(() => {
    cy.task('cleanupTestUsers');
    // Create a test user before all tests
    cy.visit('/signup');
    cy.signup(testUser.username, testUser.email, testUser.password);
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
  });

  it('should handle empty battle title submission', () => {
    // Navigate to create battle
    cy.visit('/battles');
    cy.contains('Start Battle').click();
    
    // Try to submit with empty title
    cy.get('input[id="title"]').clear();
    cy.contains('button', 'Create Battle').click();
    
    // Should show error message
    cy.contains(/Title is required|Please provide a battle title/).should('be.visible');
  });

  it('should handle non-existent battle ID', () => {
    // Visit a non-existent battle
    cy.visit('/battles/non-existent-id');
    
    // Should show error message
    cy.contains(/Battle not found|No battle exists with this ID/).should('be.visible');
    cy.get('button').contains('Back to Battles').should('be.visible');
  });

  it('should handle server errors gracefully', () => {
    // Force a server error by making the server return a 500
    // This requires intercept to stub the response
    cy.intercept('GET', '**/battles*', {
      statusCode: 500,
      body: { error: "Server Error" }
    }).as('battleError');
    
    // Visit battles page
    cy.visit('/battles');
    
    // Wait for error response
    cy.wait('@battleError');
    
    // Should show error message and retry button
    cy.contains(/Failed to load|Error loading battles/).should('be.visible');
    cy.get('button').contains(/Retry|Try Again/).should('be.visible');
  });

  it('should handle offline mode', () => {
    // Go offline
    cy.intercept('**/*', {forceNetworkError: true}).as('networkError');
    
    // Try to visit battles
    cy.visit('/battles');
    
    // Should show offline message
    cy.contains(/You appear to be offline|No connection/).should('be.visible');
  });
});
