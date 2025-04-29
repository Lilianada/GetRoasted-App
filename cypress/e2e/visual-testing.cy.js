
describe('Visual Regression Testing', () => {
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

  it('should render battle creation form correctly', () => {
    // Visit battle creation
    cy.visit('/battles/new');
    
    // Take screenshot
    cy.screenshot('battle-creation-form');
    
    // Check key UI elements are visible
    cy.get('input[id="title"]').should('be.visible');
    cy.contains('Battle Type').should('be.visible');
    cy.get('#public').should('be.visible');
    cy.get('#private').should('be.visible');
    cy.contains('button', 'Create Battle').should('be.visible');
  });

  it('should render leaderboard correctly', () => {
    // Visit leaderboard
    cy.visit('/leaderboard');
    
    // Take screenshot
    cy.screenshot('leaderboard-view');
    
    // Check leaderboard elements
    cy.contains(/Top Roasters|Leaderboard/).should('be.visible');
    cy.get('table, ul').should('exist');
  });

  it('should render profile correctly', () => {
    // Visit profile
    cy.visit('/profile');
    
    // Take screenshot
    cy.screenshot('profile-view');
    
    // Check profile elements
    cy.contains(testUser.username).should('be.visible');
    cy.contains('Edit Profile').should('be.visible');
  });

  it('should test responsive layouts', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.visit('/battles');
    cy.screenshot('battles-mobile');
    
    // Test tablet view
    cy.viewport('ipad-2');
    cy.visit('/battles');
    cy.screenshot('battles-tablet');
    
    // Test desktop view
    cy.viewport(1920, 1080);
    cy.visit('/battles');
    cy.screenshot('battles-desktop');
  });
});
