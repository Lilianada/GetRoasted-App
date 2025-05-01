describe('Battle Participant Limit', () => {
  // Create three test users for this test
  const testUser1 = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  const testUser2 = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  const testUser3 = {
    username: `testuser${Math.floor(Math.random() * 10000)}`,
    email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'Password123!'
  };
  
  const battleTitle = `Test Battle ${Math.floor(Math.random() * 1000)}`;
  
  // We'll use a programmatic approach to create users instead of the UI
  // This is more reliable and faster for testing purposes
  beforeEach(() => {
    // Clear cookies and localStorage between tests
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Mock user creation and authentication for testing purposes
    // In a real scenario, we would use the API to create users
    cy.window().then((win) => {
      win.localStorage.setItem('testUser1', JSON.stringify(testUser1));
      win.localStorage.setItem('testUser2', JSON.stringify(testUser2));
      win.localStorage.setItem('testUser3', JSON.stringify(testUser3));
    });
  });
  
  it('should limit battles to 2 participants and make additional users spectators', () => {
    // For testing purposes, we'll use a more direct approach
    // First, let's visit the battle page directly
    cy.visit('/battles');
    
    // Mock the battle data and participant data
    cy.window().then((win) => {
      // Mock a battle with 2 participants
      const mockBattle = {
        id: 'test-battle-id',
        title: battleTitle,
        status: 'active',
        created_at: new Date().toISOString(),
        round_count: 3,
        time_per_turn: 60,
        allow_spectators: true
      };
      
      // Mock participants data (2 participants)
      const mockParticipants = [
        {
          id: 'participant1',
          user_id: 'user1',
          battle_id: 'test-battle-id',
          profiles: {
            username: testUser1.username,
            avatar_url: null
          }
        },
        {
          id: 'participant2',
          user_id: 'user2',
          battle_id: 'test-battle-id',
          profiles: {
            username: testUser2.username,
            avatar_url: null
          }
        }
      ];
      
      // Store mock data in localStorage for our test
      win.localStorage.setItem('mockBattle', JSON.stringify(mockBattle));
      win.localStorage.setItem('mockParticipants', JSON.stringify(mockParticipants));
      
      // Set current user as user3 (the spectator)
      win.localStorage.setItem('currentUser', JSON.stringify({
        id: 'user3',
        username: testUser3.username,
        email: testUser3.email
      }));
    });
    
    // Now visit the battle page with our mocked data
    cy.visit('/battles/test-battle-id');
    
    // Test that the UI correctly shows the user as a spectator
    // The exact text might vary based on your implementation
    cy.contains(/spectator|watching/i, { timeout: 10000 }).should('be.visible');
    
    // Verify the roast input is disabled for spectators
    cy.get('textarea').should('be.disabled');
    
    // Verify the "Send Roast" button is not visible for spectators
    cy.get('button').contains(/Send Roast/i).should('not.exist');
  });
  
  it('should allow explicitly joining as a spectator', () => {
    // For testing purposes, we'll use a more direct approach
    // First, let's visit the join battle page directly
    cy.visit('/battles/join/test-battle-id');
    
    // Mock the battle data
    cy.window().then((win) => {
      // Mock a battle with 2 participants
      const mockBattle = {
        id: 'test-battle-id',
        title: battleTitle,
        status: 'waiting',
        created_at: new Date().toISOString(),
        round_count: 3,
        time_per_turn: 60,
        allow_spectators: true,
        created_by: 'user1'
      };
      
      // Mock creator profile
      const mockCreator = {
        id: 'user1',
        username: testUser1.username,
        avatar_url: null
      };
      
      // Store mock data in localStorage for our test
      win.localStorage.setItem('mockBattle', JSON.stringify(mockBattle));
      win.localStorage.setItem('mockCreator', JSON.stringify(mockCreator));
      
      // Set current user as user3 (the spectator)
      win.localStorage.setItem('currentUser', JSON.stringify({
        id: 'user3',
        username: testUser3.username,
        email: testUser3.email
      }));
    });
    
    // Reload the page to apply our mocked data
    cy.reload();
    
    // Explicitly join as spectator
    cy.contains('Join as Spectator').click();
    
    // Now we should be redirected to the battle page
    cy.url().should('include', '/battles/test-battle-id');
    
    // Verify the user is a spectator
    cy.contains(/spectator|watching/i, { timeout: 10000 }).should('be.visible');
    
    // Verify the roast input is disabled for spectators
    cy.get('textarea').should('be.disabled');
    
    // Verify the "Send Roast" button is not visible for spectators
    cy.get('button').contains(/Send Roast/i).should('not.exist');
  });
});
