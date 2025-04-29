
# End-to-End Testing Guide with Cypress

This guide explains how to set up and run end-to-end tests for the GetRoasted application using Cypress, covering all major features from authentication to gameplay.

## Table of Contents
- [Setup](#setup)
- [Test Structure](#test-structure)
- [Authentication Flow Tests](#authentication-flow-tests)
- [Battles Feature Tests](#battles-feature-tests)
- [Profile and Settings Tests](#profile-and-settings-tests)
- [Leaderboard Tests](#leaderboard-tests)
- [Navigation Tests](#navigation-tests)
- [Running Tests](#running-tests)
- [Custom Commands](#custom-commands)
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
    baseUrl: 'http://localhost:8080', // Vite default port
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

## Test Structure

Our tests are organized into several files based on feature areas:

1. **auth.cy.js** - Tests for signup, login, and logout
2. **battles.cy.js** - Tests for creating and participating in battles
3. **profile-settings.cy.js** - Tests for user profile and settings
4. **leaderboard.cy.js** - Tests for leaderboard functionality
5. **navigation.cy.js** - Tests for general navigation and static pages

## Authentication Flow Tests

The authentication flow tests cover:

1. User signup with a unique username, email, and password
2. User login with credentials
3. User logout

Key assertions:
- Successful signup shows confirmation message
- After login, user is redirected to battles page
- After logout, user is redirected to home page

Example:
```javascript
it('should allow a user to sign up', () => {
  cy.visit('/signup');
  cy.get('input[id="username"]').type(testUser.username);
  cy.get('input[id="signup-email"]').type(testUser.email);
  cy.get('input[id="signup-password"]').type(testUser.password);
  cy.get('button').contains('Sign Up').click();
  cy.contains('Account created').should('be.visible');
});
```

## Battles Feature Tests

The battles feature tests cover:

1. Creating a new battle with specific settings
2. Viewing battle details
3. Participating in battles by sending messages

Key assertions:
- Battle is created with correct title and settings
- Battle page shows correct components
- Messages sent appear in the battle chat

Example:
```javascript
it('should allow user to create a new battle', () => {
  cy.contains('Start Battle').click();
  cy.get('input[id="title"]').type(battleTitle);
  cy.get('#public').check();
  cy.contains('3 Rounds').click();
  cy.contains('Create Battle').click();
  cy.contains(battleTitle).should('be.visible');
});
```

## Profile and Settings Tests

The profile and settings tests cover:

1. Viewing profile information
2. Changing notification settings
3. Changing appearance settings
4. Updating password

Key assertions:
- Profile page shows correct username
- Settings can be toggled and saved
- Password can be changed successfully

Example:
```javascript
it('should allow changing notification settings', () => {
  cy.get('button.menu-button').click();
  cy.contains('Settings').click();
  cy.get('input[name="email_notifications"]').click();
  cy.contains('button', 'Save Changes').click();
  cy.contains('Settings saved').should('be.visible');
});
```

## Leaderboard Tests

The leaderboard tests cover:

1. Viewing the leaderboard
2. Filtering leaderboard data

Key assertions:
- Leaderboard page displays correctly
- Filter options work as expected

Example:
```javascript
it('should display the leaderboard', () => {
  cy.get('button.menu-button').click();
  cy.contains('Leaderboard').click();
  cy.contains(/Top Roasters|Leaderboard/).should('be.visible');
  cy.get('table, ul').should('exist');
});
```

## Navigation Tests

The navigation tests cover:

1. Basic navigation to static pages
2. Protected route redirection
3. Navigation through authenticated areas

Key assertions:
- Static pages load correctly
- Unauthenticated users are redirected from protected routes
- Authenticated users can navigate between sections

Example:
```javascript
it('should redirect unauthorized users from protected pages', () => {
  cy.visit('/battles');
  cy.url().should('include', '/signup');
});
```

## Custom Commands

We've created several custom Cypress commands to simplify testing:

1. `cy.login(email, password)` - Logs in a user
2. `cy.signup(username, email, password)` - Signs up a new user
3. `cy.logout()` - Logs out the current user
4. `cy.createBattle(title, type, rounds, time)` - Creates a new battle
5. `cy.checkNotifications()` - Checks user notifications
6. `cy.updateProfile(name, bio)` - Updates profile information

Example usage:
```javascript
beforeEach(() => {
  cy.login('user@example.com', 'password123');
});

it('should create a battle', () => {
  cy.createBattle('Test Battle', 'public', 3, 60);
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

6. **Visual Testing**:
   - Consider adding visual regression testing with `cy.screenshot()`
   - Compare screenshots to detect unintended UI changes

7. **Performance Testing**:
   - Measure page load times using Cypress performance metrics
   - Set performance thresholds for critical user flows

8. **Mobile Testing**:
   - Use Cypress viewport command to test responsive design
   - Example: `cy.viewport('iphone-x')` to simulate mobile device

9. **Advanced Scenarios Testing**:
   - Test edge cases like network failures using `cy.intercept()` with artificial delays
   - Test accessibility using additional plugins like cypress-axe
