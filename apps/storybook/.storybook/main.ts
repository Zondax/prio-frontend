import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../libs/ui-common/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
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

    // Suppress "use client" directive warnings
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        onwarn(warning, warn) {
          // Suppress "use client" directive warnings
          if (warning.message.includes('Module level directives cause errors when bundled')) {
            return
          }
          // Suppress sourcemap warnings
          if (warning.message.includes('Error when using sourcemap for reporting an error')) {
            return
          }
          // Let other warnings through
          warn(warning)
        },
      },
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

    // Mock Next.js navigation module
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'next/navigation': new URL('./mocks/next-navigation.js', import.meta.url).pathname,
      },
    }

    return config
  },
}
export default config
