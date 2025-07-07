# ADR-006: VCommon Virtualization Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: Frontend Team, Performance Team  

## Problem Statement

As we build data-intensive applications with large datasets (chat histories, data tables, flow diagrams, file lists), we face significant performance challenges:

1. **Rendering Performance**: Large lists (1000+ items) cause browser freezing and poor user experience
2. **Memory Usage**: DOM nodes for all items consume excessive memory, leading to crashes
3. **Scroll Performance**: Smooth scrolling becomes impossible with large datasets
4. **Initial Load Time**: Rendering thousands of components blocks the main thread
5. **Mobile Performance**: Limited memory and processing power exacerbate these issues
6. **Consistent Implementation**: Different components implement ad-hoc virtualization solutions

The decision point: How do we create a comprehensive virtualization system that handles diverse UI patterns while maintaining excellent performance and developer experience?

## Decision

**VCommon Virtualization Architecture**: Unified virtualization foundation with specialized components for all large dataset scenarios, built on TanStack Virtual for flexibility and performance.

### Core Architecture
- **VCommon Foundation**: Shared virtualization foundation using TanStack Virtual
- **Specialized Components**: vlist, vgrid, vtable built on vcommon
- **Design System Integration**: Seamless integration with CVA + Tailwind architecture
- **Performance optimized**: Minimal re-renders, efficient DOM updates, memory management
- **Developer friendly**: Simple APIs, TypeScript integration, comprehensive examples
- **Responsive design**: Adapts to different screen sizes and orientations

### Component Hierarchy
```typescript
// Foundation layer - TanStack Virtual integration
vcommon (uses @tanstack/react-virtual)
├── Design system integration (CVA + Tailwind)
├── Common virtualization patterns
└── Performance optimizations

// Virtual components section (Storybook: Virtual/)
Virtual/
├── vList (VirtualList)     // Chat messages, file lists
├── vGrid (VirtualGrid)     // Image galleries, card layouts  
└── vTable (VirtualTable)   // Data tables, spreadsheets
```

### Usage Examples
```typescript
// List virtualization (chat messages, file lists)
<VirtualList items={messages} itemHeight={80} />

// Grid virtualization (image galleries, card layouts)  
<VirtualGrid items={photos} itemWidth={200} itemHeight={150} />

// Table virtualization (data tables, spreadsheets)
<VirtualTable rows={data} columns={columns} />
```

## Alternatives Considered

### Option A: React Window/React Virtualized
**Pros**: Mature ecosystem, proven performance, extensive features
**Cons**: Large bundle size, complex API, not optimized for our specific use cases
**Verdict**: Rejected - doesn't fit our design system integration needs

### Option B: TanStack Virtual
**Pros**: Modern approach, TypeScript-first, framework-agnostic core, excellent performance
**Cons**: Requires custom wrappers for design system integration, learning curve
**Verdict**: **ACCEPTED** - Used as foundation for vcommon layer

### Option C: @tanstack/react-virtual + Custom Wrappers
**Pros**: Leverages proven library, reduces maintenance burden, excellent performance
**Cons**: Wrapper complexity, requires design system integration
**Verdict**: **ACCEPTED** - This is our chosen approach with vcommon as the wrapper layer

### Option D: Per-Component Virtualization
**Pros**: Optimized for specific use cases, minimal overhead
**Cons**: Inconsistent patterns, duplicated logic, maintenance burden
**Verdict**: Rejected - leads to fragmented solutions

### Option E: Browser Native Solutions (Intersection Observer)
**Pros**: Native performance, no library dependencies
**Cons**: Limited functionality, complex implementation, browser compatibility
**Verdict**: Rejected - insufficient for complex virtualization needs

## Rationale

### Why VCommon + TanStack Virtual?

**TanStack Virtual Foundation**:
- **Proven Performance**: Battle-tested virtualization engine
- **Modern Architecture**: TypeScript-first, framework-agnostic core
- **Maintenance**: Actively maintained by the TanStack team
- **Bundle Size**: Efficient, tree-shakeable implementation
- **Flexibility**: Supports diverse virtualization patterns

**VCommon Wrapper Benefits**:
- **Design System Integration**: Seamless integration with CVA + Tailwind architecture
- **Consistent APIs**: Standardized component interfaces across vlist, vgrid, vtable
- **Theme Support**: Respects dark mode and accessibility requirements
- **Component Patterns**: Follows our established component design patterns
- **TypeScript Integration**: Full type safety with our existing type system

**Performance Requirements**:
- **Chat Applications**: 10,000+ messages with smooth scrolling
- **Data Tables**: 100,000+ rows with sorting and filtering
- **Flow Diagrams**: 1,000+ nodes with real-time updates
- **File Systems**: Large directory trees with instant navigation

### Architecture Benefits

**Developer Experience**: Simple, consistent APIs across all virtualization scenarios
**Performance**: TanStack Virtual engine optimized for our specific use cases and design patterns
**Bundle Size**: Minimal overhead, tree-shakeable, leverages proven library
**Maintenance**: Balance between leveraging external library and maintaining custom wrapper
**Flexibility**: Supports diverse UI patterns while maintaining consistency
**Reliability**: Built on battle-tested TanStack Virtual foundation

## Consequences

### Positive
- **Consistent Performance**: All large datasets handled efficiently across applications
- **Developer Productivity**: Standardized virtualization patterns reduce implementation time
- **User Experience**: Smooth scrolling and responsive interfaces regardless of data size
- **Memory Efficiency**: Optimal DOM node management prevents browser crashes
- **Mobile Optimization**: Excellent performance on resource-constrained devices
- **Type Safety**: Full TypeScript integration prevents runtime errors

### Negative
- **Initial Development**: VCommon wrapper requires upfront investment
- **Maintenance Responsibility**: We own the wrapper layer and integration patterns
- **Learning Curve**: Team needs to understand both TanStack Virtual and our wrapper patterns
- **Dependency**: Reliance on external library (TanStack Virtual) for core functionality

### Risks
- **Performance Edge Cases**: Complex scenarios may require significant optimization
- **Browser Compatibility**: Need to ensure support across all target browsers
- **Mobile Performance**: React Native implementation may face platform-specific challenges

## Implementation Notes

### Core VCommon Components

**VirtualList (vlist)** - **IMPLEMENTED** (Chat Messages, File Lists):
```typescript
interface VirtualListProps<T> {
  items: T[]
  itemHeight: number | ((item: T, index: number) => number)
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
  onScroll?: (scrollTop: number) => void
}

// Usage
<VirtualList
  items={chatMessages}
  itemHeight={(message) => message.type === 'image' ? 300 : 80}
  renderItem={(message, index) => <ChatMessage key={message.id} message={message} />}
  overscan={5}
/>
```

**VirtualGrid (vgrid)** - **PLANNED** (Image Galleries, Card Layouts):
```typescript
interface VirtualGridProps<T> {
  items: T[]
  itemWidth: number
  itemHeight: number
  columns?: number | 'auto'
  gap?: number
  renderItem: (item: T, index: number) => React.ReactNode
}

// Usage
<VirtualGrid
  items={photos}
  itemWidth={200}
  itemHeight={150}
  columns="auto"
  gap={16}
  renderItem={(photo) => <PhotoCard photo={photo} />}
/>
```

**VirtualTable (vtable)** - **PLANNED** (Data Tables, Spreadsheets):
```typescript
interface VirtualTableProps<T> {
  rows: T[]
  columns: ColumnDefinition[]
  rowHeight: number
  headerHeight?: number
  stickyHeader?: boolean
  onSort?: (column: string, direction: 'asc' | 'desc') => void
}

// Usage
<VirtualTable
  rows={tableData}
  columns={[
    { key: 'name', title: 'Name', width: 200 },
    { key: 'email', title: 'Email', width: 300 },
    { key: 'role', title: 'Role', width: 150 }
  ]}
  rowHeight={48}
  stickyHeader
/>
```

**VirtualCustom** - **PLANNED** (Flow Diagrams, Complex Layouts):
```typescript
interface VirtualCustomProps<T> {
  items: T[]
  itemSize: (item: T, index: number) => { width: number; height: number }
  itemPosition: (item: T, index: number) => { x: number; y: number }
  renderItem: (item: T, index: number) => React.ReactNode
  containerSize: { width: number; height: number }
}

// Usage
<VirtualCustom
  items={flowNodes}
  itemSize={(node) => ({ width: node.width, height: node.height })}
  itemPosition={(node) => ({ x: node.x, y: node.y })}
  renderItem={(node) => <FlowNode node={node} />}
  containerSize={{ width: 1200, height: 800 }}
/>
```

### Performance Features

**Intelligent Overscan**:
- Dynamic overscan based on scroll velocity
- Reduced rendering during fast scrolling
- Optimized for touch devices

**Memory Management**:
- Automatic cleanup of off-screen elements
- Efficient re-use of DOM nodes
- Memory leak prevention

**Scroll Optimization**:
- Passive scroll listeners for better performance
- Debounced scroll updates
- Smooth scrolling with momentum

**Responsive Behavior**:
- Automatic item size recalculation on resize
- Orientation change handling
- Dynamic column count for grids

### Integration with Existing Architecture

**Design System Integration** - **IMPLEMENTED**:
```typescript
// VirtualList integrates with our design system
import { VirtualList } from '@zondax/ui-common/client'
import { cn } from '@zondax/ui-common/server'

// Works seamlessly with CVA variants
const messageVariants = cva('message-base', {
  variants: {
    role: { user: 'message--user', assistant: 'message--assistant' }
  }
})

<VirtualList
  items={messages}
  itemHeight={80}
  renderItem={(message, index) => (
    <div className={cn(messageVariants({ role: message.role }))}>
      {message.content}
    </div>
  )}
  className="space-y-2"
  scrollClassName="overflow-auto"
/>
```

**Store Integration**:
```typescript
// Works with our storebuilder patterns
const { data: messages, loading } = useMessagesStore()

<VirtualList
  items={messages}
  itemHeight={80}
  renderItem={(message) => <ChatMessage message={message} />}
/>
```

**Layout Preset Integration**:
```typescript
// Respects layout presets
<AppShell preset="analytics">
  <LayoutSection name="data-table">
    <VirtualTable rows={analyticsData} columns={columns} />
  </LayoutSection>
</AppShell>
```

### Quality Standards

**Performance Benchmarks**:
- 60fps scrolling with 10,000+ items
- < 100ms initial render time
- < 50MB memory usage for large datasets
- Smooth performance on mobile devices

**Testing Requirements**:
- Performance testing with large datasets
- Cross-browser compatibility testing
- Mobile device testing (iOS/Android)
- Accessibility testing with screen readers

**API Design Principles**:
- Consistent prop naming across all components
- Comprehensive TypeScript types
- Clear error messages and warnings
- Extensive documentation and examples

## Future Considerations

### Planned Enhancements
- **Infinite Scrolling**: Automatic data fetching as user scrolls
- **Dynamic Heights**: Better support for variable item heights
- **Horizontal Scrolling**: Support for horizontal virtualization
- **Nested Virtualization**: Virtualized lists within virtualized containers

### Performance Optimizations
- **Web Workers**: Off-main-thread calculations for complex layouts
- **Canvas Rendering**: High-performance rendering for specific use cases
- **Incremental Rendering**: Progressive enhancement for large datasets
- **Intersection Observer**: Native scroll detection optimizations

### Ecosystem Integration
- **Storybook**: Comprehensive component documentation and examples
- **Testing**: Custom testing utilities for virtualized components
- **DevTools**: Debug tools for virtualization performance
- **Metrics**: Performance monitoring and optimization insights

## Related Decisions

- **ADR-001**: Chat components require virtualization for message lists
- **ADR-003**: Styling architecture integrates with virtualized components
- **ADR-005**: StoreBuilder patterns work seamlessly with virtualized data
- **ADR-004**: Layout presets accommodate virtualized content areas

---

*VCommon provides a comprehensive virtualization foundation for all Zondax applications, ensuring excellent performance with large datasets while maintaining our design system consistency and developer experience standards.*