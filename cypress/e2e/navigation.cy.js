
describe('Navigation and Static Pages', () => {
  const testUser = {
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should navigate to home page', () => {
    cy.visit('/');
    cy.contains(/GetRoasted|Welcome|Roast/).should('be.visible');
    cy.contains('Get Started').should('be.visible');
  });

  it('should display rules page', () => {
    cy.visit('/rules');
    cy.contains(/Rules|How to Play/).should('be.visible');
  });

  it('should display terms of service', () => {
    cy.visit('/terms');
    cy.contains(/Terms of Service|Terms and Conditions/).should('be.visible');
  });

  it('should display privacy policy', () => {
    cy.visit('/privacy');
    cy.contains(/Privacy Policy/).should('be.visible');
  });

  it('should redirect unauthorized users from protected pages', () => {
    cy.visit('/battles');
    
    // Should be redirected to login/signup
    cy.url().should('include', '/signup');
  });

  it('should allow navigation through authenticated areas after login', () => {
    // Sign up a test user if needed
    cy.visit('/signup');
    cy.contains('Login').click();
    cy.get('input[id="email"]').type(testUser.email);
    cy.get('input[id="password"]').type(testUser.password);
    cy.contains('Sign In').click();
    
    // Navigate to battles
    cy.url().should('include', '/battles');
    
    // Navigate to profile
    cy.get('button.menu-button').click();
    cy.contains('Profile').click();
    cy.url().should('include', '/profile');
    
    // Navigate to settings
    cy.get('button.menu-button').click();
    cy.contains('Settings').click();
    cy.url().should('include', '/settings');
    
    // Navigate to leaderboard
    cy.get('button.menu-button').click();
    cy.contains('Leaderboard').click();
    cy.url().should('include', '/leaderboard');
  });
});
