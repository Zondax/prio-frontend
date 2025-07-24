import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@zondax/ui-web/client'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Button component using **globals.css** custom color variables and Tailwind CSS. If buttons appear unstyled, check that globals.css is properly loaded and Tailwind is processing the classes.',
      },
    },
  },
  args: {
    children: 'Click me',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  name: 'Default (Primary)',
  args: {
    variant: 'default',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
  },
}

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Button Variants</h3>
        <p className="text-muted-foreground mb-4">All button variants using custom color variables from globals.css</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="default">Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div>
        <h4 className="text-md font-medium text-foreground mb-2">Disabled State</h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="default" disabled>
            Default Disabled
          </Button>
          <Button variant="secondary" disabled>
            Secondary Disabled
          </Button>
          <Button variant="destructive" disabled>
            Destructive Disabled
          </Button>
          <Button variant="outline" disabled>
            Outline Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
}

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Button Sizes</h3>
        <p className="text-muted-foreground mb-4">Different button sizes with consistent styling</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🔍</Button>
      </div>

      <div>
        <h4 className="text-md font-medium text-foreground mb-2">Secondary Variant Sizes</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" size="sm">
            Small
          </Button>
          <Button variant="secondary" size="default">
            Default
          </Button>
          <Button variant="secondary" size="lg">
            Large
          </Button>
          <Button variant="secondary" size="icon">
            ⚙️
          </Button>
        </div>
      </div>
    </div>
  ),
}

export const ColorVariables: Story = {
  name: 'Color Variables Debug',
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Button Color Variables</h3>
        <p className="text-muted-foreground mb-4">Debug view showing how buttons use globals.css color variables</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Primary Colors</h4>
          <div className="space-y-2">
            <Button variant="default" className="w-full">
              bg-primary + text-primary-foreground
            </Button>
            <div className="text-xs text-muted-foreground">Should use: --color-primary and --color-primary-foreground</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Secondary Colors</h4>
          <div className="space-y-2">
            <Button variant="secondary" className="w-full">
              bg-secondary + text-secondary-foreground
            </Button>
            <div className="text-xs text-muted-foreground">Should use: --color-secondary and --color-secondary-foreground</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Destructive Colors</h4>
          <div className="space-y-2">
            <Button variant="destructive" className="w-full">
              bg-destructive + text-white
            </Button>
            <div className="text-xs text-muted-foreground">Should use: --color-destructive</div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-foreground">Outline Colors</h4>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              bg-background + border
            </Button>
            <div className="text-xs text-muted-foreground">Should use: --color-background, --color-border</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="text-md font-medium text-card-foreground mb-2">Troubleshooting</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• If buttons appear unstyled, check that globals.css is loaded</li>
          <li>• Verify Tailwind CSS is processing the button classes</li>
          <li>• Check that custom color variables are defined in :root</li>
          <li>• Ensure shadow-xs utility is available or defined</li>
        </ul>
      </div>
    </div>
  ),
}

export const DarkModeButtons: Story = {
  name: 'Dark Mode Buttons',
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Dark Mode Button Behavior</h3>
        <p className="text-muted-foreground mb-4">Toggle Storybook theme to see how buttons adapt to dark mode</p>
      </div>

      <div className="dark space-y-4 p-6 bg-background border border-border rounded-lg">
        <h4 className="text-md font-medium text-foreground mb-2">Forced Dark Mode</h4>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p className="text-muted-foreground text-sm">These buttons should automatically use dark mode color variables</p>
      </div>
    </div>
  ),
}
