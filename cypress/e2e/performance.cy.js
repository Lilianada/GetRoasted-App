
describe('Performance Testing', () => {
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

  it('should load the battles page quickly', () => {
    // Start timer
    const start = performance.now();
    
    // Visit battles page
    cy.visit('/battles');
    
    // Check battles loaded
    cy.contains('Start Battle').should('be.visible').then(() => {
      const end = performance.now();
      const loadTime = end - start;
      
      // Log page load time
      cy.log(`Battles page loaded in ${loadTime}ms`);
      
      // Assert page loaded in acceptable time (e.g., < 3 seconds)
      expect(loadTime).to.be.lessThan(3000);
    });
  });

  it('should load profile data quickly', () => {
    // Intercept API calls to measure response time
    cy.intercept('GET', '**/profiles**').as('profileData');
    
    // Visit profile
    cy.visit('/profile');
    
    // Wait for profile API call and check its duration
    cy.wait('@profileData').its('response.headers').then((headers) => {
      const responseTimeHeader = headers['x-response-time'];
      if (responseTimeHeader) {
        const responseTime = parseInt(responseTimeHeader, 10);
        cy.log(`Profile data loaded in ${responseTime}ms`);
        
        // Assert API response within acceptable time
        expect(responseTime).to.be.lessThan(1000);
      }
    });
    
    // Make sure profile data loaded
    cy.contains(testUser.username).should('be.visible');
  });

  it('should render leaderboard efficiently', () => {
    // Start timer
    const start = performance.now();
    
    // Visit leaderboard
    cy.visit('/leaderboard');
    
    // Check leaderboard rendered
    cy.get('table, ul').should('be.visible').then(() => {
      const end = performance.now();
      const renderTime = end - start;
      
      cy.log(`Leaderboard rendered in ${renderTime}ms`);
      
      // Assert render time is acceptable
      expect(renderTime).to.be.lessThan(2000);
    });
  });
});
