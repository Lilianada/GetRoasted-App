const { defineConfig } = require('cypress');
const { execSync } = require('child_process');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8082', // Current Vite server port
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      on('task', {
        async cleanupTestUsers(prefix = 'testuser') {
          try {
            execSync(`node ./cypress/support/cleanup.cjs ${prefix}`, { stdio: 'inherit' });
            return null;
          } catch (err) {
            console.error('Cleanup failed:', err);
            throw err;
          }
        }
      });

      // Add performance monitoring
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-software-rasterizer');
        }
        return launchOptions;
      });
      
      // Add reporting capability
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Could integrate with test reporting service here
          console.log(`Test video saved: ${results.video}`);
        }
      });
    },
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    // Add retry capability for flaky tests
    retries: {
      runMode: 2,
      openMode: 0
    },

  },
});
