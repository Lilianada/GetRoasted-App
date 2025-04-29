
describe('Battle Complete Workflow', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  const testUser2 = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  const battleTitle = `Test Battle ${Math.floor(Math.random() * 1000)}`;
  
  before(() => {
    // Create test users before all tests
    cy.visit('/signup');
    cy.signup(testUser.username, testUser.email, testUser.password);
    
    // Create second test user (in a real scenario, this would be done in a separate browser)
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/signup');
    cy.signup(testUser2.username, testUser2.email, testUser2.password);
  });

  it('should complete a full battle workflow - creation to voting', () => {
    // Login first user
    cy.login(testUser.email, testUser.password);
    
    // Create a battle
    cy.visit('/battles');
    cy.contains('Start Battle').click();
    cy.url().should('include', '/battles/new');
    
    // Fill battle form
    cy.get('input[id="title"]').type(battleTitle);
    cy.get('#public').check();
    cy.contains('3 Rounds').click();
    cy.contains('60 seconds').click();
    cy.get('input[id="allowSpectators"]').check();
    cy.contains('button', 'Create Battle').click();
    
    // Verify battle was created
    cy.contains(battleTitle).should('be.visible');
    cy.url().should('include', '/battles/waiting');
    
    // Share the battle link (simulating second user joining)
    cy.url().then(url => {
      // Store battle URL for second user
      Cypress.env('battleUrl', url);
      
      // Now simulate spectator joining in real scenarios
      // For testing purposes, we'll log out and login as second user
      cy.logout();
      cy.login(testUser2.email, testUser2.password);
      
      // Join battle as second user
      cy.visit(Cypress.env('battleUrl'));
      
      // Verify second user sees battle join screen
      cy.contains(battleTitle).should('be.visible');
      cy.contains('Join Battle').click();
      
      // Verify user joined as participant
      cy.contains(/You are (battling|watching)/).should('be.visible');
      
      // Simulate battle interaction
      cy.get('textarea').type('This is a test roast message');
      cy.get('button').contains(/Send|Post/).click();
      
      // Verify message appears
      cy.contains('This is a test roast message').should('be.visible');
      
      // Simulate a vote when the battle ends (would normally be triggered by timer)
      // For test purposes, we'll assume battle ended
      cy.get('button').contains(/Vote|Like/).first().click();
      
      // Verify vote was registered
      cy.contains(/Thank you for voting|Vote recorded/).should('be.visible');
    });
  });
});
