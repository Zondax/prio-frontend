# ADR-000: Coding Guidelines and Standards

**Status**: Active  
**Date**: 2025-07-04  
**Authors**: Development Team  
**Reviewers**: TBD  

## Executive Summary

This document establishes foundational coding guidelines, development practices, and architectural principles for the Zondax frontend applications. These standards ensure consistency, maintainability, and quality across all projects in the workspace.

## Core Development Standards

### Package Management
- **Primary**: Use **pnpm** for all package management
- **Alternative**: Use **bun** with care, typically for new projects or specific performance needs
- **Forbidden**: Never use npm or yarn for new projects
- **Migration**: Prefer pnpm when migrating from yarn, especially in monorepos

### Code Quality Tools
- **Linting & Formatting**: Use **Biome v2** everywhere
- **Migration**: Actively migrate away from ESLint and Prettier
- **Rationale**: Biome provides unified linting and formatting with better performance

### Utility Libraries
- **Modern**: Prefer **es-toolkit** over lodash
- **Migration**: Actively replace lodash usage with es-toolkit or native ES methods
- **Rationale**: Smaller bundle size, better tree-shaking, modern JavaScript patterns

### Styling Framework
- **Target**: **Tailwind CSS v4** everywhere
- **Migration**: Update old projects to Tailwind v4
- **Config Management**: Carefully remove old configurations during updates
- **Testing**: Perform thorough testing after Tailwind config updates

## Framework Standards

### React Version Management
**CRITICAL**: React versions must be compatible with Expo SDK.

**Correct Versions (Expo SDK 53 compatible)**:
```json
{
  "resolutions": {
    "@types/react": "19.0.10",
    "react": "19.0.0", 
    "react-dom": "19.0.0"
  },
  "pnpm": {
    "overrides": {
      "react": "19.0.0",
      "react-dom": "19.0.0"
    }
  }
}
```

**Key Rules**:
- Use exact versions (19.0.0), never caret ranges (^19.0.0)
- Always verify with `apps/expo/package.json` before making changes
- Run `expo doctor` after React version changes

### Testing Standards

#### Vitest Native Assertions
Use native Vitest assertions instead of jest-dom for better compatibility:

```typescript
// ✅ Preferred - Native Vitest assertions
expect(element).toBeTruthy()                    // was: toBeInTheDocument()
expect(element?.textContent).toBe('text')       // was: toHaveTextContent('text')
expect(element?.disabled).toBe(true)            // was: toBeDisabled()
expect(element?.className).toContain('class')   // was: toHaveClass('class')
expect(element?.getAttribute('id')).toBe('123') // was: toHaveAttribute('id', '123')
```

#### Test Quality Requirements
- Never leave broken tests, builds, or failing linters
- All tests must pass before commits
- Maintain high test coverage for critical paths
- Write integration tests for complex interactions

## Code Quality Rules

### Commit Standards
- Use clear, descriptive commit messages
- Follow conventional commits format when applicable
- Never use Co-Authored-By trailer, AI, or claude or anything. This is forbidden.
- **Never commit as Claude or add Claude as author**

### Build and Deployment Rules
1. **Package Management**: If you change package.json, run `pnpm install` before committing
2. **Expo Compatibility**: Run `expo doctor` after changing resolutions or expo/package.json. You may flag and ignore because this tool sometimes is not working well.
3. **Submodules**: Never copy files between repositories - libs directory is a Git submodule
4. **Branch Workflow**: Never fix main branch directly unless hotfix - use PRs through dev branch

### Pull Request Standards

#### Progress Log Updates
**REQUIRED**: All PRs implementing ADR work must update the corresponding progress log:

- **ADR Implementation PRs**: Must update `ADR-XXX-_PROGRESS-LOG.md` with:
  - New progress entry dated with PR creation
  - Summary of changes implemented
  - Technical details and decisions made
  - Testing and validation completed
  - Any blockers or next steps identified

- **Documentation Consistency**: Progress logs must reflect actual implementation status
- **Status Accuracy**: Mark ADRs as "Completed" only when all phases are fully implemented
- **Cross-Repository Tracking**: Include propagation status to other repositories (prio-frontend, kedge-frontend)

**Example Progress Log Entry**:
```markdown
### 2025-07-05 - Feature Implementation (PR #46)
- ✅ **Component refactor completed** - Simplified chat interaction architecture
- ✅ **Testing validation** - All 873 tests passing, builds successful
- ✅ **Documentation updated** - ADR updated with architectural decisions
- 🔄 **Next steps**: Cross-repository propagation pending
```

### Code Organization and Readability

#### JSX Complexity Management
**Problem**: Deeply nested JSX with complex conditionals creates hard-to-read and TypeScript-unfriendly code.

**Solution**: Extract complex JSX blocks as properly memoized constants before the return statement.

```typescript
// ❌ Avoid: Complex nested JSX
return (
  <div>
    {hasResult && (
      <div>
        <div className="text-xs font-medium text-muted-foreground mb-2">Result:</div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded p-3 text-xs">
          {typeof part.result === 'string' ? (
            <div className="whitespace-pre-wrap">{part.result}</div>
          ) : (
            <pre className="whitespace-pre-wrap font-mono overflow-x-auto">
              {JSON.stringify(part.result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    )}
    {/* More complex nested JSX... */}
  </div>
)

// ✅ Preferred: Extract constants with proper memoization
const resultSection = useMemo(() => {
  if (!hasResult) return null
  
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground mb-2">Result:</div>
      <div className="bg-green-50 dark:bg-green-950/30 rounded p-3 text-xs">
        {typeof part.result === 'string' ? (
          <div className="whitespace-pre-wrap">{part.result}</div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono overflow-x-auto">
            {JSON.stringify(part.result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}, [hasResult, part.result])

const actionButtons = useMemo(() => {
  if (readonly) return null
  
  return (
    <div className="flex items-center gap-2 pt-2">
      {/* Button JSX */}
    </div>
  )
}, [readonly, currentStatus, enableRetry, hasResult, enableCopy])

return (
  <Card>
    <CardContent>
      {resultSection}
      {actionButtons}
    </CardContent>
  </Card>
)
```

**Benefits**:
- **Readability**: Main component logic is clear and declarative
- **Performance**: Proper memoization prevents unnecessary re-renders
- **Type Safety**: Avoids complex TypeScript inference issues with nested conditionals
- **Maintainability**: Each section can be understood and modified independently

#### React Performance Patterns

**useMemo Guidelines**:
- Use for expensive calculations or complex object creation
- Use for JSX sections that depend on specific props/state
- Always include proper dependency arrays

```typescript
// ✅ Expensive calculations
const expensiveValue = useMemo(() => {
  return complexCalculation(data)
}, [data])

// ✅ Complex JSX sections
const tableRows = useMemo(() => {
  return items.map(item => <TableRow key={item.id} item={item} />)
}, [items])
```

**useCallback Guidelines**:
- Use for event handlers passed to child components
- Use for functions passed as dependencies to other hooks
- Essential for preventing child component re-renders

```typescript
// ✅ Event handlers for child components
const handleItemClick = useCallback((itemId: string) => {
  onItemSelect(itemId)
}, [onItemSelect])

// ✅ Functions used in other hook dependencies
const validateForm = useCallback(() => {
  return formData.email && formData.password
}, [formData.email, formData.password])

useEffect(() => {
  if (validateForm()) {
    enableSubmit()
  }
}, [validateForm, enableSubmit])
```

**When NOT to use memoization**:
- Primitive values that change frequently
- Simple JSX that doesn't involve expensive operations
- Functions that don't get passed to children or other hooks

### General Code Organization
- Remove comments unless explicitly needed for complex business logic
- Follow existing code conventions and patterns
- Use existing libraries and utilities within the codebase
- Implement security best practices - never expose secrets or keys

## Multi-Repository Patterns

### Git Submodule Efficiency
**ALWAYS check Git submodule commit hashes before analyzing shared library differences**:

```bash
git submodule status
```

**If commit hashes are identical**:
- Skip ALL `diff` operations on `libs/` directories
- Focus on root-level configuration differences (package.json, vitest.config.ts, etc.)

**If commit hashes are different**:
- Then analyze `libs/` differences - different commits mean potentially meaningful differences

### Template-Derivative Architecture
This workspace follows a flexible bidirectional template-derivative architecture between repositories. Use the available Zondax commands for managing cross-repository synchronization and health checks.

## Version Management Strategy

### Node.js and Go Versions
- Update old projects to recent Node.js and Go versions
- Raise version compatibility issues for planning upgrade paths
- Maintain compatibility across the workspace

### Framework Updates
- Prioritize updates to modern versions of core frameworks
- Plan upgrades carefully to avoid breaking changes
- Test thoroughly after major version updates

## GitHub Actions and CI/CD

### Workflow Management
- Consider using templates from `zondax/_workflows` and `zondax/_actions`
- Suggest new workflows or actions from Zondax templates when appropriate
- Maintain consistency across repository CI/CD patterns

### Quality Gates
- All CI checks must pass before merging
- Address failing tests, build issues, and linting errors immediately
- Use automated quality checks to maintain code standards

## Architecture Principles

### Component Design
- Prefer composition over inheritance
- Use TypeScript strictly with proper type definitions
- Implement responsive design patterns consistently
- Follow accessibility best practices (WCAG 2.1 AA)

### Performance Standards
- Optimize bundle sizes through tree-shaking
- Use lazy loading for non-critical components
- Implement proper memoization for expensive operations
- Monitor and maintain performance benchmarks

### Security Standards
- Never commit secrets, API keys, or sensitive configuration
- Use environment variables for configuration
- Implement proper input validation and sanitization
- Follow secure coding practices for authentication and authorization

## Documentation Standards

### Code Documentation
- Write self-documenting code with clear naming conventions
- Add inline comments only for complex business logic
- Maintain up-to-date README files for project setup
- Document API interfaces and component props with TypeScript

### ADR Process
- Create ADRs for significant architectural decisions
- Follow the established ADR template format
- Update ADR status as decisions evolve
- Reference related ADRs for context

#### ADR Requirements and Standards
**Purpose**: ADRs document architectural decisions, not implementation guides
**Focus**: Why decisions were made, what alternatives were considered, trade-offs evaluated
**Structure**: Problem → Decision → Rationale → Consequences
**Scope**: Architectural choices that impact multiple components or long-term maintainability

**What Belongs in ADRs**:
- Technology selection rationale (CVA vs styled-components)
- Architectural patterns and their trade-offs
- Cross-cutting concerns and standards
- Breaking changes and migration strategies

**What Doesn't Belong in ADRs**:
- Detailed implementation tutorials
- Step-by-step coding guides
- Comprehensive API documentation
- Routine coding standards

**Minimal Code Examples Are Encouraged**:
- Brief examples that clarify architectural concepts
- Code snippets that show pattern differences between alternatives
- Simple before/after comparisons to illustrate decisions
- Interface examples that demonstrate API design choices

**ADR Template**:
```markdown
# ADR-XXX: [Decision Title]

**Status**: [Proposed|Active|Deprecated|Superseded]
**Date**: YYYY-MM-DD
**Decision Makers**: [Who made this decision]
**Consulted**: [Who was consulted]

## Problem Statement
What problem are we solving? What context led to this decision?

## Decision
What we decided to do (concise statement)

## Alternatives Considered
- Option A: [description, pros/cons]
- Option B: [description, pros/cons]
- Option C: [description, pros/cons]

## Rationale
Why this decision over alternatives? What factors influenced this choice?

## Consequences
- Positive: [benefits we expect]
- Negative: [costs/limitations we accept]
- Risks: [what could go wrong]

## Implementation Notes
High-level guidance, not detailed tutorials

## Related Decisions
Links to other ADRs that influenced or are influenced by this decision
```

## Enforcement and Compliance

### Automated Enforcement
- Use Biome for automatic code formatting and linting
- Configure pre-commit hooks for quality checks
- Set up CI/CD pipelines to enforce standards
- Use TypeScript strict mode for type safety

### Manual Review Process
- Code reviews must verify adherence to these guidelines
- Check for proper package management tool usage
- Verify React version compatibility in Expo projects
- Ensure proper branch workflow compliance

### Continuous Improvement
- Regularly review and update these guidelines
- Propose improvements based on project experience
- Share learnings across the development team
- Update tooling and processes as ecosystem evolves

## Migration Paths

### Existing Projects
1. **Package Manager**: Migrate npm/yarn projects to pnpm
2. **Linting**: Replace ESLint/Prettier with Biome v2
3. **Utilities**: Replace lodash with es-toolkit or native methods
4. **Styling**: Update to Tailwind CSS v4
5. **Testing**: Migrate jest-dom assertions to native Vitest

### Quality Assurance
- Test thoroughly after each migration step
- Maintain feature parity during migrations
- Update documentation to reflect changes
- Train team members on new tools and practices

---

*These guidelines are living standards that evolve with our development practices and ecosystem changes. All developers are expected to follow these standards and contribute to their improvement.*