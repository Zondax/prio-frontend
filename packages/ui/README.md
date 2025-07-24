# @zondax/ui-web

Shared React UI components and utilities for Zondax applications.

## Features

- 🎨 **Reusable Components** - Pre-built UI components following design system
- 🎯 **TypeScript First** - Full TypeScript support with strict typing
- 🌟 **Tailwind CSS** - Styled with Tailwind CSS for consistency
- 🧪 **Well Tested** - Comprehensive test coverage with Vitest
- 📦 **Tree Shakeable** - Import only what you need
- ♿ **Accessible** - Built with accessibility in mind

## Installation

This package is internal to the Zondax monorepo and uses workspace dependencies:

```json
{
  "dependencies": {
    "@zondax/ui-web": "workspace:*"
  }
}
```

## Usage

### Components

```tsx
import { Button, Card, Input } from "@zondax/ui-web";

export default function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter text..." />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Hooks

```tsx
import { useLocalStorage, useDebounce } from "@zondax/ui-web/hooks";

export default function MyComponent() {
  const [value, setValue] = useLocalStorage("myKey", "");
  const debouncedValue = useDebounce(value, 300);

  // ... rest of component
}
```

### Utilities

```tsx
import { cn, formatDate } from "@zondax/ui-web/utils";

export default function MyComponent() {
  return (
    <div className={cn("base-class", { "conditional-class": true })}>
      {formatDate(new Date())}
    </div>
  );
}
```

## Package Structure

```
src/
├── components/          # React components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Container, Grid, etc.)
│   ├── feedback/       # Feedback components (Alert, Toast, etc.)
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── cn.ts           # Class name utility
│   ├── format.ts       # Formatting utilities
│   └── index.ts
├── types/              # TypeScript type definitions
│   ├── components.ts
│   └── index.ts
└── index.ts            # Main exports
```

## Development

### Running Tests

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Dependencies

```bash
# Update dependencies
pnpm deps:update
```

## Design Principles

- **Consistency**: Components follow a consistent API and styling approach
- **Flexibility**: Components are composable and customizable
- **Performance**: Optimized for bundle size and runtime performance
- **Accessibility**: All components follow WCAG guidelines
- **Developer Experience**: Clear APIs with excellent TypeScript support

## License

UNLICENSED
