import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Visual Regression Tests
 *
 * Optimized for visual regression testing with proper screenshot handling
 */

export default defineConfig({
  testDir: './tests',

  // Run only visual tests
  testMatch: ['**/*.visual.spec.ts'],

  // Timeout for visual tests
  timeout: 30 * 1000,

  // Global timeout for the entire test suite
  globalTimeout: 10 * 60 * 1000,

  // Expect timeout for visual comparisons
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

  // Auto-detect CPU cores for optimal parallelization
  workers: process.env.CI ? '50%' : '100%',

  // Enable full parallelization
  fullyParallel: true,

  // Reporter configuration
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }], ['json', { outputFile: 'test-results/visual-results.json' }]],

  // Global test configuration for visual tests
  use: {
    // Base URL for Storybook
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
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
