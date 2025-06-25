import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta = {
  title: 'Globals/Typography',
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates how **globals.css** configuration affects typography through the **@tailwindcss/typography** plugin, custom color variables, dark mode support, and spacing configurations.',
      },
    },
  },
}

export default meta

type Story = StoryObj

export const CustomColors: Story = {
  name: 'Custom Color Variables',
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Custom Color Variables from globals.css</h2>
        <p className="text-muted-foreground mb-4">
          These colors are defined in globals.css using CSS custom properties and adapt to light/dark themes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">Card Background</h3>
          <p className="text-muted-foreground">Using bg-card and text-card-foreground</p>
        </div>

        <div className="p-4 bg-primary text-primary-foreground rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Primary Colors</h3>
          <p>Using bg-primary and text-primary-foreground</p>
        </div>

        <div className="p-4 bg-secondary text-secondary-foreground rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Secondary Colors</h3>
          <p>Using bg-secondary and text-secondary-foreground</p>
        </div>

        <div className="p-4 bg-muted text-muted-foreground rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Muted Colors</h3>
          <p>Using bg-muted and text-muted-foreground</p>
        </div>
      </div>

      <div className="p-4 bg-destructive text-destructive-foreground rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Destructive/Error State</h3>
        <p>Using bg-destructive and text-destructive-foreground for error states</p>
      </div>
    </div>
  ),
}

export const DarkModeTypography: Story = {
  name: 'Dark Mode Typography',
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Dark Mode Typography</h2>
        <p className="text-muted-foreground mb-4">Toggle your Storybook theme to see how typography adapts using CSS custom properties.</p>
      </div>

      <div className="dark space-y-4 p-6 bg-background border border-border rounded-lg">
        <h3 className="text-xl font-semibold text-foreground">Forced Dark Mode Section</h3>
        <p className="text-foreground">
          This section is forced into dark mode using the <code className="bg-muted px-1 rounded">.dark</code> class.
        </p>
        <p className="text-muted-foreground">Notice how the muted text color changes appropriately for dark backgrounds.</p>

        <div className="prose prose-invert max-w-none">
          <h4>Typography Plugin in Dark Mode</h4>
          <p>
            The typography plugin automatically adapts to dark mode when using <code>prose-invert</code>.
          </p>
          <ul>
            <li>Links maintain proper contrast</li>
            <li>Code blocks are readable</li>
            <li>Headings have appropriate weight</li>
          </ul>
        </div>
      </div>
    </div>
  ),
}

export const CustomSpacing: Story = {
  name: 'Custom Spacing Variables',
  render: () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Custom Spacing from globals.css</h2>
        <p className="text-muted-foreground mb-4">Demonstrates custom spacing variables defined in globals.css.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">TopBar Height Variable</h3>
          <div
            className="bg-primary text-primary-foreground rounded flex items-center justify-center"
            style={{ height: 'var(--topbar-height)' }}
          >
            <span>Height: var(--topbar-height) = 3rem</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Interactive Element Size</h3>
          <div
            className="bg-secondary text-secondary-foreground rounded flex items-center justify-center"
            style={{
              width: 'var(--topbar-interactive-element-size)',
              height: 'var(--topbar-interactive-element-size)',
            }}
          >
            <span className="text-xs">24px</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">Size: var(--topbar-interactive-element-size) = 1.5rem</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Border Radius Variables</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-accent text-accent-foreground p-3 text-center" style={{ borderRadius: 'var(--radius-sm)' }}>
              <span className="text-sm">--radius-sm</span>
            </div>
            <div className="bg-accent text-accent-foreground p-3 text-center" style={{ borderRadius: 'var(--radius-md)' }}>
              <span className="text-sm">--radius-md</span>
            </div>
            <div className="bg-accent text-accent-foreground p-3 text-center" style={{ borderRadius: 'var(--radius-lg)' }}>
              <span className="text-sm">--radius-lg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const TypographyHierarchy: Story = {
  name: 'Typography Hierarchy',
  render: () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Heading 1 (4xl)</h1>
        <p className="text-muted-foreground">The largest heading using text-foreground</p>
      </div>

      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-2">Heading 2 (3xl)</h2>
        <p className="text-muted-foreground">Secondary heading level</p>
      </div>

      <div>
        <h3 className="text-2xl font-medium text-foreground mb-2">Heading 3 (2xl)</h3>
        <p className="text-muted-foreground">Tertiary heading level</p>
      </div>

      <div>
        <h4 className="text-xl font-medium text-foreground mb-2">Heading 4 (xl)</h4>
        <p className="text-muted-foreground">Fourth level heading</p>
      </div>

      <div>
        <h5 className="text-lg font-medium text-foreground mb-2">Heading 5 (lg)</h5>
        <p className="text-muted-foreground">Fifth level heading</p>
      </div>

      <div>
        <h6 className="text-base font-medium text-foreground mb-2">Heading 6 (base)</h6>
        <p className="text-muted-foreground">Smallest heading level</p>
      </div>

      <div className="space-y-4">
        <p className="text-base text-foreground">
          <strong>Body text (base):</strong> This is the standard body text size using text-foreground for optimal readability.
        </p>

        <p className="text-sm text-muted-foreground">
          <strong>Small text (sm):</strong> This is smaller text using text-muted-foreground for secondary information.
        </p>

        <p className="text-xs text-muted-foreground">
          <strong>Extra small text (xs):</strong> This is the smallest text size, often used for captions or fine print.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-2">Code and Monospace</h3>
        <p className="text-card-foreground mb-2">
          Inline code: <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">const example = 'hello'</code>
        </p>
        <pre className="bg-muted p-3 rounded text-sm font-mono overflow-x-auto">
          <code>{`function example() {
  console.log('Code block example');
  return 'Using custom background colors';
}`}</code>
        </pre>
      </div>
    </div>
  ),
}
