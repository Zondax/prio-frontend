# ADR-004: Layout Presets Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: Frontend Team, UX Team  

## Problem Statement

As we build complex applications with varying use cases (chat interfaces, desktop apps, documentation sites, data visualization), we need a layout system that can:

1. **Support multiple application types**: Chat, desktop, web, minimal interfaces
2. **Handle responsive behavior**: Consistent behavior across devices and screen sizes
3. **Enable rapid prototyping**: Quick layout switching for design iteration
4. **Maintain consistency**: Enforce design standards while allowing customization
5. **Scale with complexity**: Simple layouts to complex multi-panel interfaces
6. **Support theming**: Layout behavior should respect theme and accessibility needs

The decision point: How do we architect a layout preset system that provides flexibility without complexity, and consistency without rigidity?

## Decision

**Multi-Layer Layout Preset Architecture**: Hierarchical layout system with typed presets, responsive behavior, and composition patterns.

### Core Architecture
- **Application-level presets**: High-level layout configurations (web, desktop, chat, minimal, docs)
- **Component-level presets**: Specialized configurations (chat layouts, flow layouts)
- **Responsive by default**: All presets adapt to screen size and device capabilities
- **Composition-based**: Layout components can be composed and extended
- **State-managed**: Centralized layout state with preset switching

### Layout Hierarchy
```text
Application Layout (AppShell)
├── Page Layout (PageLayout)
│   ├── Content Areas (specific to application)
│   └── Specialized Layouts (Chat, Flow, etc.)
└── Responsive Behavior (automatic adaptation)
```

## Alternatives Considered

### Option A: Single Global Layout Configuration
**Pros**: Simple, minimal abstraction, easy to understand
**Cons**: Poor separation of concerns, difficult to extend, limited reusability
**Verdict**: Rejected - doesn't scale with application complexity

### Option B: CSS-Only Layout System
**Pros**: Performance, no JavaScript overhead, simple implementation
**Cons**: No dynamic behavior, poor TypeScript integration, limited responsive logic
**Verdict**: Rejected - insufficient for dynamic layout switching needs

### Option C: Component-Specific Layout Props
**Pros**: Flexible, component-scoped, no global state
**Cons**: Prop drilling, inconsistent patterns, difficult theme integration
**Verdict**: Rejected - leads to scattered layout logic and inconsistency

### Option D: Full Layout Management Library (React Grid Layout, etc.)
**Pros**: Feature-rich, mature ecosystem, advanced capabilities
**Cons**: Large bundle size, complex API, over-engineering for our needs
**Verdict**: Rejected - too heavy for our use cases

## Rationale

### Why Multi-Layer Presets?

**Application Presets for Broad Categories**:
```typescript
export const layoutPresets: Record<string, LayoutPreset> = {
  website: { variant: 'web', topBar: true, padding: 'default', maxWidth: '6xl' },
  desktop: { variant: 'desktop', topBar: true, sidebar: true, statusBar: true },
  chat: { variant: 'chat', topBar: true, padding: 'none', maxWidth: 'full' },
  minimal: { variant: 'web', topBar: false, padding: 'default', maxWidth: '4xl' },
  analytics: { variant: 'desktop', topBar: true, sidebar: true, statusBar: true, padding: 'compact', maxWidth: 'full' },
  mobileFirst: { variant: 'mobile', topBar: 'minimal', sidebar: 'drawer', padding: 'compact', bottomNav: true }
}
```

**Component Presets for Specialized Behavior**:
```typescript
export const chatLayoutPresets = {
  standard: { layout: 'default', sidebar: false, theme: 'light' },
  threaded: { layout: 'threaded', sidebar: true, theme: 'light' },
  focused: { layout: 'focused', sidebar: false, theme: 'dark' },
  presentation: { layout: 'presentation', sidebar: false, theme: 'high-contrast' }
}
```

### Architecture Benefits

**Type Safety**: Full TypeScript integration prevents configuration errors
**Performance**: Preset-based rendering with minimal re-computation
**Consistency**: Enforced design patterns across applications
**Flexibility**: Composition allows custom configurations when needed
**Maintainability**: Centralized layout logic with clear separation of concerns

### Responsive Strategy

**Mobile-First Design**:
```typescript
const effectiveLayout = React.useMemo(() => {
  if (!responsive) return layout
  if (dimensions.isMobile) return 'standard'  // Simplify on mobile
  if (dimensions.isTablet && layout === 'threaded') return 'standard'
  return layout
}, [layout, dimensions, responsive])
```

**Breakpoint Strategy**:
- Mobile: < 768px (simplified layouts, hidden sidebars)
- Tablet: 768px - 1024px (adapted layouts, conditional features)
- Desktop: > 1024px (full feature set)

## Consequences

### Positive
- **Rapid development**: Preset-based layouts accelerate feature development
- **Consistent UX**: Enforced layout patterns across all applications
- **Type safety**: Prevents layout configuration bugs at compile time
- **Responsive by default**: All layouts work across device sizes
- **Extensible**: New presets and variants can be added easily
- **Performance**: Optimized rendering with minimal layout recalculation

### Negative
- **Initial complexity**: Learning curve for developers unfamiliar with the system
- **Preset limitations**: Some edge cases may require custom layout logic
- **Maintenance overhead**: Layout presets need to be maintained as design evolves

### Risks
- **Over-abstraction**: Risk of creating too many preset variations
- **Breaking changes**: Layout API changes could affect multiple applications
- **Performance**: Complex responsive logic could impact render performance

## Implementation Notes

### Layout Preset Definition

**Preset Interface**:
```typescript
export interface LayoutPreset {
  variant?: 'web' | 'desktop' | 'chat'
  topBar?: boolean
  sidebar?: boolean
  statusBar?: boolean
  padding?: 'none' | 'compact' | 'default' | 'spacious'
  maxWidth?: 'full' | 'xl' | '2xl' | '4xl' | '6xl'
  responsive?: boolean
  sections?: string[] // Named sections for semantic layout areas
}
```

**Usage Pattern**:
```typescript
function MyApp() {
  return (
    <AppShell preset="chat">
      <ChatLayout preset="threaded">
        {/* Application content */}
      </ChatLayout>
    </AppShell>
  )
}
```

**Layout Sections with Semantic Names**:
```typescript
function AnalyticsApp() {
  return (
    <AppShell preset="analytics">
      <LayoutSection name="metrics-header">
        <KPICards />
      </LayoutSection>
      
      <LayoutSection name="chart-area">
        <Charts />
      </LayoutSection>
      
      <LayoutSection name="data-table">
        <DataGrid />
      </LayoutSection>
    </AppShell>
  )
}
```

**Storybook Documentation with Visual Sections**:
```typescript
// In Storybook stories only - for visual documentation
export const AnalyticsLayoutStory = {
  render: () => (
    <AppShell preset="analytics">
      <LayoutSection 
        name="metrics-header" 
        className="bg-blue-100 border-2 border-blue-300 p-4"
      >
        📊 KPI Cards Section
      </LayoutSection>
      
      <LayoutSection 
        name="chart-area" 
        className="bg-green-100 border-2 border-green-300 p-4"
      >
        📈 Charts Section  
      </LayoutSection>
      
      <LayoutSection 
        name="data-table" 
        className="bg-purple-100 border-2 border-purple-300 p-4"
      >
        📋 Data Table Section
      </LayoutSection>
    </AppShell>
  )
}
```

### Responsive Behavior

**Automatic Adaptation**:
- Layouts automatically adapt to screen size
- Sidebars collapse/hide on mobile
- Padding and spacing adjust based on available space
- Complex layouts simplify on smaller screens

**Manual Override**:
```typescript
<AppShell 
  preset="desktop" 
  responsive={false}  // Disable automatic responsive behavior
  customLayout={{ sidebar: false }}  // Override specific properties
>
```

### Extension Patterns

**Custom Presets**:
```typescript
const customPresets = {
  ...layoutPresets,
  dashboard: { 
    variant: 'desktop', 
    topBar: true, 
    sidebar: true, 
    statusBar: true,
    padding: 'compact'
  }
}
```

**Preset Composition**:
```typescript
const extendedPreset = {
  ...layoutPresets.desktop,
  customSidebar: true,
  additionalPanels: ['inspector', 'properties']
}
```

### Quality Standards

**Testing Requirements**:
- All presets must be tested across breakpoints
- Layout switching should not cause visual glitches
- Responsive behavior should be consistent
- Performance testing for layout recalculation

**Documentation Standards**:
- All presets must have visual documentation
- Use cases and intended applications clearly defined
- Migration guides for preset changes
- Accessibility implications documented

## Implementation Roadmap

### Immediate Additions (Current Sprint)

**Analytics Preset**:
```typescript
analytics: { 
  variant: 'desktop', 
  topBar: true, 
  sidebar: true, 
  statusBar: true, 
  padding: 'compact', 
  maxWidth: 'full',
  sections: ['metrics-header', 'chart-area', 'data-table']
}
```
- **Purpose**: Data visualization apps, business intelligence dashboards
- **Key Features**: Full-width layout, compact spacing for data density, semantic section names
- **Use Cases**: Charts, tables, KPI dashboards, real-time monitoring

**Mobile-First Preset**:
```typescript
mobileFirst: { 
  variant: 'mobile', 
  topBar: 'minimal', 
  sidebar: 'drawer', 
  padding: 'compact', 
  bottomNav: true 
}
```
- **Purpose**: Touch-optimized mobile experience
- **Key Features**: Minimal top bar, slide-out sidebar, bottom navigation, compact padding
- **Use Cases**: Mobile apps, PWAs, responsive-first interfaces

### Future Considerations

**Planned Enhancements**:
- Layout animation for smooth preset transitions
- User customization and saved layout preferences  
- A/B testing support for layout variants
- Performance monitoring for layout operations

**Ecosystem Evolution**:
- Design system integration across Zondax applications
- React Native extension for mobile apps
- Enhanced accessibility support

## Related Decisions

- **ADR-003**: Styling architecture supports layout preset implementation
- **ADR-001**: Chat components drive specialized layout requirements
- **ADR-000**: Responsive design standards inform breakpoint strategy
- **Future ADR**: Design system standardization will affect preset definitions

---

*This layout preset architecture provides a scalable foundation for consistent, responsive, and maintainable layouts across all Zondax applications. The multi-layer approach balances flexibility with consistency while supporting rapid development and design iteration.*