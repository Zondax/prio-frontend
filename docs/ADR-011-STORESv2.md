commit 7e27207bf50c3acc9d37d12c6eb780079c64450e
Author: Juan Leni <juan.leni@zondax.ch>
Date:   Tue Jul 22 23:51:43 2025 +0200

    Enhances store patterns and adds streaming support (#79)
    
    * refactor: rename gRPC store builders and add streaming preferences support
    
    * refactor: migrate stores from legacy optimistic to new realtime implementation
    
    * docs: consolidate store builders and simplify realtime data patterns
    
    * fix: update hasPendingWrites check to use method call instead of size property
    
    * chore: remove unused file
    
    * wip
    
    * wip
    
    * wip
    
    * refactor: implement non-blocking writes and optimistic updates with stream synchronization
    
    * fix: handle undefined getPendingOperations method in optimistic store example
    
    * Fixes breadcrumb key and updates libs
    
    Fixes a bug where the breadcrumb key was not unique, causing potential rendering issues.
    
    Updates the libs subproject to the latest version.
    
    * refactor: standardize store API by renaming hasPendingWrites to hasPendingUpdates and removing getData method
    
    * feat: implement hierarchical data navigation with reactive single store pattern
    
    * feat: implement hierarchical data store with reactive drilldown views
    
    * feat: add error handling and type safety to drilldown store implementation

diff --git a/docs/ADR-011-STORESv2.md b/docs/ADR-011-STORESv2.md
new file mode 100644
index 0000000..459397d
--- /dev/null
+++ b/docs/ADR-011-STORESv2.md
@@ -0,0 +1,819 @@
+# ADR-011: Stores v2 - Testing Strategy for Optimistic and Streaming Updates
+
+**Status**: Proposed  
+**Date**: 2025-01-22  
+**Author**: Architecture Team
+
+## Context
+
+Our current store implementations lack proper testing for critical features, particularly around optimistic updates and streaming data synchronization. This has led to regressions and poor user experience, especially in scenarios with rapid user input.
+
+### Current State
+
+1. **No regression tests**: Progressive features are added without tests to prevent regressions
+2. **No tests exist for**:
+   - `createRealtimeStore` composer
+   - Optimistic updates middleware
+   - Streaming functionality
+   - Integration between optimistic updates and streaming
+3. **Optimistic updates not working**: The feature exists but doesn't actually show optimistic data to users
+4. **Streaming conflicts**: Stream updates overwrite user input without proper reconciliation
+5. **No corner case coverage**: Edge cases like rapid typing, network delays, and disconnections are untested
+6. **No example pages**: Missing clear demonstrations of how features should work
+7. **Confusing naming**: `data` property and `getData()` method return identical values (both return server state)
+
+### Real-World Problems
+
+In the `/dev/grpc` example:
+- Users experience lag when typing (no optimistic updates)
+- Characters are lost when typing quickly
+- UI reverts to old values when stream updates arrive
+- No clear indication of what's local vs remote state
+
+### Existing Test Patterns
+
+Good test patterns exist in the codebase for other middleware:
+- `loading-states.test.ts` - Shows proper test structure
+- `grpc-integration.test.ts` - Demonstrates mocking and edge cases
+- `error-handling.test.ts` - Error scenario testing
+
+However, none of these test the actual optimistic update functionality.
+
+## Decision Drivers
+
+- **Testing First**: Need comprehensive tests before implementing features
+- **Clear Naming**: Prevent confusion between local and remote state
+- **React Compatibility**: Use properties instead of functions for proper re-rendering
+- **Backward Compatibility**: Allow gradual migration without breaking existing code
+- **Error Handling**: Proper rollback and error state management
+
+## Decision
+
+Use reactive properties with clear naming conventions and comprehensive tests:
+- Remove `getData()` function entirely (it serves no purpose if `data` exists)
+- Use `data` as alias to `localData` for backward compatibility
+- `localData` for optimistic state, `remoteData` for server state
+- All state exposed as properties for React compatibility
+
+## Technical Constraints - Zustand Reactivity
+
+### Critical Finding: Getter Properties are NOT Reactive
+
+Our testing revealed a fundamental constraint in Zustand: **getter properties do not trigger React re-renders**. This significantly impacts our design decisions.
+
+#### Test Results
+```typescript
+// This pattern DOES NOT WORK for reactivity:
+const useStore = create((set, get) => ({
+  firstName: 'John',
+  lastName: 'Doe',
+  
+  // Getter - NOT reactive!
+  get fullName() {
+    return `${get().firstName} ${get().lastName}`
+  }
+}))
+
+// In component:
+const fullName = useStore(state => state.fullName) // ❌ Won't update when firstName changes
+```
+
+Our `computed-reactivity.test.ts` confirms this limitation - all tests using getter properties failed to trigger re-renders when underlying state changed.
+
+### Implications for Our Design
+
+1. **Cannot use computed getters** for optimistic data
+2. **Must maintain properties** through explicit updates
+3. **Need synchronization** at multiple points in the code
+
+## Selector Patterns vs Property Updates
+
+### When to Use Selectors
+
+Selectors are the Zustand-native way to compute derived values reactively:
+
+```typescript
+// ✅ Component-specific derived state
+const hasUnsavedChanges = useStore(state => 
+  state.localData !== state.remoteData
+)
+
+// ✅ Custom transformations
+const displayName = useStore(state => 
+  state.data?.name?.toUpperCase() || 'Anonymous'
+)
+```
+
+### When NOT to Use Selectors
+
+Selectors cannot solve internal store consistency:
+- Store methods need current optimistic state
+- Middleware needs to see optimistic data
+- Stream handlers must preserve optimistic updates
+
+### Hybrid Approach
+
+We combine both patterns for optimal results:
+
+1. **Store maintains** `data` property with optimistic updates
+2. **Components can use** direct property access or selectors
+3. **Helper hooks** encapsulate common selector patterns
+
+## Store Interface Design
+
+### Internal State Structure
+
+```typescript
+interface InternalStoreState<T> {
+  // Internal state (not directly accessed)
+  _serverData: T | null      // Raw server state
+  _optimisticData: T | null   // Pending optimistic update
+  
+  // Public properties (manually synchronized)
+  data: T | null              // Current view (optimistic or server)
+  remoteData: T | null        // Always matches _serverData
+  
+  // Computed via selectors or manual updates
+  hasPendingUpdates: boolean
+  syncStatus: 'synced' | 'pending' | 'error'
+}
+```
+
+### Why Properties Instead of Getters
+
+Due to Zustand's reactivity model:
+```typescript
+// ❌ This doesn't trigger re-renders:
+get data() {
+  return this._optimisticData ?? this._serverData
+}
+
+// ✅ This works with React:
+data: null  // Updated manually at each state change
+```
+
+## Store Variants
+
+We have three main store patterns:
+
+### 1. Simple Store (grpcSingleMethodStore)
+**Purpose**: Basic request/response pattern with a single gRPC method  
+**Distinguishing Features**:
+- Single method that can send input and receive output
+- `setInput()` to prepare request data
+- `read()` or `execute()` to send request and get response
+- Basic loading and error states
+- Response caching support
+- No optimistic updates
+
+**Testing Requirements**:
+- Initial state correctness
+- Input parameter changes and validation
+- Loading state transitions during operations
+- Error handling and state persistence
+- Response caching and invalidation
+- Input changes trigger new requests
+
+### 2. Realtime Store (createRealtimeStore)
+**Purpose**: Request/response with optimistic updates and optional streaming  
+**Distinguishing Features**:
+- Can be configured with or without streaming
+- Without streaming: Like Simple Store but with optimistic updates
+- With streaming: Adds real-time data synchronization
+- `write()` operation shows immediate UI updates
+- Local vs remote data distinction
+- Automatic reconciliation of optimistic and server state
+
+**Testing Requirements**:
+- All Simple Store tests must still pass
+- Immediate UI updates (optimistic behavior)
+- Write confirmation updates both local and remote
+- Error rollback restores previous state
+- Multiple pending writes handled correctly
+- If streaming enabled:
+  - Stream doesn't overwrite pending optimistic updates
+  - Proper reconciliation when stream catches up
+  - Connection/disconnection handling
+  - Reconnection preserves pending updates
+
+### 3. Entity Store (createEntityStore)
+**Purpose**: Manages collections of items with individual CRUD operations  
+**Distinguishing Features**:
+- Built on top of Realtime Store
+- Multiple entities with unique IDs
+- Add, update, delete operations per entity
+- Optimistic updates per entity
+- Batch operations
+- Can include pagination for large collections
+
+**Testing Requirements**:
+- All Realtime Store tests must still pass
+- Individual entity optimistic updates
+- Batch operation atomicity
+- Entity ordering and filtering
+- Concurrent updates to different entities
+- Deletion with rollback
+- Collection state consistency
+
+## Synchronization Points
+
+Since we cannot use reactive getters, we must manually update the `data` property at every state transition. Missing any synchronization point will cause the UI to show stale data.
+
+### Required Update Points
+
+#### 1. Apply Optimistic Update
+```typescript
+applyOptimisticUpdate: (operation, optimisticData, originalData) => {
+  const operationId = generateId()
+  
+  set(state => ({
+    ...state,
+    _optimisticData: optimisticData,
+    data: optimisticData,  // ← Must update here
+    hasPendingUpdates: true,
+    syncStatus: 'pending'
+  }))
+  
+  return operationId
+}
+```
+
+#### 2. Commit Update (Success)
+```typescript
+commitOptimisticUpdate: (operationId, confirmedData) => {
+  set(state => ({
+    ...state,
+    _serverData: confirmedData,
+    _optimisticData: null,
+    data: confirmedData,  // ← Must update here
+    remoteData: confirmedData,
+    hasPendingUpdates: false,
+    syncStatus: 'synced'
+  }))
+}
+```
+
+#### 3. Rollback Update (Failure)
+```typescript
+rollbackOptimisticUpdate: (operationId) => {
+  set(state => ({
+    ...state,
+    _optimisticData: null,
+    data: state._serverData,  // ← Must revert here
+    hasPendingUpdates: false,
+    syncStatus: 'error'
+  }))
+}
+```
+
+#### 4. Stream Data Handler
+```typescript
+handleStreamData: (streamData) => {
+  set(state => {
+    // Update server data
+    const newState = {
+      ...state,
+      _serverData: streamData,
+      remoteData: streamData
+    }
+    
+    // Preserve optimistic updates if any
+    if (state._optimisticData) {
+      // Keep showing optimistic data
+      newState.data = state._optimisticData
+    } else {
+      // No optimistic updates, show stream data
+      newState.data = streamData  // ← Must update here
+    }
+    
+    return newState
+  })
+}
+```
+
+#### 5. Error Recovery
+```typescript
+handleWriteError: (error) => {
+  set(state => ({
+    ...state,
+    _optimisticData: null,
+    data: state._serverData,  // ← Revert to last known good
+    writeError: error,
+    syncStatus: 'error'
+  }))
+}
+```
+
+### Synchronization Complexity
+
+This manual synchronization is error-prone because:
+1. Easy to miss an update point
+2. Logic must be duplicated across handlers
+3. Testing all paths is complex
+4. Race conditions between updates
+
+However, it's necessary due to Zustand's reactivity constraints.
+
+## Testing Requirements by Store Type
+
+### Core Behaviors to Test
+
+#### State Management
+- Initial state is clean and predictable
+- State transitions are atomic and consistent
+- No memory leaks or stale references
+- Proper cleanup on unmount
+
+#### Data Flow
+- User input immediately reflected in UI (optimistic updates)
+- Server responses properly reconciled
+- Error states don't corrupt data
+- Loading states accurately reflect operations
+
+#### Error Handling
+- Network errors trigger appropriate retry logic
+- Server rejections rollback optimistic changes
+- Error messages are actionable for users
+- Recovery leaves store in consistent state
+
+#### Performance
+- Rapid updates don't cause lag or dropped input
+- Debouncing/throttling works as expected
+- Large datasets don't cause memory issues
+- Streaming doesn't overwhelm the UI
+
+### Progressive Testing Strategy
+
+Each store type must:
+1. Pass all tests from simpler store types it extends
+2. Add new tests for its unique features
+3. Verify interactions between inherited and new features
+
+### Critical Scenarios
+
+#### Rapid Typing Test
+**Purpose**: Ensure no characters are lost during fast input  
+**Key Aspects**:
+- Every keystroke appears immediately in UI
+- Debouncing doesn't drop characters
+- Final state matches all input
+- Network requests are optimized (not one per keystroke)
+
+#### Network Instability Test
+**Purpose**: Handle real-world connection issues  
+**Key Aspects**:
+- Offline changes are queued
+- Reconnection resumes where it left off
+- No duplicate submissions
+- User sees clear feedback about sync status
+
+#### Concurrent Updates Test
+**Purpose**: Handle multiple sources of truth  
+**Key Aspects**:
+- Local changes take precedence until confirmed
+- Stream updates don't overwrite pending changes
+- Reconciliation is predictable
+- No flickering or jarring UI updates
+
+#### Error Recovery Test
+**Purpose**: Graceful handling of failures  
+**Key Aspects**:
+- Failed writes rollback cleanly
+- Error state is temporary, not permanent
+- Retry logic has backoff
+- User can manually retry or cancel
+
+### Testing Strategy
+
+#### Unit Tests
+- **Do mock external dependencies** (gRPC clients, network calls)
+- **Do test individual middleware in isolation**
+- **Do verify state transformations**
+- **Focus on**: Pure logic, state updates, error handling
+
+#### Integration Tests
+- **Use real store instances** with minimal mocking
+- **Test actual async behavior** and timing
+- **Verify component interactions**
+- **Focus on**: Data flow, user scenarios, edge cases
+
+#### New Test Requirements
+1. **Non-blocking writes**: Verify UI remains responsive during writes
+2. **Echo detection**: Test stream data matching with pending operations
+3. **Operation queue**: Verify proper cleanup and status tracking
+4. **Reconciliation**: Test data priority (optimistic > stream > server)
+
+#### Common Pitfalls
+1. **Don't test private methods** - Test through public API
+2. **Don't over-specify** - Allow implementation flexibility
+3. **Don't ignore flaky tests** - They indicate real issues
+4. **Don't skip difficult scenarios** - They're often the most important
+
+## Example Pages Requirements
+
+### /dev/grpc - Optimistic Updates Demo
+Should demonstrate:
+- Immediate UI updates when typing
+- Visual indicators for pending saves (yellow border)
+- Success confirmation (green flash)
+- Error states (red border with message)
+- Show both `localData` and `remoteData` for debugging
+
+### /dev/stream - Streaming + Optimistic Demo
+Should demonstrate:
+- Real-time streaming updates
+- How optimistic updates work with streaming
+- Connection status indicators
+- Pending update counters
+- Reconciliation visualization
+
+### Visual Feedback (Examples Only)
+The stores provide state properties, UI decides presentation:
+```typescript
+function OptimisticInput({ value, onChange, syncStatus }) {
+  return (
+    <Input
+      value={value}
+      onChange={onChange}
+      className={cn(
+        syncStatus === 'pending' && 'border-yellow-500',
+        syncStatus === 'error' && 'border-red-500',
+        syncStatus === 'synced' && 'border-green-500'
+      )}
+    />
+  )
+}
+```
+
+## Migration Strategy
+
+### Phase 1: Fix Current Store (Immediate)
+1. Wire `data` property to return optimistic data (not server state)
+2. Remove `getData()` function entirely - redundant with `data` property
+3. Add all reactive properties (localData, remoteData, etc.)
+4. Add comprehensive tests for all scenarios
+
+### Phase 2: Update All Consumers
+```typescript
+// Before
+const data = store.getData()
+
+// After
+const { data } = store
+// or for explicit clarity:
+const { localData, remoteData } = store
+```
+
+### Phase 3: Documentation and Examples
+1. Update all documentation to use properties
+2. Create example pages showing the new patterns
+3. Add visual feedback examples using reactive properties
+
+## Helper Hooks Pattern
+
+To mitigate the complexity of manual property synchronization and provide better developer experience, we'll create helper hooks that encapsulate common selector patterns:
+
+### Basic Helper Hooks
+
+```typescript
+// libs/stores/src/hooks/useOptimisticState.ts
+export function useOptimisticState<T>(store: RealtimeStore<any, T, any>) {
+  return {
+    // Direct property access (fastest)
+    data: store.data,
+    remoteData: store.remoteData,
+    
+    // Computed via selectors
+    hasChanges: useStore(store, state => state.data !== state.remoteData),
+    syncStatus: store.syncStatus,
+    pendingCount: useStore(store, state => state.pendingOperations?.length ?? 0),
+  }
+}
+
+// Usage in components
+function UserPreferences() {
+  const { data, hasChanges, syncStatus } = useOptimisticState(usePreferencesStore())
+  
+  return (
+    <Input 
+      value={data?.theme ?? ''}
+      className={syncStatus === 'pending' ? 'border-yellow-500' : ''}
+    />
+  )
+}
+```
+
+### Advanced Helper Hooks
+
+```typescript
+// For debugging and development
+export function useOptimisticDebug<T>(store: RealtimeStore<any, T, any>) {
+  return {
+    localData: store.data,
+    remoteData: store.remoteData,
+    pendingUpdates: useStore(store, state => state.getPendingOptimisticUpdates?.() ?? []),
+    lastSync: useStore(store, state => state.lastStreamUpdate),
+    connectionStatus: store.streamStatus,
+  }
+}
+
+// For form integration
+export function useOptimisticForm<T>(store: RealtimeStore<any, T, any>) {
+  const [localValue, setLocalValue] = useState(store.data)
+  const [isDirty, setIsDirty] = useState(false)
+  
+  const handleChange = useCallback((value: T) => {
+    setLocalValue(value)
+    setIsDirty(true)
+  }, [])
+  
+  const handleSave = useCallback(async () => {
+    if (isDirty && localValue) {
+      await store.write(localValue)
+      setIsDirty(false)
+    }
+  }, [isDirty, localValue, store])
+  
+  const handleReset = useCallback(() => {
+    setLocalValue(store.data)
+    setIsDirty(false)
+  }, [store.data])
+  
+  return {
+    value: localValue ?? store.data,
+    isDirty,
+    isSaving: store.isLoading('write'),
+    onChange: handleChange,
+    onSave: handleSave,
+    onReset: handleReset,
+  }
+}
+```
+
+### Benefits of Helper Hooks
+
+1. **Encapsulation**: Complex selector logic hidden from components
+2. **Type Safety**: Full TypeScript support with generics
+3. **Performance**: Optimized selectors prevent unnecessary re-renders
+4. **Consistency**: Standard patterns across the codebase
+5. **Migration Path**: Easy to adopt incrementally
+
+## Implementation Approach
+
+### Phase 1: Fix Core Store Behavior (Immediate)
+
+1. **Update `data` property** to return optimistic state:
+   ```typescript
+   // In createRealtimeStore.ts
+   write: async (input: TInput) => {
+     const operationId = state.applyOptimisticUpdate?.('write', input, state.data)
+     
+     // Update data immediately with optimistic value
+     set(state => ({ ...state, data: input }))
+     
+     try {
+       const result = await config.write(client, state.clientParams, input)
+       // Success path...
+     } catch (error) {
+       // Rollback to server state
+       set(state => ({ ...state, data: state._serverData }))
+       throw error
+     }
+   }
+   ```
+
+2. **Fix stream handler** to preserve optimistic updates:
+   ```typescript
+   streamInfo.stream.on('data', (data: TStreamData) => {
+     set((state) => {
+       const transformedData = config.stream?.transformData ? 
+         config.stream.transformData(data) : data as TInput
+       
+       return {
+         ...state,
+         streamData: data,
+         _serverData: transformedData,
+         remoteData: transformedData,
+         // Only update data if no pending optimistic updates
+         data: state._optimisticData ?? transformedData,
+         lastStreamUpdate: Date.now(),
+       }
+     })
+   })
+   ```
+
+3. **Add reactive properties** alongside existing interface:
+   ```typescript
+   interface RealtimeSlice {
+     // Existing
+     data: TInput | null
+     getData: () => TInput | null  // Deprecate
+     
+     // New reactive properties
+     localData: TInput | null      // Alias to data
+     remoteData: TInput | null     // Server state
+     syncStatus: 'synced' | 'pending' | 'error'
+     hasPendingUpdates: boolean
+   }
+   ```
+
+### Phase 2: Update Middleware Integration
+
+1. **Enhance optimistic updates middleware** to maintain data consistency:
+   ```typescript
+   applyOptimisticUpdate: (operation, optimisticData, originalData) => {
+     const operationId = generateId()
+     
+     set(state => ({
+       ...state,
+       _optimisticData: optimisticData,
+       data: optimisticData,  // Critical: Update data property
+       hasPendingUpdates: true,
+       syncStatus: 'pending',
+       optimisticUpdates: new Map([...state.optimisticUpdates, [operationId, {...}]])
+     }))
+     
+     return operationId
+   }
+   ```
+
+### Phase 3: Testing Strategy
+
+1. **Write comprehensive tests** before making changes
+2. **Test categories**:
+   - Unit tests for store behavior
+   - Integration tests for middleware interaction
+   - E2E tests for user scenarios
+   - Performance tests for rapid updates
+
+### Phase 4: Migration and Documentation
+
+1. **Create migration guide** with clear examples
+2. **Update all example pages** to demonstrate new patterns
+3. **Add deprecation warnings** for getData()
+4. **Document helper hooks** and best practices
+
+### Test Organization
+```
+libs/stores/src/
+├── composers/
+│   ├── createRealtimeStore.test.ts      // Core functionality
+│   ├── optimistic-behavior.test.ts      // Optimistic updates
+│   └── streaming-integration.test.ts    // Stream + optimistic
+├── middleware/
+│   └── optimistic-updates.test.ts       // Middleware isolation
+├── hooks/
+│   ├── useOptimisticState.ts           // Helper implementation
+│   └── useOptimisticState.test.ts      // Helper tests
+└── integration/
+    ├── rapid-typing.test.ts             // Performance scenarios
+    └── network-conditions.test.ts       // Network edge cases
+```
+
+## Consequences
+
+### Positive
+- ✅ Immediate fix for optimistic updates - UI becomes responsive
+- ✅ Backward compatible - existing code continues to work
+- ✅ Clear naming - localData vs remoteData eliminates confusion
+- ✅ Comprehensive tests - prevent future regressions
+- ✅ React-friendly - properties trigger re-renders correctly
+- ✅ Helper hooks - encapsulate complexity for developers
+- ✅ Performance improvement - no more waiting for server responses
+
+### Negative
+- ❌ Manual synchronization - must update `data` at every state change
+- ❌ Error-prone - easy to miss a synchronization point
+- ❌ Increased complexity - more internal state to manage
+- ❌ Testing burden - need extensive tests for all sync points
+- ❌ Migration effort - all consumers need updates eventually
+- ❌ Zustand limitation - cannot use computed getters as hoped
+
+### Technical Debt
+- 🔧 Cannot use elegant getter pattern due to Zustand constraints
+- 🔧 Synchronization logic duplicated across multiple handlers
+- 🔧 Risk of state inconsistency if sync points are missed
+- 🔧 Helper hooks add another abstraction layer
+
+### Neutral
+- Properties and functions coexist during migration period
+- Developers must understand local vs remote state concepts
+- Performance characteristics change (better for users, more complex for devs)
+- Testing becomes more critical but also more comprehensive
+
+## References
+
+- [Current createRealtimeStore implementation](../libs/stores/src/composers/createRealtimeStore.ts)
+- [Optimistic Updates Middleware](../libs/stores/src/middleware/optimistic-updates.ts) 
+- [Example Implementation Issues](/dev/grpc)
+- [Streaming Example](/dev/stream)
+- [Existing Test Patterns](../libs/stores/src/middleware/loading-states.test.ts)
+
+## Non-Blocking Operations Pattern
+
+### The UI Blocking Problem
+When using `await write()` in event handlers, the UI becomes unresponsive:
+```typescript
+// ❌ Blocks UI for entire duration of server call
+const handleChange = async (value) => {
+  await write(value)  // UI frozen until server responds (3+ seconds)
+  showSuccess()
+}
+```
+
+### Non-Blocking Solution
+The write operation now returns immediately, allowing the UI to remain responsive:
+```typescript
+// ✅ UI stays responsive
+const handleChange = (value) => {
+  write(value)
+    .then(() => {
+      // Promise resolves immediately
+      // Monitor syncStatus for real completion
+    })
+}
+```
+
+## Stream Echo Detection
+
+### The Problem
+When using optimistic updates with streaming:
+1. User makes a change (optimistic update applied)
+2. Change is sent to server
+3. Server broadcasts the change to all clients (including us)
+4. We receive our own change as a stream update
+5. Without detection, we might overwrite pending optimistic updates
+
+### Echo Detection Heuristic
+We implement a time-window based echo detection:
+
+```typescript
+interface OptimisticOperation<T> {
+  id: string
+  timestamp: number
+  localData: T
+  dataSignature: string  // For comparison
+}
+
+// When stream data arrives:
+1. Check all pending operations within 5-second window
+2. Compare data signatures (JSON stringification)
+3. If match found → mark operation as "committed" (echo)
+4. If no match → external update (preserve optimistic state)
+```
+
+### Benefits
+- Our optimistic updates aren't overwritten by our own echoes
+- External updates are still applied when no optimistic updates are pending
+- Clean operation lifecycle: pending → committed/rolled_back
+
+## Operation Queue Management
+
+### Helper Functions Architecture
+Instead of middleware, we use helper functions integrated directly in the store:
+
+```typescript
+// libs/stores/src/helpers/optimistic-operations.ts
+- createOperation(): Create tracked operation
+- detectEcho(): Compare stream data with pending ops
+- reconcileData(): Determine what data to show
+- cleanupOperations(): Remove old operations
+- updateOperationStatus(): Track operation lifecycle
+```
+
+### Integration Points
+1. **Write operation**: Creates operation, applies optimistic update
+2. **Stream handler**: Detects echoes, reconciles data
+3. **Error handler**: Rolls back failed operations
+4. **Success handler**: Marks operations as committed
+
+## Summary
+
+### The Core Problem
+Optimistic updates exist in our codebase but don't work because:
+1. The `data` property returns server state, not optimistic state
+2. Streaming overwrites optimistic updates
+3. No tests exist to catch these issues
+4. **NEW**: Write operations block the UI during server calls
+
+### The Zustand Constraint
+We discovered that Zustand getter properties are NOT reactive in React components. This forces us to manually synchronize the `data` property at every state transition point rather than using an elegant computed getter.
+
+### The Solution
+Despite the Zustand limitation, we will:
+1. **Immediately** fix the store to return optimistic data in the `data` property
+2. **Manually synchronize** the data property at all state transitions
+3. **Add comprehensive tests** to ensure synchronization is never broken
+4. **Create helper hooks** to encapsulate selector complexity
+5. **Provide clear examples** showing the improved user experience
+6. **NEW**: Implement non-blocking writes for responsive UI
+7. **NEW**: Add stream echo detection to prevent overwrites
+8. **NEW**: Use helper functions instead of middleware for flexibility
+
+### Implementation Priority
+1. **Fix the bug** - Make optimistic updates actually work (Phase 1)
+2. **Add tests** - Prevent regression of this critical feature
+3. **Document patterns** - Help developers use the feature correctly
+4. **Gradual migration** - Move to clearer property names over time
+
+This approach acknowledges the technical constraints while delivering immediate value to users who are experiencing laggy interfaces. The manual synchronization is not ideal, but it's a necessary trade-off given Zustand's reactivity model.
\ No newline at end of file
