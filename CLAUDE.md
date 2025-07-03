# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: React & Expo Version Relationship

**React versions are tightly coupled with Expo SDK versions. NEVER change React versions without considering Expo compatibility:**

- **Expo SDK 53**: Requires React 19.0.0 exactly (not 19.1.0 or any other version)
- **React-dom**: Must match React version exactly to avoid version mismatch errors in tests
- **Breaking rule**: Updating React versions without checking Expo compatibility will break mobile builds

**Safe approach**:
1. Always check Expo SDK documentation before changing React versions
2. Use pnpm resolutions and overrides to force exact version matching:
   ```json
   "resolutions": {
     "react": "19.0.0",
     "react-dom": "19.0.0"
   },
   "pnpm": {
     "overrides": {
       "react": "19.0.0", 
       "react-dom": "19.0.0"
     }
   }
   ```
3. Test both web/extension AND expo builds after any dependency changes

## Project Overview

This is **prio-frontend**, a sophisticated multi-platform monorepo supporting web, mobile (Expo), browser extensions, and component documentation. The project uses pnpm workspaces and follows a strict quality-first development approach.

For details on how this project evolved from the original ks-frontend kickstarter, see [kickstarter-divergence.md](./kickstarter-divergence.md).

**Key Applications:**
- **apps/web** - Next.js 15 web application with App Router
- **apps/expo** - React Native mobile app (outside workspace due to bun hoisting issues)
- **apps/ext** - Multi-browser extension (Chrome/Firefox)
- **apps/storybook** - Component development environment

**Shared Libraries:**
- **libs/auth-*** - Modular authentication system (core, web, expo)
- **libs/stores** - Advanced gRPC-optimized Zustand state management
- **libs/ui-common** - Comprehensive React UI component library
- **libs/otel-web** - OpenTelemetry instrumentation

## Essential Commands

### Development
- `pnpm dev` or `pnpm dev:web` - Start web development server
- `pnpm dev:expo` - Start mobile development
- `pnpm dev:ext` - Start browser extension development
- `pnpm dev:storybook` - Start component development

### Production Build
- `pnpm build` - Build web and extension (core apps)
- `pnpm build:expo` - Build mobile application
- `pnpm build:storybook` - Build component documentation
- `pnpm ci:check` - Full CI pipeline (install, fix, build web/ext)
- `pnpm build:check` - Complete build validation including expo

### Quality Assurance (Critical)
- `pnpm fix` - Run linting and formatting (uses Biome, not ESLint)
- `pnpm test` - Run all tests across packages
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:watch` - Run tests in watch mode

### Environment Setup
- `pnpm env:init` or `pnpm init` - Initialize all environment files from GCP Secret Manager
- `pnpm env:init:web` - Initialize web app environment only
- `git submodule update --init --recursive` - Initialize Git submodules (web-golem library)

## Architecture Overview

### Multi-Platform Strategy
The monorepo shares core logic across platforms while maintaining platform-specific implementations:
- **Web**: Next.js with App Router, Server Components, and Auth.js
- **Mobile**: Expo with device attestation and native capabilities
- **Extension**: Multi-page architecture with background scripts and content injection
- **All platforms**: Share UI components, state management, and authentication core

### State Management Architecture
Uses advanced gRPC-optimized Zustand stores with:
- Optimistic updates and rollback mechanisms
- Streaming data support with real-time updates
- Pagination and infinite loading patterns
- Request cancellation and cleanup
- Type-safe gRPC integration with protobuf messages

### Authentication System
Modular architecture with:
- **auth-core**: Framework-agnostic authentication logic
- **auth-web**: Web-specific Auth.js integration
- **auth-expo**: Mobile-specific with device attestation

### Component Architecture
The UI system provides:
- Server Component safe exports via `@zondax/ui-common/server`
- Client Component exports via `@zondax/ui-common`
- Advanced components: virtualized tables, flow diagrams, contextual providers
- Full accessibility compliance and theme support

## Critical Development Patterns

### HTML Structure and Accessibility
**NEVER** nest interactive elements (buttons, links) inside other interactive elements:
```typescript
// ❌ Wrong - causes hydration errors and accessibility issues
<button onClick={handleSelect}>
  <span>Item content</span>
  <button onClick={handleAction}>Action</button> {/* INVALID */}
</button>

// ✅ Correct - use div with proper ARIA attributes
<div 
  role="button" 
  tabIndex={0}
  onClick={handleSelect}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect()
    }
  }}
>
  <span>Item content</span>
  <button onClick={(e) => {
    e.stopPropagation()
    handleAction()
  }}>Action</button>
</div>
```

### Server vs Client Components
**NEVER** import from `@zondax/ui-common` in React Server Components:
```typescript
// ✅ Server Components
import { cn } from '@zondax/ui-common/server'

// ✅ Client Components
import { Button } from '@zondax/ui-common'
```

### gRPC Store Usage
Always use proper request creators:
```typescript
// ✅ Correct
import { createActivityRequest } from '@mono-state/api/activity'
const request = createActivityRequest({ startDate, endDate })
store.setInput(request)

// ❌ Wrong - plain objects won't work
store.setInput({ startDate, endDate })
```

### Quality Validation Workflow
**ALWAYS** run the complete validation pipeline before considering work complete:
1. `pnpm fix` - Fix linting and formatting issues
2. `pnpm test` - Validate all unit and integration tests
3. `pnpm build` - Ensure production builds succeed
4. Different TypeScript strictness levels between test and build - both must pass

## Environment and Security

### Environment Management
- Uses GCP Secret Manager for secure environment variable storage
- Each app has dedicated secrets (mono-web-env, mono-expo-env, mono-ext-env)
- **NEVER** commit environment files or secrets to the repository
- Always run `pnpm env:init` after cloning or when environment changes

### Security Requirements
- All sensitive data must be stored in GCP Secret Manager
- Implement proper CORS and CSP policies for production
- Use Zod for input validation and schema enforcement
- Follow secure authentication patterns with proper token handling

## Technology Stack

### Primary Technologies
- **TypeScript** - Strict configuration with comprehensive type safety
- **React 19** - Pinned version with strict peer dependency resolutions
- **Next.js 15** - App Router with Server Components
- **Tailwind CSS v4** - Modern utility-first styling
- **pnpm** - Package manager with workspace support
- **Biome** - Linting and formatting (replaces ESLint)

### Key Preferences
- Use **es-toolkit** instead of lodash for utilities
- Use **Tailwind CSS v4** - avoid inline styles
- **No package alias mapping** - breaks in parent monorepos
- **Lefthook** for Git hooks with automatic quality checks

## Testing Strategy

### Test Framework
- **Vitest** (not Jest) for all testing with unified configuration
- Comprehensive test coverage for utilities, state management, and components
- **Never proceed with failing tests** - all tests must pass

### Test Types
- **Unit tests**: Individual components and utilities
- **Integration tests**: Store interactions and complex workflows
- **Component tests**: UI components with @testing-library/react
- **Visual tests**: Storybook stories for component documentation
- **Smoke tests**: Storybook story validation for quality assurance

## Package-Specific Guidance

### Mobile Development (apps/expo)
- **Outside monorepo workspace** due to bun hoisting compatibility issues
- Requires separate dependency management from root workspace
- Uses device attestation for enhanced security

### Browser Extension (apps/ext)
- Supports both Chrome and Firefox builds
- Multi-page architecture: popup, options, content scripts, background
- Special bundling requirements for web extension APIs

### State Management (libs/stores)
- Advanced gRPC integration with optimistic updates
- Pagination and streaming support for large datasets
- Comprehensive error handling and request cancellation
- Type-safe protobuf message handling

### UI Components (libs/ui-common)
- Dual export strategy for server/client component safety
- Virtualization utilities for performance with large datasets
- Full accessibility compliance and responsive design
- Storybook integration for component development

## Git Workflow

### Submodules
This project uses Git submodules for the web-golem library:
- Always run `git submodule update --init --recursive` after cloning
- Update submodules with `git submodule update --remote`

### Pre-commit Validation
Lefthook automatically runs quality checks on commit:
- Biome linting and formatting
- TypeScript type checking
- Test validation where applicable