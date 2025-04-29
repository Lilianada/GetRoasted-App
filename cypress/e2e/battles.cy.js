
describe('Battles Feature', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  let battleTitle = `Test Battle ${Math.floor(Math.random() * 1000)}`;
  
  before(() => {
    // Create a test user before all tests
    cy.visit('/signup');
    cy.signup(testUser.username, testUser.email, testUser.password);
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
    cy.visit('/battles');
  });

  it('should allow user to create a new battle', () => {
    // Navigate to the new battle page
    cy.contains('Start Battle').click();
    cy.url().should('include', '/battles/new');
    
    // Fill in battle creation form
    cy.get('input[id="title"]').type(battleTitle);
    
    // Select battle type (public by default)
    cy.get('#public').check();
    
    // Set rounds
    cy.contains('3 Rounds').click();
    
    // Set time per turn
    cy.contains('60 seconds').click();
    
    // Allow spectators
    cy.get('input[id="allowSpectators"]').check();
    
    // Create battle
    cy.contains('button', 'Create Battle').click();
    
    // Verify battle was created
    cy.contains(battleTitle).should('be.visible');
  });

  it('should display battle details and allow participation', () => {
    // Find and click on the battle we created
    cy.contains(battleTitle).click();
    
    // Verify battle title is displayed
    cy.contains(battleTitle).should('be.visible');
    
    // Verify battle components are visible
    cy.get('div').contains(/You are (battling|watching)/).should('be.visible');
    cy.get('textarea').should('exist');
  });

  it('should allow sending chat messages in a battle', () => {
    // Find and click on the battle we created
    cy.contains(battleTitle).click();
    
    // Type and send a message
    const testMessage = 'This is a test message';
    cy.get('textarea').type(testMessage);
    cy.get('button').contains(/Send|Post/).click();
    
    // Verify message appears in the chat
    cy.contains(testMessage).should('be.visible');
  });
});
