# ADR-007: Testing Standards and Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: QA Team, Frontend Team  

## Problem Statement

As we scale our frontend applications across multiple repositories and complex features, we need comprehensive testing standards that ensure:

1. **Code Quality**: Prevent regressions and maintain reliable functionality
2. **Performance**: Ensure applications perform well under various conditions
3. **User Experience**: Validate UI behavior and accessibility
4. **Consistency**: Standardized testing approaches across all applications
5. **Developer Productivity**: Fast feedback loops and clear testing patterns
6. **CI/CD Integration**: Reliable automated testing in deployment pipelines
7. **Coverage Visibility**: Understanding what code is tested and what needs attention

The decision point: How do we establish testing standards that provide comprehensive coverage while maintaining developer velocity and code quality?

## Decision

**Vitest-First Testing Architecture**: Comprehensive testing strategy using Vitest as the primary testing framework with native assertions, Storybook for visual testing, and specific patterns for different testing scenarios.

### Core Testing Stack
- **Vitest**: Primary testing framework for all unit, integration, and component tests
- **Native Vitest assertions**: Migrated from jest-dom for better compatibility and performance
- **@testing-library/react**: Component testing utilities and best practices
- **Storybook**: Visual testing, component documentation, and alternative coverage
- **Playwright**: End-to-end testing for critical user flows
- **Custom test utilities**: Zondax-specific testing helpers and patterns

### Testing Categories
```typescript
// Unit Tests: Functions, utilities, hooks
describe('formatCurrency', () => {
  expect(formatCurrency(1000)).toBe('$1,000.00')
})

// Component Tests: React component behavior  
describe('ChatMessage', () => {
  expect(screen.getByText('Hello')).toBeTruthy()
})

// Integration Tests: Feature workflows
describe('Chat Flow', () => {
  // Multi-component interactions
})

// Store Tests: State management
describe('useMessagesStore', () => {
  // gRPC integration, optimistic updates
})
```

## Alternatives Considered

### Option A: Jest + Testing Library
**Pros**: Mature ecosystem, extensive community support, familiar patterns
**Cons**: Slower than Vitest, ESM issues, complex configuration for monorepos
**Verdict**: Rejected - migration to Vitest provides better performance and developer experience

### Option B: Cypress for Component Testing
**Pros**: Real browser environment, excellent debugging, visual testing
**Cons**: Slower test execution, complex setup, resource intensive
**Verdict**: Rejected - Vitest + Testing Library provides better unit/integration testing

### Option C: Playwright Component Testing
**Pros**: Fast, multi-browser support, modern tooling
**Cons**: Newer ecosystem, limited component testing patterns
**Verdict**: Rejected - keep Playwright for E2E, use Vitest for components

### Option D: No Testing Standards
**Pros**: Maximum flexibility, no constraints on teams
**Cons**: Inconsistent quality, difficult maintenance, unreliable deployments
**Verdict**: Rejected - standards are essential for quality and consistency

## Rationale

### Why Vitest + Native Assertions?

**Performance Benefits**:
- **Fast execution**: 2-3x faster than Jest for our test suites
- **Native ESM**: No transpilation overhead for modern JavaScript
- **Watch mode**: Instant feedback during development
- **Parallel execution**: Efficient multi-threading for large test suites

**Developer Experience**:
- **Native assertions**: Simpler, more reliable than jest-dom
- **TypeScript integration**: Excellent type checking and intellisense
- **Hot reload**: Tests update instantly during development
- **Clear error messages**: Better debugging experience

**Migration Benefits**:
```typescript
// Old (jest-dom) - Complex, sometimes unreliable
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('text')
expect(element).toBeDisabled()

// New (native Vitest) - Simple, always reliable
expect(element).toBeTruthy()
expect(element?.textContent).toBe('text')
expect(element?.disabled).toBe(true)
```

### Why Storybook for Alternative Coverage?

**Visual Testing**: Components tested in isolation with all variants
**Documentation**: Living documentation for design system
**Manual Testing**: QA and designers can validate components
**Regression Prevention**: Visual changes are immediately visible

## Consequences

### Positive
- **Faster Development**: Quick test feedback accelerates development cycles
- **Higher Quality**: Comprehensive testing prevents regressions
- **Better Documentation**: Storybook provides visual component documentation
- **Team Consistency**: Standardized patterns across all applications
- **CI/CD Reliability**: Stable test suite supports reliable deployments
- **Debugging**: Clear testing patterns make issues easier to diagnose

### Negative
- **Initial Learning**: Team needs to learn Vitest patterns and native assertions
- **Migration Effort**: Converting existing Jest tests requires time investment
- **Test Maintenance**: Comprehensive testing requires ongoing maintenance

### Risks
- **Over-Testing**: Risk of testing implementation details rather than behavior
- **Test Brittleness**: Poorly written tests could slow down development
- **Coverage Pressure**: Focus on coverage numbers rather than test quality

## Implementation Standards

### 1. Vitest Configuration

**Root Configuration**:
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false, // Explicit imports for better tree-shaking
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'e2e/', '.next/']
    },
    timeout: 10000,
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } } // CI stability
  }
})
```

**Global Setup**:
```typescript
// vitest.setup.ts
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global mocks for browser APIs
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))
```

### 2. Native Vitest Assertion Patterns

**Element Existence**:
```typescript
// ✅ Correct - Native assertion
expect(screen.getByRole('button')).toBeTruthy()

// ❌ Avoid - jest-dom dependency
expect(screen.getByRole('button')).toBeInTheDocument()
```

**Text Content**:
```typescript
// ✅ Correct - Direct property access
expect(element?.textContent).toBe('Expected text')
expect(element?.textContent).toContain('partial text')

// ❌ Avoid - jest-dom matcher
expect(element).toHaveTextContent('Expected text')
```

**Element Properties**:
```typescript
// ✅ Correct - Native property checks
expect(button?.disabled).toBe(true)
expect(input?.value).toBe('test value')
expect(element?.className).toContain('active')

// ❌ Avoid - jest-dom matchers
expect(button).toBeDisabled()
expect(input).toHaveValue('test value')
expect(element).toHaveClass('active')
```

### 3. React Testing Patterns

**Proper act() Usage**:
```typescript
import { act } from '@testing-library/react'

// ✅ Correct - Wrap state updates
await act(async () => {
  fireEvent.click(button)
  await waitFor(() => expect(callback).toHaveBeenCalled())
})

// ✅ Correct - Hook testing
const { result } = renderHook(() => useCustomHook())
await act(async () => {
  result.current.updateState('new value')
})
```

**Async Testing**:
```typescript
// ✅ Correct - Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Loading complete')).toBeTruthy()
})

// ✅ Correct - User event simulation
await userEvent.click(button)
await waitFor(() => {
  expect(mockCallback).toHaveBeenCalledWith('expected-value')
})
```

### 4. Component Testing Standards

**Test Structure**:
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with required props', () => {
    render(<ComponentName {...requiredProps} />)
    expect(screen.getByRole('main')).toBeTruthy()
  })

  it('handles user interactions', async () => {
    const onSubmit = vi.fn()
    render(<ComponentName onSubmit={onSubmit} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(onSubmit).toHaveBeenCalledWith(expectedData)
  })

  it('manages state correctly', async () => {
    render(<ComponentName />)
    
    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { 
        target: { value: 'new value' } 
      })
    })
    
    expect(screen.getByDisplayValue('new value')).toBeTruthy()
  })
})
```

### 5. Store Testing Patterns

**gRPC Store Testing**:
```typescript
describe('useMessagesStore', () => {
  const mockClient = createMockGrpcClient()
  
  beforeEach(() => {
    vi.clearAllMocks()
    setupMockGrpcMethod(mockClient, 'getMessages', mockMessages)
  })

  it('loads messages successfully', async () => {
    const { result } = renderHook(() => useMessagesStore())
    
    await act(async () => {
      result.current.execute({ conversationId: '123' })
    })
    
    await waitFor(() => {
      expect(result.current.data).toEqual(mockMessages)
      expect(result.current.loading).toBe(false)
    })
  })

  it('handles optimistic updates', async () => {
    const { result } = renderHook(() => useOptimisticStore())
    
    await act(async () => {
      result.current.update(optimisticData)
    })
    
    // Verify immediate UI update
    expect(result.current.data).toEqual(optimisticData)
    
    // Verify server confirmation
    await waitFor(() => {
      expect(result.current.confirmed).toBe(true)
    })
  })
})
```

### 6. Storybook Integration

**Story as Test Cases**:
```typescript
// Button.stories.ts
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: { description: { component: 'Primary button component' } }
  }
}

export const Primary = {
  args: { variant: 'primary', children: 'Primary Button' }
}

export const AllVariants = {
  render: () => (
    <div className="space-y-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
}
```

**Storybook Testing**:
```bash
# Visual regression testing
pnpm storybook:test

# Accessibility testing
pnpm storybook:a11y
```

### 7. Testing Utilities

**Custom Test Helpers**:
```typescript
// test-utils.ts
export const expectToBeInDocument = (element: HTMLElement | null) => {
  expect(element).toBeTruthy()
}

export const expectTextContent = (element: HTMLElement | null, text: string) => {
  expect(element?.textContent).toBe(text)
}

export const expectHasClasses = (element: HTMLElement | null, ...classes: string[]) => {
  classes.forEach(cls => {
    expect(element?.className).toContain(cls)
  })
}

export const getByTestIdAssert = (testId: string) => {
  const element = screen.getByTestId(testId)
  expect(element).toBeTruthy()
  return element
}
```

**Mock Factories**:
```typescript
// test-factories.ts
export const createMockMessage = (overrides = {}): ChatMessage => ({
  id: generateId(),
  content: 'Test message',
  role: 'user',
  timestamp: new Date(),
  ...overrides
})

export const createMockGrpcClient = () => ({
  getMessages: vi.fn(),
  sendMessage: vi.fn(),
  // ... other methods
})
```

### 8. Coverage Standards

**Coverage Thresholds**:
```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    // Critical paths require higher coverage
    './src/stores/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
}
```

**Coverage Reports**:
- **HTML Report**: Visual coverage analysis for developers
- **JSON Report**: CI/CD integration and coverage tracking
- **Text Report**: Quick console feedback during development

### 9. Quality Gates

**Pre-Commit Requirements**:
- All tests must pass
- No reduction in coverage below thresholds
- No broken builds or linting errors
- Storybook builds successfully

**CI/CD Integration**:
```yaml
# GitHub Actions
- name: Run tests
  run: pnpm test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
  
- name: Test Storybook build
  run: pnpm storybook:build
```

### 10. Documentation Standards

**Test Documentation**:
- Clear test descriptions explaining the "what" and "why"
- Comprehensive README for testing patterns
- Examples for common testing scenarios
- Troubleshooting guide for test failures

**Storybook Documentation**:
- Component usage examples
- Accessibility considerations
- Design system integration
- Interactive playground for manual testing

## Future Considerations

### Planned Enhancements
- **Visual Regression Testing**: Automated screenshot comparison
- **Performance Testing**: Automated performance budgets
- **A11y Testing**: Enhanced accessibility validation
- **Load Testing**: Stress testing for large datasets

### Tooling Evolution
- **Test Parallelization**: Further optimization for large test suites
- **AI-Assisted Testing**: Automated test generation for edge cases
- **Real User Monitoring**: Integration with production telemetry
- **Cross-Browser Testing**: Automated testing across browsers

## Related Decisions

- **ADR-005**: StoreBuilder architecture influences store testing patterns
- **ADR-003**: Styling architecture affects component testing approaches
- **ADR-006**: VCommon virtualization requires specialized testing patterns
- **ADR-001**: Chat components drive complex integration testing needs

---

*This testing architecture ensures high-quality, reliable code across all Zondax applications while maintaining developer productivity and providing comprehensive coverage visibility.*