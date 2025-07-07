import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Fast Style Tests
 *
 * Optimized for speed - no screenshots, no videos, no traces
 */

export default defineConfig({
  testDir: './tests',

  // Run only style tests
  testMatch: ['**/*.styles.spec.ts'],

  // Shorter timeout for style tests
  timeout: 10 * 1000,

  // Global timeout for the entire test suite
  globalTimeout: 2 * 60 * 1000,

  // Faster expect timeout
  expect: {
    timeout: 5 * 1000,
  },

  // Forbid test.only in CI
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Auto-detect CPU cores for optimal parallelization
  workers: process.env.CI ? '50%' : '100%',

  // Enable full parallelization
  fullyParallel: true,

  // Reporter configuration - minimal for speed, no HTML report
  reporter: [['list']],

  // Global test configuration - optimized for speed
  use: {
    // Base URL for Storybook
    baseURL: process.env.STORYBOOK_URL || 'http://localhost:6006',

    // Browser context options
    viewport: { width: 1280, height: 720 },

    // Disable animations for consistency
    reducedMotion: 'reduce',

    // NO screenshots for style tests
    screenshot: 'off',

    // NO video recording for style tests
    video: 'off',

    // NO trace collection for style tests
    trace: 'off',
  },

  // Test projects for different browsers/viewports
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
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
