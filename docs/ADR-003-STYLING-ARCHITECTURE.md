# ADR-003: Styling Architecture - CVA + Tailwind v4 + Themes

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: Frontend Team  

## Problem Statement

As we build the chat components and broader UI system from scratch, we need to establish a styling architecture that can:

1. **Scale with component complexity**: Handle simple utilities to complex multi-variant components
2. **Maintain design consistency**: Enforce design system patterns across applications
3. **Support theming**: Enable light/dark modes and potential client branding
4. **Provide type safety**: Prevent styling bugs through TypeScript integration
5. **Optimize performance**: Minimize runtime overhead and bundle size
6. **Enable maintainability**: Clear patterns for component styling and updates

The decision point: How do we combine modern CSS tooling to achieve these goals without over-engineering simple components?

## Decision

**Hybrid Styling Architecture**: CVA + Tailwind v4 + CSS Variables

### Core Pattern
- **Simple components**: Direct Tailwind utilities
- **Complex components**: CVA generates semantic classes, CSS handles styling
- **Theming**: CSS variables for all design tokens
- **Type safety**: Full TypeScript integration for component variants

### Component Complexity Filter
```text
Variants ≥ 3 OR Reused across contexts OR Theme-dependent → Use CVA pattern
Otherwise → Use Tailwind utilities directly
```

### Technical Stack
- **CVA**: Semantic class generation and variant management
- **Tailwind v4**: Utility-first CSS with modern features
- **CSS Variables**: Runtime theming and design tokens
- **TypeScript**: Type-safe variant props and component APIs

## Alternatives Considered

### Option A: Pure Tailwind Utilities
**Pros**: Simple, no abstractions, fast development
**Cons**: No variant management, conditional className complexity, poor reusability
**Verdict**: Good for simple components, breaks down with complexity

### Option B: Styled-Components/Emotion
**Pros**: Component-scoped styles, JavaScript integration
**Cons**: Runtime overhead, larger bundles, complexity with SSR, theme prop drilling
**Verdict**: Rejected due to performance and complexity concerns

### Option C: CSS Modules + CVA
**Pros**: Scoped styles, good performance
**Cons**: Build complexity, less flexible than utility-first, harder theme integration
**Verdict**: Rejected in favor of utility-first approach

### Option D: Vanilla Extract + CVA
**Pros**: Zero-runtime CSS-in-TS, type safety
**Cons**: Build complexity, less ecosystem support, learning curve
**Verdict**: Rejected for simpler Tailwind integration

## Rationale

### Why This Combination?

**CVA Selection**:
- Proven pattern from shadcn/ui ecosystem
- Excellent TypeScript integration
- Minimal runtime overhead
- Clean component APIs

**Tailwind v4 Selection**:
- Modern CSS features (container queries, CSS layers)
- Excellent design token integration
- Strong ecosystem and tooling
- Performance optimizations

**CSS Variables for Theming**:
- Runtime theme switching without JavaScript
- Better performance than theme prop drilling
- Easier maintenance than duplicate CSS
- Future-proof for client branding

### Architecture Benefits

**Scalability**: Simple → complex component progression without refactoring
**Performance**: Minimal runtime overhead, optimal bundle sizes
**Developer Experience**: Clear patterns, excellent tooling, type safety
**Maintainability**: Semantic class names, centralized theming

## Consequences

### Positive
- **Consistent patterns** across simple and complex components
- **Type-safe styling** prevents variant-related bugs
- **Excellent performance** with build-time optimizations
- **Future-proof theming** supports client branding requirements
- **Team productivity** through clear architectural patterns

### Negative
- **Learning curve** for developers unfamiliar with CVA
- **Additional abstraction** layer for complex components
- **Potential over-engineering** if misapplied to simple components

### Risks
- **CVA ecosystem changes** could require migration
- **Tailwind v4 adoption issues** as it's relatively new
- **Pattern misuse** leading to unnecessary complexity

## Implementation Notes

### Component Development Guidelines

**Complexity Assessment**:
```typescript
// Simple: Use utilities directly
<button className="bg-primary text-white px-4 py-2 rounded">
  Click me
</button>

// Complex: Use CVA pattern
const buttonVariants = cva('button-base', {
  variants: {
    intent: { primary: 'button--primary', secondary: 'button--secondary' },
    size: { sm: 'button--sm', lg: 'button--lg' }
  }
})
```

**Naming Conventions**:
- Component base: `.component-name`
- Variants: `.component-name--variant-value`
- Child elements: `.component-name__element`

**Theme Integration**:
- All colors reference CSS variables: `hsl(var(--primary))`
- Theme switching through CSS class: `.dark`
- Custom theme properties when needed

### CSS Variable Architecture

**Three-Tier Variable System** for scalable design token management:

**Tier 1: Design Tokens (Global)**
```css
/* Foundational design tokens */
--size-xs: 0.5rem;     /* 8px */
--size-sm: 1rem;       /* 16px */ 
--size-md: 1.5rem;     /* 24px */
--size-lg: 2rem;       /* 32px */
--size-xl: 2.5rem;     /* 40px */

--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */

--duration-fast: 150ms;
--duration-normal: 300ms;
```

**Tier 2: Semantic Layout Variables**
```css
/* Component-agnostic semantic meanings */
--height-topbar: var(--size-xl);
--height-statusbar: var(--size-md);
--height-sidebar-header: var(--size-xl);
--width-sidebar-collapsed: var(--size-lg);
```

**Tier 3: Component Calculations**
```css
/* Component-specific calculated values */
.appshell__sidebar {
  height: calc(100vh - var(--height-statusbar));
}
```

**Variable Naming Guidelines**:
- **Design Tokens**: `--{category}-{size}` (e.g., `--size-md`, `--space-sm`, `--color-primary`)
- **Semantic Layout**: `--{property}-{component}` (e.g., `--height-topbar`, `--width-sidebar`)
- **Component Variables**: Use in CSS classes, avoid standalone component-specific variables

**Benefits**:
- **Consistency**: All components reference same design tokens
- **Maintainability**: Change tokens globally affects all components  
- **Scalability**: Easy to add new components following same pattern
- **Readability**: Clear hierarchy from global → semantic → component

### Quality Gates

**Pre-commit Checks**:
- TypeScript compilation for variant type safety
- Biome formatting for consistent class ordering
- Theme compatibility testing

**Component Review Checklist**:
- [ ] Appropriate pattern choice (utility vs CVA)
- [ ] Semantic class names (no inline utilities in CVA)
- [ ] Theme variable usage (no hardcoded colors)
- [ ] TypeScript types for all variants
- [ ] Uses design tokens instead of hardcoded values
- [ ] Semantic variables for cross-component dependencies
- [ ] No unnecessary component-specific CSS variables

## Related Decisions

- **ADR-000**: Establishes Tailwind v4 as standard CSS framework
- **ADR-001**: Chat components complexity drives need for variant management
- **Future ADR**: Design system standardization across Zondax projects

---

*This architectural decision establishes the foundation for scalable, maintainable, and performant styling across all Zondax frontend applications. The hybrid approach balances simplicity for basic components with sophisticated patterns for complex UI elements.*