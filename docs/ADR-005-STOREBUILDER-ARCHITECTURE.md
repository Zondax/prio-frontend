# ADR-005: StoreBuilder Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: Backend Team, Frontend Team  

## Problem Statement

As we build complex frontend applications with varying data patterns (CRUD operations, real-time streams, optimistic updates, pagination), we need a state management system that can:

1. **Handle diverse data patterns**: Simple requests, streaming data, optimistic updates, pagination
2. **Provide type safety**: Prevent runtime errors through comprehensive TypeScript integration
3. **Manage complexity**: Abstract gRPC complexity while maintaining flexibility
4. **Ensure reliability**: Handle race conditions, cancellation, retries, and error scenarios
5. **Optimize performance**: Minimize unnecessary re-renders, duplicate requests, and memory leaks
6. **Enable testability**: Support comprehensive testing patterns
7. **Scale across applications**: Consistent patterns across multiple frontend projects

The decision point: How do we create a state management architecture that provides powerful abstractions without sacrificing flexibility or performance?

## Decision

**Builder Pattern State Management**: Specialized store builders on top of Zustand with type-safe abstractions for different data interaction patterns.

### Core Architecture
- **Base store foundation**: Common functionality shared across all store types
- **Specialized builders**: Purpose-built stores for specific interaction patterns
- **Type-safe interfaces**: Comprehensive TypeScript integration with generic builders
- **Zustand foundation**: Leveraging Zustand's performance and simplicity
- **gRPC integration**: First-class support for gRPC communication patterns

### Store Builder Types
```typescript
// Simple request-response operations
createSimpleStore<TClientParams, TClient, TInput, TOutput>()

// Read/write with optimistic updates + optional streaming
createRealtimeStore<TClientParams, TClient, TInput, TOutput, TStreamData>()

// Entity collections with CRUD operations
createEntityStore<TEntity, TCreateInput, TUpdateInput>()

// List management (frontend-only, simplified)
createListStore<TItem>()

// Backend-driven list management with server-side filtering/sorting
createBackendListStore<TClientParams, TClient, TItem, TFilter>()

// Caching with LRU/TTL strategies
createCacheStore<TKey, TValue>()
```

## Alternatives Considered

### Option A: Raw Zustand Stores
**Pros**: Simple, minimal abstraction, direct control
**Cons**: Repetitive patterns, no standardized error handling, poor gRPC integration
**Verdict**: Rejected - leads to inconsistent patterns and duplicate code

### Option B: Redux Toolkit Query (RTK Query)
**Pros**: Mature ecosystem, caching, normalized state
**Cons**: Heavy bundle size, Redux complexity, poor gRPC support, learning curve
**Verdict**: Rejected - too heavy for our needs, poor gRPC integration

### Option C: React Query/TanStack Query
**Pros**: Excellent caching, background updates, optimistic updates
**Cons**: HTTP-focused, limited gRPC support, additional dependency
**Verdict**: Rejected - gRPC integration challenges, prefer Zustand simplicity

### Option D: Custom Hook-Based Solution
**Pros**: React-native, simple to understand, no additional dependencies
**Cons**: No global state, poor performance, testing complexity
**Verdict**: Rejected - doesn't scale with application complexity

### Option E: Apollo Client (for GraphQL)
**Pros**: Mature, comprehensive feature set, optimistic updates
**Cons**: GraphQL-only, large bundle, not suitable for gRPC
**Verdict**: Rejected - technology mismatch with gRPC backend

## Rationale

### Why Builder Pattern + Zustand?

**Builder Pattern Benefits**:
- **Abstraction without Magic**: Clear, predictable patterns for common use cases
- **Type Safety**: Generic builders provide compile-time guarantees
- **Extensibility**: Easy to add new patterns without breaking existing code
- **Consistency**: Standardized patterns across all applications

**Zustand Selection**:
- **Performance**: Minimal re-renders, subscription-based updates
- **Simplicity**: No boilerplate, easy to understand and debug
- **Bundle Size**: Lightweight compared to alternatives
- **Flexibility**: Works well with custom abstractions

**gRPC Integration**:
- **First-Class Support**: Built specifically for gRPC communication patterns
- **Streaming Support**: Native handling of server-sent streams
- **Type Generation**: Works seamlessly with generated TypeScript types

### Architecture Benefits

**Developer Experience**: Consistent APIs across different data patterns
**Type Safety**: Compile-time prevention of common state management bugs
**Performance**: Optimized for minimal re-renders and efficient updates
**Reliability**: Built-in handling of edge cases, retries, and cancellation
**Testability**: Comprehensive mocking and testing utilities

## Consequences

### Positive
- **Rapid Development**: Standardized patterns accelerate feature development
- **Consistent UX**: Predictable loading states, error handling, and optimistic updates
- **Type Safety**: Prevents runtime errors through comprehensive TypeScript
- **Performance**: Optimized re-rendering and request deduplication
- **Maintainability**: Clear patterns make code easier to understand and modify
- **Reliability**: Built-in retry logic, cancellation, and error recovery

### Negative
- **Learning Curve**: Developers need to understand builder patterns and abstractions
- **Abstraction Cost**: Some flexibility is traded for consistency
- **Bundle Size**: Additional abstraction layer adds to bundle size

### Risks
- **Over-Abstraction**: Risk of creating too complex abstractions for simple needs
- **Zustand Changes**: Core dependency changes could require significant updates
- **Performance**: Complex state logic could impact performance if not managed carefully

## Implementation Notes

### Store Builder Patterns

**Simple Store** (Request/Response Operations):
```typescript
export const useProductStore = createSimpleStore<
  GrpcConfig,
  ProductServiceClient,
  GetProductRequest,
  Product
>({
  createClient: createProductServiceClient,
  method: (client, params, input) => client.getProduct(input),
})

// Usage
const { data, isLoading, hasError, execute } = useProductStore()
```

**Realtime Store** (Read/Write with Optional Streaming):
```typescript
// Basic read/write
export const usePreferencesStore = createRealtimeStore({
  createClient: createUserServiceClient,
  read: (client, params) => client.readPreferences(),
  write: (client, params, input) => client.writePreferences(input),
})

// With streaming support
export const useStreamingPreferencesStore = createRealtimeStore({
  createClient: createUserServiceClient,
  write: (client, params, input) => client.writePreferences(input),
  stream: {
    start: (client, params) => {
      const stream = client.streamPreferences()
      return { stream, cancel: () => stream.cancel() }
    },
    transformData: (streamData) => streamData.preferences
  }
})

// Usage  
const { data, write, isLoading, connect, disconnect, streamStatus } = usePreferencesStore()
```

**Backend List Store** (Scalable List Management):
```typescript
export const useTeamListStore = createGrpcListStore({
  createClient: createTeamServiceClient,
  method: searchTeams,
  createRequest: (queryParams) => {
    const request = new SearchTeamsRequest()
    if (queryParams.pageRequest) {
      request.setPageRequest(queryParams.pageRequest)
    }
    return request
  },
  extractItems: (response) => response.getTeamsList(),
  itemIdExtractor: (team) => team.getId(),
})

// Usage with backend filtering/sorting
const teams = useTeamListStore()
teams.updateQueryParams({ 
  pageRequest: createPageRequest({ sort: { kind: 'name', orderAscending: true } })
})
teams.fetchItems()
```

**Entity Store** (CRUD Operations):
```typescript
export const useUserStore = createEntityStore<User, CreateUserInput, UpdateUserInput>({
  name: 'Users',
  operations: {
    create: { endpoint: createUser },
    read: { endpoint: getUser },
    update: { endpoint: updateUser },
    delete: { endpoint: deleteUser },
    list: { endpoint: listUsers }
  }
})

// Usage
const { entities, create, update, delete: deleteUser, getById } = useUserStore()
```

**Realtime Store with Streaming** (Optimistic Updates + Real-time):
```typescript
export const useChatStore = createRealtimeStore({
  createClient: createChatServiceClient,
  write: (client, params, message) => client.sendMessage(message),
  stream: {
    start: (client) => {
      const stream = client.streamMessages()
      return { stream, cancel: () => stream.cancel() }
    }
  }
})

// Usage - unified read/write + streaming
const chat = useChatStore()
await chat.write(newMessage) // Optimistic update + send to server
chat.connect() // Start real-time stream
const { data, streamStatus, hasPendingWrites } = chat
```

### Configuration and Extension

**Retry Configuration**:
```typescript
export const retryConfig: {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
} = {
  maxAttempts: 3,
  initialDelay: 300,
  maxDelay: 5000,
  backoffMultiplier: 2
}
```

**Error Handling**:
```typescript
import type { Code as GrpcCode } from '@grpc/grpc-js'

interface StoreError {
  message: string
  code?: GrpcCode  // Aligned with canonical gRPC status codes
  retryable: boolean
  timestamp: number
}
```

**Performance Features**:
- Request deduplication
- Automatic cancellation on unmount
- Debounced operations
- Optimistic updates with rollback

### Quality Standards

**Type Safety Requirements**:
- All store builders must use TypeScript generics
- Public APIs must be fully typed
- No `any` types in store interfaces

**Testing Standards**:
- Mock client utilities for all store types
- Integration tests for complex flows
- Performance tests for large datasets
- Error scenario testing

**Performance Guidelines**:
- Minimize store subscriptions
- Use selectors for derived state
- Implement proper cleanup in effects
- Monitor re-render frequency

## Evolution and Consolidation

### Store Consolidation (2025-01)

Based on usage patterns and maintenance concerns, we consolidated overlapping stores:

**Deprecated Stores**:
- `createGrpcSingleMethodStore` → Migrated to `createSimpleStore`
- `createOptimisticStore` → Replaced by `createRealtimeStore`
- `createGrpcStreamOptimisticStore` → Replaced by `createRealtimeStore` with stream config
- `createPageableStore` → Replaced by `createBackendListStore`
- `createStreamStore` → Replaced by `createRealtimeStore` with stream config

This consolidation:
- Reduced codebase by ~1000 lines (removed 4 redundant stores)
- Unified APIs for real-time data patterns
- Replaced frontend filtering with scalable backend queries
- Simplified the learning curve from 9+ stores to 6 core composers
- Maintained backward compatibility through migration guides

### Current Store Landscape

| Store Type | Use Case | Key Features |
|------------|----------|---------------|
| `createSimpleStore` | API calls, operations | Boolean states, minimal overhead |
| `createRealtimeStore` | Data with updates | Optimistic updates, optional streaming |
| `createEntityStore` | Collections | Full CRUD, relationships |
| `createListStore` | Simple lists | Frontend-only management |
| `createBackendListStore` | Large datasets | Backend filtering, sorting, pagination |
| `createCacheStore` | Expensive data | LRU, TTL strategies |

## Future Considerations

### Planned Enhancements
- **Global State Sync**: Cross-store state coordination
- **Offline-First**: Built-in offline support with sync
- **DevTools**: Enhanced debugging and time-travel
- **Performance Monitoring**: Built-in metrics dashboard

### Ecosystem Evolution
- **React Native**: Mobile-optimized store patterns
- **Server Components**: RSC-compatible stores
- **Concurrent Rendering**: Optimized for React 18+
- **Cross-Tab Sync**: Real-time state synchronization

## Related Decisions

- **ADR-003**: Styling architecture influences store state for UI components
- **ADR-001**: Chat components drive real-time store requirements
- **ADR-000**: TypeScript standards inform store type safety
- **Future ADR**: API layer standardization will affect store client patterns

---

*This StoreBuilder architecture provides a scalable, type-safe foundation for state management across all Zondax frontend applications. The builder pattern balances abstraction with flexibility while ensuring consistent, reliable data management patterns.*