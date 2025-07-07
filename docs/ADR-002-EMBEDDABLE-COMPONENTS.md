# ADR-002: Embeddable Components and Container Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Authors**: Development Team  
**Reviewers**: TBD  

## Executive Summary

This document describes the embeddable components and container architecture pattern used throughout the Zondax frontend applications. This system enables dynamic composition of UI components through a context-based approach that supports flexible content injection, cross-platform compatibility, and type-safe component management.

## Architecture Overview

### Core Problem Solved

Traditional component composition often leads to:
- **Tight coupling** between container and content components
- **Difficult dynamic content management** for bars and navigation areas
- **Platform-specific implementations** that don't scale
- **Performance issues** from unnecessary re-renders
- **Complex prop drilling** for deeply nested content

### Solution: Generic Embedded Component System

The embeddable component system provides a **context-based architecture** that separates container layout from content injection, enabling dynamic composition while maintaining type safety and performance.

## Key Components

### 1. Core Abstractions

#### EmbeddedItem Interface
```typescript
interface EmbeddedItem<TSectionType extends string = string> {
  id: string                    // Unique identifier
  component: React.ReactElement // Component to render
  section: TSectionType         // Placement section (left, center, right)
  priority: number             // Ordering within sections (lower = higher priority)
  persistent?: boolean         // Persist across page changes
}
```

#### Generic Context Factory
```typescript
// Creates type-safe contexts for different container types
const TopBarContext = createEmbeddedComponentContext<'left' | 'center' | 'right'>()
const StatusBarContext = createEmbeddedComponentContext<'left' | 'center' | 'right'>()
```

### 2. Container Components

#### Generic Bar Component
The foundation component that provides layout for all bar-type containers:

```typescript
export function Bar({ items, className }: BarProps) {
  // Groups items by section and filters valid components
  const leftItems = items.filter(item => item.section === 'left' && item.component)
  const centerItems = items.filter(item => item.section === 'center' && item.component)
  const rightItems = items.filter(item => item.section === 'right' && item.component)
  
  return (
    <div className="flex items-center w-full">
      <div className="flex items-center gap-2">{leftItems.map(renderItem)}</div>
      <div className="flex flex-1 items-center justify-center gap-2">{centerItems.map(renderItem)}</div>
      <div className="flex items-center gap-2">{rightItems.map(renderItem)}</div>
    </div>
  )
}
```

#### Specialized Container Components
```typescript
// TopBar - Application header with navigation and actions
export function TopBar({ className }: TopBarProps = {}) {
  const { items } = useTopBar()
  return (
    <Bar 
      items={items} 
      className={cn('top-0 w-full border-b bg-background h-top-bar px-4', className)} 
    />
  )
}

// StatusBar - Application footer with status information
export function StatusBar({ className }: StatusBarProps = {}) {
  const { items } = useStatusBar()
  return (
    <Bar 
      items={items} 
      className={cn('h-status-bar border-t bg-muted px-2 text-muted-foreground text-xs', className)} 
    />
  )
}
```

### 3. Content Injection API

#### Safe Parameter-based API (Recommended)
```typescript
// ✅ SAFE - Individual parameters prevent re-render loops
function MyComponent() {
  useTopBarItem(
    'my-button',                    // id
    <Button>Click me</Button>,      // component
    'right',                        // section
    10                             // priority
  )
  return null // Embedded components render nothing directly
}
```

#### Object-based API (Legacy)
```typescript
// ⚠️ REQUIRES MEMOIZATION - Object references cause re-renders
function MyComponent() {
  const item = useMemo(() => ({
    id: 'my-button',
    component: <Button>Click me</Button>,
    section: 'right' as const,
    priority: 10,
  }), [])
  
  useTopBarItemObject(item)
  return null
}
```

## Content Management Patterns

### 1. Pre-built Embedded Components

#### LogoItem
```typescript
export function LogoItem<TSection extends string = TriSection>({
  locationHook: location,  // useTopBarItem, useStatusBarItem, etc.
  section = TriSection.Left,
  priority = 1,
  persistent = true,
  text = 'App',
  redirectUrl,
  className,
  isLink = true,
}: LogoItemProps<TSection>) {
  const logoComponent = useMemo(() => {
    const baseClasses = cn('flex items-center gap-2 font-semibold', className)
    
    if (isLink && redirectUrl) {
      return <Link href={redirectUrl} className={baseClasses}>{text}</Link>
    }
    return <div className={baseClasses}>{text}</div>
  }, [text, redirectUrl, className, isLink])

  location('logo', logoComponent, section, priority, persistent)
  return null
}
```

#### ThemeToggleItem
```typescript
export function ThemeToggleItem<TSection extends string = TriSection>({
  locationHook: location,
  section = TriSection.Right,
  priority = 10,
}: ThemeToggleItemProps<TSection>) {
  const themeToggle = useMemo(() => <ThemeToggle />, [])
  
  location('theme-toggle', themeToggle, section, priority)
  return null
}
```

### 2. Higher-Order Component Pattern

```typescript
export function withEmbeddedItem<TComponent extends ComponentType<any>, TSection extends string>(
  Component: TComponent,
  config: EmbeddedItemConfig<TSection>
) {
  return function EmbeddedWrapper(props: ComponentProps<TComponent> & EmbeddedItemProps<TSection>) {
    const { locationHook, section, priority, persistent, ...componentProps } = props
    
    const embeddedComponent = useMemo(() => (
      <Component {...componentProps as ComponentProps<TComponent>} />
    ), [componentProps])
    
    locationHook(config.id, embeddedComponent, section, priority, persistent)
    return null
  }
}
```

### 3. Dynamic Content Management

```typescript
// Context provides CRUD operations for items
const { items, addItem, removeItem, updateItem, clearSection } = useTopBar()

// Add item dynamically
addItem({
  id: 'dynamic-button',
  component: <Button>Dynamic</Button>,
  section: 'right',
  priority: 5
})

// Remove item
removeItem('dynamic-button')

// Clear all items in a section
clearSection('center')
```

## Cross-Platform Integration

### Responsive Sidebar Component

```typescript
export function Sidebar({ 
  children, 
  className, 
  collapsible = "icon", 
  side = "left" 
}: SidebarProps) {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return (
      <Sheet>
        <SheetContent side={side} className={cn("w-[280px] p-0", className)}>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn("relative h-full", className)}>
        {children}
      </div>
    </TooltipProvider>
  )
}
```

### Platform-Aware Hook Usage

```typescript
function AppLayout() {
  const isMobile = useIsMobile()
  
  return (
    <>
      {/* Desktop-specific top bar items */}
      {!isMobile && (
        <SearchItem locationHook={useTopBarItem} section="center" priority={1} />
      )}
      
      {/* Mobile-specific sidebar trigger */}
      {isMobile && (
        <SidebarTriggerItem locationHook={useTopBarItem} section="left" priority={0} />
      )}
      
      <TopBar />
      <main>{children}</main>
      <StatusBar />
    </>
  )
}
```

## Type Safety and Section Management

### Section Type Definitions

```typescript
export enum TriSection {
  Left = 'left',
  Center = 'center', 
  Right = 'right',
}

export enum BiSection {
  Left = 'left',
  Right = 'right',
}

// Type-safe section constraints
type TopBarSection = `${TriSection}`
type StatusBarSection = `${TriSection}`
type SidebarSection = `${BiSection}`
```

### Generic Hook Factory

```typescript
// Creates type-safe hooks for each container type
function createEmbedHostHook<TSection extends string>(
  context: Context<EmbeddedComponentState<TSection>>,
  contextName: string
) {
  const useEmbedHost = () => {
    const ctx = useContext(context)
    if (!ctx) throw new Error(`use${contextName} must be used within ${contextName}Provider`)
    return ctx
  }
  
  const useEmbeddedItem = (
    id: string,
    component: React.ReactElement,
    section: TSection,
    priority: number = 1,
    persistent: boolean = false
  ) => {
    // Implementation with proper dependency management
  }
  
  return { useEmbedHost, useEmbeddedItem, useEmbeddedItemCallback }
}
```

## Performance Optimization

### 1. Memoization Strategy

```typescript
// Component memoization in embedded items
const logoComponent = useMemo(() => {
  return <Link href={redirectUrl}>{text}</Link>
}, [text, redirectUrl, className, isLink])

// Hook dependency management
useEffect(() => {
  context.addItem({ id, component, section, priority, persistent })
  return () => context.removeItem(id)
}, [id, component, section, priority, persistent])
```

### 2. Re-render Prevention

**Safe API Design**:
- Individual parameters instead of object references
- Stable component memoization
- Proper cleanup in useEffect

**Performance Monitoring**:
- Track item registration/removal cycles
- Monitor component render frequency
- Measure context state updates

## Usage Patterns

### 1. Application Layout Integration

```typescript
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TopBarProvider>
      <StatusBarProvider>
        <div className="min-h-screen flex flex-col">
          {/* Register embedded items */}
          <AppTopBarItems />
          <AppStatusBarItems />
          
          {/* Render containers */}
          <TopBar />
          
          <main className="flex-1">
            {children}
          </main>
          
          <StatusBar />
        </div>
      </StatusBarProvider>
    </TopBarProvider>
  )
}

function AppTopBarItems() {
  return (
    <>
      <LogoItem locationHook={useTopBarItem} text="KS" section="left" priority={0} />
      <SearchItem locationHook={useTopBarItem} section="center" priority={1} />
      <ThemeToggleItem locationHook={useTopBarItem} section="right" priority={10} />
      <UserButtonItem locationHook={useTopBarItem} section="right" priority={20} />
    </>
  )
}
```

### 2. Page-Specific Content

```typescript
function DashboardPage() {
  return (
    <>
      {/* Page-specific top bar items */}
      <RefreshItem locationHook={useTopBarItem} section="right" priority={5} />
      <ExportItem locationHook={useTopBarItem} section="right" priority={6} />
      
      {/* Page-specific status bar items */}
      <LastUpdatedItem locationHook={useStatusBarItem} section="left" priority={1} />
      <ConnectionStatusItem locationHook={useStatusBarItem} section="right" priority={1} />
      
      <div>Dashboard content...</div>
    </>
  )
}
```

### 3. Feature-Based Organization

```typescript
// Feature modules can contribute their own embedded items
function WalletFeature() {
  return (
    <>
      <WalletSelectorItem locationHook={useTopBarItem} section="center" priority={2} />
      <WalletBalanceItem locationHook={useStatusBarItem} section="center" priority={1} />
    </>
  )
}

function TransactionFeature() {
  return (
    <>
      <TransactionCountItem locationHook={useStatusBarItem} section="left" priority={2} />
      <PendingTxItem locationHook={useStatusBarItem} section="right" priority={2} />
    </>
  )
}
```

## Benefits

### 1. Architectural Benefits
- **Loose Coupling**: Containers and content are decoupled
- **Dynamic Composition**: Items can be added/removed at runtime
- **Type Safety**: Full TypeScript support with generic sections
- **Performance**: Optimized re-render behavior
- **Reusability**: Generic Bar component works for all containers

### 2. Developer Experience Benefits
- **Consistent API**: Uniform pattern across all containers
- **Flexible Placement**: Section-based positioning
- **Priority Control**: Predictable ordering within sections
- **Easy Integration**: Simple hook-based API
- **Cross-Platform**: Responsive design built-in

### 3. Maintenance Benefits
- **Centralized Layout Logic**: Single Bar component handles all layouts
- **Isolated Content**: Features manage their own embedded items
- **Clear Ownership**: Items are owned by the components that create them
- **Easy Testing**: Components can be tested in isolation

## Migration and Evolution

### 1. From Static to Dynamic
```typescript
// Before: Static composition
<TopBar>
  <Logo />
  <Search />
  <ThemeToggle />
  <UserMenu />
</TopBar>

// After: Dynamic composition
<TopBarProvider>
  <LogoItem locationHook={useTopBarItem} />
  <SearchItem locationHook={useTopBarItem} />
  <ThemeToggleItem locationHook={useTopBarItem} />
  <UserMenuItem locationHook={useTopBarItem} />
  <TopBar />
</TopBarProvider>
```

### 2. Adding New Container Types
```typescript
// Create new context
const ToolbarContext = createEmbeddedComponentContext<'left' | 'right'>()

// Create provider
const ToolbarProvider = createEmbeddedComponentProvider<'left' | 'right'>('left')

// Create hooks
const { useEmbedHost: useToolbar, useEmbeddedItem: useToolbarItem } = 
  createEmbedHostHook(ToolbarContext, 'Toolbar')

// Create container component
export function Toolbar() {
  const { items } = useToolbar()
  return <Bar items={items} className="toolbar-specific-styles" />
}
```

## Hierarchical Responsive Optimization

### Problem: Space-Constrained Component Adaptation

Embeddable components need to adapt intelligently to available space constraints, especially in containers like TopBar where multiple items compete for limited space.

### Current Foundation: Single-Component Optimizer

The codebase includes a sophisticated optimizer system currently used for breadcrumbs:

#### Core Components
- **`ParameterOptimized`**: Creates hidden measurement containers for different parameter values
- **`useOptimalParameter`**: Optimization engine with hysteresis, debouncing, and runaway protection
- **`BreadcrumbDynamic`**: Practical implementation that collapses breadcrumb items based on available space

#### Key Features
```typescript
// Current: Single component optimization
const optimalCollapseCount = useOptimalParameter({
  parameterRange: [0, 1, 2, 3, 4], // Collapse levels
  measurementSelector: '[data-breadcrumb-list]',
  constraintProperty: 'width',
  hysteresisThreshold: 10, // Prevent oscillation
  debounceMs: 100, // Resize debouncing
})
```

### Proposed: Hierarchical Multi-Component Optimization

Extend the optimizer system to work hierarchically across multiple embedded components:

#### 1. Multi-Level Priority System

```typescript
interface HierarchicalEmbeddedItem<TSectionType extends string = string> {
  id: string
  component: React.ReactElement
  section: TSectionType
  priority: number
  
  // New: Hierarchical optimization properties
  tier: number                    // Collapse tier (0 = never collapse, higher = collapse earlier)
  collapseGroup?: string         // Group items that collapse together
  variants?: {
    [tier: number]: React.ReactElement  // Component variants for different tiers
  }
  collapsible?: boolean          // Can this item be collapsed/hidden
  criticalInSection?: boolean    // Must remain visible in its section
}
```

#### 2. Hierarchical Parameter Ranges

```typescript
// Multi-dimensional optimization parameters
type HierarchicalOptimizationState = {
  sectionCollapse: {
    left: number,    // How many left items to collapse
    center: number,  // How many center items to collapse  
    right: number    // How many right items to collapse
  }
  tierCollapse: number  // Current tier level (higher = more collapsed)
  componentStates: {
    breadcrumb?: number,  // Breadcrumb collapse level
    search?: 'full' | 'icon' | 'hidden',  // Search component state
    userMenu?: 'full' | 'avatar' | 'hidden'  // User menu state
  }
}

// Generate optimization parameter range
const generateHierarchicalRange = (items: HierarchicalEmbeddedItem[]) => {
  // Create combinations of collapse states based on item tiers and priorities
  return optimizationStates.sort((a, b) => a.totalCollapseLevel - b.totalCollapseLevel)
}
```

#### 3. Cross-Component Measurement

```typescript
const useHierarchicalOptimization = <TSectionType extends string>(
  items: HierarchicalEmbeddedItem<TSectionType>[],
  containerRef: RefObject<HTMLElement>
) => {
  const parameterRange = useMemo(() => 
    generateHierarchicalRange(items), [items]
  )
  
  const optimalState = useOptimalParameter({
    parameterRange,
    measurementSelector: '[data-topbar-content]',
    constraintProperty: 'width',
    constraint: (measurement, containerSize) => {
      // Multi-component constraint logic
      return measurement.totalWidth <= containerSize &&
             measurement.criticalItems.every(item => item.isVisible) &&
             measurement.sections.every(section => section.hasMinimumContent)
    },
    hysteresisThreshold: 15, // Slightly higher for multi-component
    debounceMs: 100,
  })
  
  return {
    optimizedItems: applyHierarchicalOptimization(items, optimalState),
    currentState: optimalState,
    isOptimizing: optimalState === null
  }
}
```

#### 4. Smart Component Variants

```typescript
// Components can define multiple variants for different optimization states
function SearchItem<TSection extends string>({
  locationHook: location,
  section,
  priority,
  tier = 2, // Collapse at tier 2
}: SearchItemProps<TSection>) {
  const variants = useMemo(() => ({
    0: <SearchInput className="w-64" placeholder="Search everything..." />,
    1: <SearchInput className="w-32" placeholder="Search..." />,
    2: <Button variant="ghost" size="sm"><Search className="h-4 w-4" /></Button>,
    3: null // Hidden at tier 3
  }), [])
  
  location('search', variants, section, priority, tier, { variants, tier })
  return null
}

function UserMenuItem<TSection extends string>({
  locationHook: location,
  section,
  priority,
  tier = 1,
}: UserMenuItemProps<TSection>) {
  const variants = useMemo(() => ({
    0: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8" />
            <span>John Doe</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {/* Full menu */}
      </DropdownMenu>
    ),
    1: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Avatar className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        {/* Simplified menu */}
      </DropdownMenu>
    ),
    2: null // Hidden at tier 2
  }), [])
  
  location('user-menu', variants, section, priority, tier, { variants, tier, criticalInSection: false })
  return null
}
```

#### 5. Hierarchical TopBar Integration

```typescript
export function HierarchicalTopBar({ className }: TopBarProps = {}) {
  const { items } = useTopBar()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { optimizedItems, isOptimizing } = useHierarchicalOptimization(
    items as HierarchicalEmbeddedItem[],
    containerRef
  )
  
  return (
    <div 
      ref={containerRef}
      className={cn('top-0 w-full border-b bg-background h-top-bar px-4', className)}
    >
      <ParameterOptimized
        parameterRange={generateHierarchicalRange(items)}
        renderComponent={(state) => (
          <HierarchicalBar 
            items={applyHierarchicalOptimization(items, state)} 
            data-topbar-content
          />
        )}
      />
      
      {!isOptimizing && (
        <HierarchicalBar items={optimizedItems} data-topbar-content />
      )}
    </div>
  )
}

function HierarchicalBar({ items }: { items: HierarchicalEmbeddedItem[] }) {
  // Group items by section, apply tier-based filtering
  const processedItems = items
    .filter(item => item.component !== null) // Filter out hidden variants
    .sort((a, b) => a.priority - b.priority) // Sort by priority
  
  const leftItems = processedItems.filter(item => item.section === 'left')
  const centerItems = processedItems.filter(item => item.section === 'center')  
  const rightItems = processedItems.filter(item => item.section === 'right')
  
  return (
    <div className="flex items-center w-full" data-topbar-content>
      <div className="flex items-center gap-2 min-w-0">
        {leftItems.map(renderOptimizedItem)}
      </div>
      <div className="flex flex-1 items-center justify-center gap-2 min-w-0">
        {centerItems.map(renderOptimizedItem)}
      </div>
      <div className="flex items-center gap-2 min-w-0">
        {rightItems.map(renderOptimizedItem)}
      </div>
    </div>
  )
}
```

### Benefits of Hierarchical Optimization

#### 1. **Intelligent Space Management**
- Automatically adapts to available space constraints
- Preserves critical functionality while gracefully degrading non-essential items
- Prevents UI overflow and layout breaks

#### 2. **User Experience Continuity**
- Maintains familiar interface patterns across different screen sizes
- Provides consistent interaction models (buttons may shrink but remain clickable)
- Preserves accessibility through all optimization states

#### 3. **Developer Control**
- Components define their own optimization strategies
- Clear tier system for predictable collapse behavior
- Flexible variant system for complex component transformations

#### 4. **Performance Optimized**
- Reuses existing optimizer infrastructure (hysteresis, debouncing, runaway protection)
- Minimal re-renders through proper memoization
- Efficient measurement and constraint evaluation

### Implementation Strategy

#### Phase 1: Extend Existing Types
- Add hierarchical properties to `EmbeddedItem` interface
- Create `HierarchicalEmbeddedItem` extension
- Update context types to support optimization metadata

#### Phase 2: Hierarchical Parameter Generation
- Implement `generateHierarchicalRange` function
- Create constraint logic for multi-component optimization  
- Extend `useOptimalParameter` for hierarchical states

#### Phase 3: Component Variant System
- Update embedded item components to support variants
- Create helper functions for common variant patterns
- Implement tier-based component filtering

#### Phase 4: TopBar Integration
- Create `HierarchicalTopBar` component
- Integrate with existing `ParameterOptimized` system
- Add measurement containers for optimization states

#### Phase 5: Testing and Refinement
- Test across different screen sizes and content scenarios
- Tune hysteresis and constraint parameters
- Create Storybook stories for optimization states

This hierarchical optimization system would provide intelligent, automatic UI adaptation while maintaining the clean embedded component architecture and reusing the robust optimization infrastructure already in place.

## Build-Time Optimization Strategy

### Problem: Runtime Optimization Performance

While runtime optimization provides perfect adaptability, it introduces performance overhead:
- Measurement cycles during resize events
- Parameter range evaluation delays
- Initial optimization flickering
- Exponential complexity with multiple components

### Decision: Hybrid Build-Time + Runtime Optimization

Implement a **build-time optimization cache** with runtime fallback for maximum performance and flexibility.

#### Core Strategy

```typescript
// Build-time: Pre-calculate optimization states for common scenarios
interface OptimizationPreset {
  name: string              // 'desktop-xl-full-nav'
  containerWidth: number    // 1920
  items: ComponentConfig[]  // Component configuration
  optimalState: HierarchicalOptimizationState
  fallbackStates: HierarchicalOptimizationState[]
}

// Runtime: Cache-first optimization with fallback
const useOptimizationCache = () => {
  const findOptimalStateFromCache = (items, containerWidth) => {
    // 1. Try exact preset match
    // 2. Try interpolation between presets  
    // 3. Fallback to runtime optimization
  }
}
```

#### Build Pipeline Integration

```typescript
// vite-plugin-optimization-cache.ts
export function optimizationCachePlugin(): Plugin {
  return {
    buildStart: async () => {
      // Measure components with headless browser
      const measurements = await measureAllComponents()
      
      // Generate presets for common viewport/configuration combinations
      const presets = await generateOptimizationPresets()
      
      // Create interpolation lookup tables
      const cache = generateInterpolationCache(measurements, presets)
      
      // Output optimization-cache.json
    }
  }
}
```

### Benefits

#### Performance Benefits
- **Zero runtime measurement overhead** for cached states (80-90% hit rate expected)
- **Instant optimization** for common viewport sizes
- **Predictable performance** without optimization delays
- **Eliminates measurement-induced layout thrashing**

#### Reliability Benefits  
- **Consistent results** across environments and browser differences
- **No font loading race conditions** - measurements done at build time
- **Deterministic optimization states** for testing and debugging

#### Development Benefits
- **Faster development cycles** with cached optimizations
- **Storybook integration** showing all optimization states
- **Build-time validation** of optimization configurations

### Implementation Phases

#### Phase 1: Cache Infrastructure
- Component measurement system using headless browser
- Preset generation for common viewport/configuration combinations  
- Cache file generation and validation

#### Phase 2: Runtime Integration
- Cache-first optimization hook with runtime fallback
- Interpolation system for cache misses
- Performance monitoring and cache hit rate tracking

#### Phase 3: Build Pipeline
- Vite plugin for automatic cache generation
- CI/CD integration for cache validation
- Development tooling for cache inspection

### Cache Strategy

#### Preset Coverage
```typescript
const VIEWPORT_PRESETS = [
  { name: 'desktop-xl', width: 1920 },
  { name: 'desktop-lg', width: 1440 },
  { name: 'tablet', width: 768 },
  { name: 'mobile', width: 480 }
]

const CONFIGURATION_PRESETS = [
  'basic-nav',    // Logo + Search + User
  'full-nav',     // Logo + Nav + Search + Actions + User  
  'dashboard',    // Logo + Breadcrumb + Actions + User
  'minimal'       // Logo + User only
]
// Generates 16 base presets with interpolation points
```

#### Cache Invalidation
- Component signature validation to detect changes
- Build timestamp tracking for staleness detection
- Automatic fallback to runtime optimization for cache misses

### Trade-offs

#### Accepted Costs
- **Build time increase** for measurement and preset generation
- **Bundle size increase** for optimization cache data
- **Complexity increase** in build pipeline and tooling

#### Rejected Alternatives
- **Pure runtime optimization**: Performance overhead and complexity
- **Static CSS media queries**: Lack of content-aware optimization  
- **Manual responsive configuration**: Developer overhead and maintenance burden

This hybrid approach provides the performance benefits of build-time optimization while maintaining the flexibility and accuracy of runtime measurement for edge cases.

## Best Practices

### 1. Component Design
- Always use memoization for embedded components
- Implement proper cleanup in useEffect hooks
- Use the parameter-based API to prevent re-renders
- Make components platform-aware when necessary
- **Define meaningful component variants for different optimization tiers**
- **Use appropriate tier levels to control collapse priority**

### 2. Section Management
- Use enums for section definitions
- Maintain consistent priority ranges per feature
- Document section usage and priority conventions
- Reserve priority ranges for different types of content
- **Consider section balance when assigning tiers to avoid empty sections**
- **Mark critical components that should persist across optimization states**

### 3. Performance
- Monitor item registration frequency
- Use React DevTools Profiler to identify re-render issues
- Implement proper dependency arrays in hooks
- Consider lazy loading for complex embedded components
- **Test optimization performance with realistic content loads**
- **Monitor measurement overhead for hierarchical optimization**

### 4. Hierarchical Optimization
- **Design components with graceful degradation in mind**
- **Test all optimization states during development**
- **Use semantic tiers that align with user importance**
- **Provide meaningful fallbacks for collapsed states**
- **Consider mobile-first design for optimization variants**

---

*This embeddable component architecture provides a robust foundation for dynamic UI composition while maintaining type safety, performance, and cross-platform compatibility. The hierarchical optimization extension enables intelligent space management for complex multi-component containers.*