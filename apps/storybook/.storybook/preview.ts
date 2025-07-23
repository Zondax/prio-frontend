import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from '@zondax/ui-web/client'
import '@zondax/ui-web/styles/globals.css'
import React from 'react'

// Define process globally for components that might need it
if (typeof global !== 'undefined') {
  global.process = global.process || {
    env: {
      NODE_ENV: 'development',
    },
  }
}

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Disable default Storybook backgrounds since we're using theme provider
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'system', icon: 'browser', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      return React.createElement(
        ThemeProvider,
        {
          attribute: 'class',
          defaultTheme: theme,
          enableSystem: true,
          disableTransitionOnChange: true,
          forcedTheme: theme === 'system' ? undefined : theme,
        },
        React.createElement(
          'div',
          {
            className: theme === 'dark' ? 'dark' : '',
            style: {
              minHeight: '100vh',
              backgroundColor: theme === 'dark' ? 'oklch(0.145 0 0)' : 'oklch(1 0 0)',
              color: theme === 'dark' ? 'oklch(0.985 0 0)' : 'oklch(0.145 0 0)',
            },
          },
          React.createElement(Story)
        )
      )
    },
  ],
}

export default preview
