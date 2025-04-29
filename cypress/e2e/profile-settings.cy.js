
describe('Profile and Settings Features', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!',
    newPassword: 'NewPassword456!'
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

  it('should display user profile information', () => {
    // Navigate to profile page
    cy.get('button.menu-button').click();
    cy.contains('Profile').click();
    
    // Verify profile page elements
    cy.url().should('include', '/profile');
    cy.contains(testUser.username).should('be.visible');
    
    // Check for profile components
    cy.contains('Achievements').should('exist');
    cy.contains('Recent Activity').should('exist');
  });

  it('should allow changing notification settings', () => {
    // Navigate to settings page
    cy.get('button.menu-button').click();
    cy.contains('Settings').click();
    
    // Verify on settings page
    cy.url().should('include', '/settings');
    
    // Go to notification settings
    cy.contains('Notification Settings').should('be.visible');
    
    // Toggle email notifications
    cy.get('input[name="email_notifications"]')
      .as('emailNotifToggle')
      .then($toggle => {
        const wasChecked = $toggle.prop('checked');
        cy.get('@emailNotifToggle').click();
        cy.get('@emailNotifToggle').should('have.prop', 'checked', !wasChecked);
      });
    
    // Save settings
    cy.contains('button', 'Save Changes').click();
    
    // Verify success message
    cy.contains('Settings saved').should('be.visible');
  });

  it('should allow changing appearance settings', () => {
    // Navigate to settings page
    cy.get('button.menu-button').click();
    cy.contains('Settings').click();
    
    // Find appearance settings section
    cy.contains('Appearance Settings').should('be.visible');
    
    // Toggle theme option if available
    cy.get('button').contains(/Dark|Light/).click();
    
    // Save settings if there's a save button
    cy.contains('button', 'Save Changes').click();
    
    // Verify success message
    cy.contains('Settings saved').should('be.visible');
  });

  it('should allow changing password', () => {
    // Navigate to settings page
    cy.get('button.menu-button').click();
    cy.contains('Settings').click();
    
    // Find change password form
    cy.contains('Change Password').should('be.visible');
    
    // Fill in change password form
    cy.get('input[id="currentPassword"]').type(testUser.password);
    cy.get('input[id="newPassword"]').type(testUser.newPassword);
    cy.get('input[id="confirmPassword"]').type(testUser.newPassword);
    
    // Submit form
    cy.contains('button', 'Update Password').click();
    
    // Verify success message
    cy.contains('Password updated').should('be.visible');
    
    // Update test user password for future tests
    testUser.password = testUser.newPassword;
  });
});
