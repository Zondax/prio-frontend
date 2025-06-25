import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  env: (config) => ({
    ...config,
    NODE_ENV: 'development',
  }),
  viteFinal: async (config) => {
    config.define = {
      ...config.define,
      global: 'globalThis',
      'process.env': {},
    }

    // Configure optimizeDeps to exclude problematic dependencies
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [
        ...(config.optimizeDeps?.exclude || []),
        // Add common problematic dependencies
        '@storybook/blocks',
        '@storybook/components',
        '@storybook/core-events',
        '@storybook/manager-api',
        '@storybook/preview-api',
        '@storybook/theming',
        // Add any other dependencies that cause chunk issues
        'react-dom/client',
        'react-dom/server',
      ],
      include: [...(config.optimizeDeps?.include || []), 'react', 'react-dom'],
    }

    return config
  },
}
export default config
