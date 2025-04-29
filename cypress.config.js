
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite default port
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
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
    // Ignore uncaught exceptions - this is important for our app
    uncaughtExceptionHandling: {
      skipErrorsInApplication: true
    }
  },
});
