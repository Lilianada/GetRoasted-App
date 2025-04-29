
describe('Leaderboard Feature', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  before(() => {
    // Create a test user before all tests
    cy.visit('/signup');
    cy.signup(testUser.username, testUser.email, testUser.password);
  });

  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
  });

  it('should display the leaderboard', () => {
    // Navigate to leaderboard page
    cy.get('button.menu-button').click();
    cy.contains('Leaderboard').click();
    
    // Verify leaderboard page elements
    cy.url().should('include', '/leaderboard');
    cy.contains(/Top Roasters|Leaderboard/).should('be.visible');
    
    // Check for leaderboard table/list
    cy.get('table, ul').should('exist');
  });

  it('should allow filtering leaderboard data', () => {
    // Navigate to leaderboard page
    cy.get('button.menu-button').click();
    cy.contains('Leaderboard').click();
    
    // Check if filter options exist (e.g., by time period)
    cy.get('select, button').contains(/All Time|Week|Month/).click();
    
    // Verify that data is filtered
    cy.contains(/Showing results for|Filtered by/).should('be.visible');
  });
});
