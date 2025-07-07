import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Storybook Visual Testing
 *
 * This configuration sets up local visual regression testing
 * without requiring external services like Chromatic.
 */

export default defineConfig({
  testDir: './tests',

  // Run tests in files matching these patterns (can be overridden by CLI)
  testMatch: ['**/*.visual.spec.ts', '**/*.styles.spec.ts'],

  // Timeout for each test
  timeout: 30 * 1000,

  // Global timeout for the entire test suite
  globalTimeout: 10 * 60 * 1000,

  // Expect timeout for assertions
  expect: {
    // Screenshot comparison threshold
    threshold: 0.2,
    // Animation handling
    toHaveScreenshot: {
      // Reduce flakiness by waiting for animations
      animations: 'disabled',
      // Consistent font rendering
      caret: 'hide',
    },
  },

  // Forbid test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }], ['json', { outputFile: 'test-results/results.json' }]],

  // Global test configuration
  use: {
    // Base URL for Storybook - can be overridden with STORYBOOK_URL env var
    baseURL: process.env.STORYBOOK_URL || 'http://localhost:6006',

    // Browser context options
    viewport: { width: 1280, height: 720 },

    // Disable animations for consistent screenshots
    reducedMotion: 'reduce',

    // Screenshot options
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Trace collection
    trace: 'on-first-retry',
  },

  // Test projects for different browsers/viewports
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        // Consistent viewport for screenshots
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Auto-start Storybook in CI, reuse existing server in development
  webServer: {
    command: 'pnpm run dev',
    url: process.env.STORYBOOK_URL || 'http://localhost:6006',
    reuseExistingServer: !process.env.CI, // In CI: always start fresh, Dev: reuse if running
    timeout: 120 * 1000, // 2 minutes
  },
})
