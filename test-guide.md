
# End-to-End Testing Guide with Cypress

This guide explains how to set up and run end-to-end tests for the GetRoasted application using Cypress, focusing on the authentication flow (signup, login, and logout).

## Table of Contents
- [Setup](#setup)
- [Test Structure](#test-structure)
- [Authentication Flow Tests](#authentication-flow-tests)
- [Running Tests](#running-tests)
- [Best Practices](#best-practices)

## Setup

### 1. Installation

First, install Cypress as a dev dependency:

```bash
npm install cypress --save-dev
# or
yarn add cypress --dev
```

### 2. Open Cypress

To open the Cypress test runner:

```bash
npx cypress open
# or
yarn cypress open
```

The first time you run this, Cypress will create a `cypress` folder with example tests and configuration.

### 3. Configure Cypress

Update the `cypress.config.js` file:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default port
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

### 4. Create Support Files

Create or modify `cypress/support/e2e.js`:

```javascript
// Import commands.js using ES2015 syntax:
import './commands';

// Hide fetch/XHR requests in the Cypress command log
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}
```

Create or modify `cypress/support/commands.js` to add custom commands for authentication:

```javascript
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
```

## Test Structure

Create test files in the `cypress/e2e` directory. For authentication flow, create `auth.cy.js`:

## Authentication Flow Tests

Create a test file at `cypress/e2e/auth.cy.js`:

```javascript
describe('Authentication Flow', () => {
  const testUser = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };

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
    
    // Verify the success message
    cy.contains('Account created').should('be.visible');
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
```

## Running Tests

### Headless Mode

To run tests in headless mode (CI/CD pipelines):

```bash
npx cypress run
# or
yarn cypress run
```

### Interactive Mode

To open the Cypress Test Runner:

```bash
npx cypress open
# or
yarn cypress open
```

Then select "E2E Testing" and choose your browser to run the tests.

## Best Practices

1. **Test Data Management**:
   - Use random values for usernames and emails to avoid conflicts
   - Consider using `cy.fixture()` to load test data
   - Set up database cleaning before/after tests when needed

2. **Authentication Strategies**:
   - For tests that require authentication but don't test the login flow, use `cy.login()` custom command
   - Consider using programmatic login (API calls) for better performance
   - Preserve cookies/localStorage between tests that share authentication when appropriate

3. **Test Isolation**:
   - Each test should be independent and not rely on the state from previous tests
   - Clean up any created data after tests

4. **Handling Asynchronous Operations**:
   - Use `cy.wait()` for network requests: `cy.wait('@loginRequest')`
   - Set up route aliases: `cy.intercept('POST', '/api/auth/login').as('loginRequest')`

5. **CI/CD Integration**:
   - Add a Cypress job to your CI/CD pipeline
   - Configure the recording of test runs for debugging failed tests

## Extended Testing Scenarios

After implementing the basic authentication flow tests, consider testing these additional scenarios:

1. **Form Validation**:
   - Test error messages for invalid inputs
   - Test password requirements
   - Test duplicate email handling

2. **Password Recovery**:
   - Test the forgotten password flow
   - Verify email sending (using test email services or intercepts)

3. **Social Authentication**:
   - Test Google authentication flow (may require stubbing)

4. **Protected Routes**:
   - Verify unauthenticated users are redirected to login
   - Verify authenticated users can access protected pages

Remember to adapt these tests based on your specific application requirements and structure.
