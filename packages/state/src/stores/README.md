# Entity Store Builder Documentation

## Overview

The Entity Store Builder is a powerful, generalized system for creating type-safe, feature-rich entity stores with minimal boilerplate. It provides a unified architecture for managing entities with CRUD operations, list management, optimistic updates, bulk operations, and custom business logic.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Configuration](#configuration)
- [Operations](#operations)
- [Features](#features)
- [Plugins](#plugins)
- [Examples](#examples)
- [Migration Guide](#migration-guide)
- [API Reference](#api-reference)

## Quick Start

### 1. Define Your Entity Types

```typescript
// api/user.types.ts
export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  name: string
  email: string
  role?: string
}

export interface UpdateUserRequest {
  userId: string
  name?: string
  email?: string
  role?: string
}

export interface DeleteUserRequest {
  userId: string
}
```

### 2. Create Your Entity Store

```typescript
// stores/user-entity-store.ts
import { 
  createEntityStore, 
  EntityOperation, 
  optimisticUpdatesPlugin, 
  bulkOperationsPlugin 
} from '@zondax/stores'

export const useUserEntityStore = createEntityStore({
  createClient: createUserClient,
  operations: {
    [EntityOperation.READ]: {
      input: {} as GetUserRequest,
      output: {} as User,
      affectsLists: false,
      optimistic: false,
    },
    [EntityOperation.CREATE]: {
      input: {} as CreateUserRequest,
      output: {} as User,
      affectsLists: true,
      listUpdateStrategy: 'add',
      optimistic: true,
    },
    [EntityOperation.UPDATE]: {
      input: {} as UpdateUserRequest,
      output: {} as User,
      affectsLists: true,
      listUpdateStrategy: 'update',
      optimistic: true,
    },
    [EntityOperation.DELETE]: {
      input: {} as DeleteUserRequest,
      output: {} as StandardResponse,
      affectsLists: true,
      listUpdateStrategy: 'remove',
      optimistic: true,
    },
    [EntityOperation.SEARCH]: {
      input: {} as UserListFilters,
      output: {} as UserListResponse,
      affectsLists: false,
      optimistic: false,
    },
  },
  operationHandlers: userOperationHandlers,
  features: {
    optimisticUpdates: true,
    bulkOperations: true,
    listSync: true,
    caching: true,
    retryLogic: true,
  },
  plugins: [
    optimisticUpdatesPlugin(),
    bulkOperationsPlugin(),
  ],
})
```

### 3. Use in Components

```typescript
// components/UserManager.tsx
import { useUserCreate, useUserList, useUserBulkOperations } from '../stores/user-entity-store'

export function UserManager() {
  const { create, loading: createLoading } = useUserCreate()
  const { data: users, hasMore, loadNextPage } = useUserList({ role: 'admin' })
  const { bulkDelete } = useUserBulkOperations()

  const handleCreateUser = async () => {
    await create({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin'
    })
  }

  return (
    <div>
      <button onClick={handleCreateUser} disabled={createLoading}>
        Create User
      </button>
      
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
      
      {hasMore && (
        <button onClick={() => loadNextPage()}>
          Load More
        </button>
      )}
    </div>
  )
}
```

## Core Concepts

### Entity Operations

The system is built around a set of configurable operations:

```typescript
export enum EntityOperation {
  // Standard CRUD
  READ = 'read',
  CREATE = 'create', 
  UPDATE = 'update',
  DELETE = 'delete',
  
  // List operations
  SEARCH = 'search',
  FILTER = 'filter',
  
  // Custom operations
  ARCHIVE = 'archive',
  PIN = 'pin',
  LOCK = 'lock',
  
  // Bulk operations
  BULK_CREATE = 'bulk_create',
  BULK_UPDATE = 'bulk_update',
  BULK_DELETE = 'bulk_delete',
}
```

### Dynamic API Generation

The builder automatically generates clean, type-safe methods based on your operation configuration:

```typescript
// These methods are generated automatically:
store.create(data)     // EntityOperation.CREATE
store.read(id)         // EntityOperation.READ  
store.update(data)     // EntityOperation.UPDATE
store.delete(id)       // EntityOperation.DELETE
store.search(filters)  // EntityOperation.SEARCH
store.archive(id)      // EntityOperation.ARCHIVE
```

### List Synchronization

Entity changes automatically update relevant cached lists:

```typescript
// When you create a user, it's automatically added to matching lists
await store.create({ name: 'John', role: 'admin' })
// Lists with filters that match this user are updated automatically

// Update strategies:
// - 'add': Add entity to matching lists
// - 'update': Update entity in all lists where it exists
// - 'remove': Remove entity from all lists
// - 'refresh': Invalidate and reload all affected lists
```

## Configuration

### Operation Configuration

Each operation is configured with input/output types and behavior:

```typescript
type MyOperationMap = {
  [EntityOperation.CREATE]: {
    input: CreateRequest           // Input type
    output: Entity                // Output type  
    affectsLists: true           // Whether this affects cached lists
    listUpdateStrategy: 'add'    // How to update lists
    optimistic: true             // Enable optimistic updates
    retryable: true             // Enable retry logic
  }
}
```

### Features Configuration

Enable/disable store features:

```typescript
const features: EntityStoreFeatures = {
  optimisticUpdates: true,    // Enable optimistic updates with rollback
  bulkOperations: true,       // Enable bulk operation support
  listSync: true,            // Enable automatic list synchronization
  caching: true,             // Enable entity caching
  retryLogic: true,          // Enable automatic retries
}
```

### List Configuration

Configure list behavior and filtering:

```typescript
const listConfig: EntityListConfig<Entity, Filters> = {
  defaultPageSize: 20,
  maxCachedLists: 10,
  entityMatchesFilters: (entity, filters) => {
    // Custom logic to determine if entity matches filters
    if (filters.role && entity.role !== filters.role) return false
    if (filters.search && !entity.name.includes(filters.search)) return false
    return true
  }
}
```

## Operations

### Standard CRUD Operations

```typescript
// Read individual entity
const { user, loading, error, read } = useUserRead('user-123')
await read({ userId: 'user-123' })

// Create new entity
const { create, loading, error } = useUserCreate()
const newUser = await create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: 'member'
})

// Update existing entity
const { update, loading, error } = useUserUpdate()
const updatedUser = await update({
  userId: 'user-123',
  name: 'Jane Smith'
})

// Delete entity
const { delete: deleteUser, loading, error } = useUserDelete()
await deleteUser({ userId: 'user-123' })
```

### List Operations

```typescript
// Get paginated list with filters
const { data, metadata, loading, error, hasMore, loadNextPage } = useUserList({
  role: 'admin',
  search: 'john',
  sortBy: 'name',
  sortOrder: 'asc'
})

// Load next page
await loadNextPage()

// Search with new filters
await search({ role: 'member' })

// Invalidate cached list
invalidate()
```

### Custom Operations

Define domain-specific operations:

```typescript
// Thread-specific operations
const { lock, unlock, pin, unpin } = useThreadManagement()

await lock('thread-123')
await pin('thread-456')

// Participant role management
const { promote, demote, assignRole, suspend } = useParticipantRoleManagement()

await promote('participant-123')
await assignRole('participant-456', 'moderator')
await suspend('participant-789', 'Violation of rules')
```

### Bulk Operations

Process multiple entities efficiently:

```typescript
const { bulkCreate, bulkUpdate, bulkDelete, bulkExecute } = useBulkOperations()

// Bulk create multiple entities
await bulkCreate([
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' },
  { name: 'User 3', email: 'user3@example.com' }
])

// Bulk update with different operations
const operations = [
  { operation: EntityOperation.UPDATE, input: { userId: '1', name: 'Updated 1' } },
  { operation: EntityOperation.DELETE, input: { userId: '2' } },
  { operation: 'PROMOTE', input: { participantId: '3' } }
]
const results = await bulkExecute(operations)

// Process results
results.forEach(result => {
  if (result.success) {
    console.log('Operation succeeded:', result.result)
  } else {
    console.error('Operation failed:', result.error)
  }
})
```

## Features

### Optimistic Updates

Automatically applied for operations marked as optimistic:

```typescript
// Configure optimistic updates
{
  [EntityOperation.UPDATE]: {
    optimistic: true,  // Enable optimistic updates
    // ...
  }
}

// Usage - UI updates immediately, rolls back on error
const { update } = useUserUpdate()
await update({ userId: '123', name: 'New Name' })  // UI updates instantly

// Monitor optimistic updates
const { getOptimisticUpdates, isOptimisticUpdate } = useOptimistic()
const optimisticUpdates = getOptimisticUpdates()
const isOptimistic = isOptimisticUpdate('user-123')
```

### Caching & Performance

- **Entity Caching**: Individual entities cached by ID
- **List Caching**: Lists cached by serialized filter key
- **Automatic Invalidation**: Smart cache invalidation on mutations
- **Memory Management**: Configurable cache limits

```typescript
// Cache management
const { invalidateEntity, invalidateList, clearCache } = useUserStore()

invalidateEntity('user-123')           // Remove specific entity
invalidateList({ role: 'admin' })      // Remove specific list
clearCache()                           // Clear all caches
```

### Error Handling & Retries

Built-in retry logic with exponential backoff:

```typescript
// Automatic retries for failed operations
// Configurable retry policies per operation type
// Graceful error handling with user feedback

const { error, loading, retry } = useUserCreate()

if (error) {
  console.error('Create failed:', error.message)
  // Optionally retry manually
  await retry()
}
```

## Plugins

### Built-in Plugins

#### Optimistic Updates Plugin

```typescript
import { optimisticUpdatesPlugin } from '@zondax/stores'

// Provides methods:
const { 
  getOptimisticUpdates,     // Get all pending optimistic updates
  isOptimisticUpdate,       // Check if entity is optimistically updated
  cancelOptimisticUpdate    // Cancel specific optimistic update
} = useOptimistic()
```

#### Bulk Operations Plugin

```typescript
import { bulkOperationsPlugin } from '@zondax/stores'

// Provides methods:
const { 
  bulkExecute               // Execute multiple operations in parallel
} = useBulkOperations()
```

#### Real-time Sync Plugin

```typescript
import { realTimeSyncPlugin } from '@zondax/stores'

// Provides methods:
const { 
  subscribeToEntity,        // Subscribe to entity changes
  subscribeToList          // Subscribe to list changes
} = useRealTimeSync()
```

### Custom Plugins

Create your own plugins:

```typescript
const myCustomPlugin = <TEntity, TListFilters, TListMetadata>(): EntityStorePlugin<TEntity, TListFilters, TListMetadata> => {
  return (context) => {
    const { store, config, utils } = context
    
    return {
      // Add custom methods to the store
      customMethod: (input: any) => {
        // Custom logic here
        return utils.executeOperation('CUSTOM_OP', input)
      },
      
      // Override existing methods
      create: async (input: any) => {
        console.log('Custom create logic')
        return store.create(input)
      }
    }
  }
}

// Use in store configuration
export const useMyEntityStore = createEntityStore({
  // ... other config
  plugins: [
    optimisticUpdatesPlugin(),
    bulkOperationsPlugin(),
    myCustomPlugin(),
  ]
})
```

## Examples

### Bookmark Management

```typescript
// Complete bookmark store with tagging
export const useBookmarkEntityStore = createEntityStore({
  createClient: createBookmarkClient,
  operations: {
    [EntityOperation.CREATE]: {
      input: {} as CreateBookmarkRequest,
      output: {} as ConversationBookmark,
      affectsLists: true,
      listUpdateStrategy: 'add',
      optimistic: true,
    },
    // ... other operations
  },
  operationHandlers: bookmarkOperationHandlers,
  features: {
    optimisticUpdates: true,
    bulkOperations: true,
    listSync: true,
  },
  listConfig: {
    entityMatchesFilters: (bookmark, filters) => {
      if (filters.conversationId && bookmark.conversationId !== filters.conversationId) return false
      if (filters.query) {
        const query = filters.query.toLowerCase()
        return bookmark.name.toLowerCase().includes(query) ||
               bookmark.description?.toLowerCase().includes(query) ||
               bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      }
      return true
    }
  },
  plugins: [optimisticUpdatesPlugin(), bulkOperationsPlugin()],
})

// Usage
const { create } = useBookmarkCreate()
const { data: bookmarks } = useBookmarkList({ conversationId: 'conv-123' })
const { bulkDelete } = useBookmarkBulkOperations()
```

### Thread Management with Moderation

```typescript
// Thread store with moderation features
export const useThreadEntityStore = createEntityStore({
  operations: {
    // Standard operations
    [EntityOperation.CREATE]: { /* ... */ },
    [EntityOperation.UPDATE]: { /* ... */ },
    
    // Custom moderation operations
    [EntityOperation.LOCK]: {
      input: {} as { threadId: string },
      output: {} as Thread,
      affectsLists: true,
      listUpdateStrategy: 'update',
      optimistic: true,
    },
    [EntityOperation.PIN]: { /* ... */ },
    
    // Bulk moderation
    [EntityOperation.BULK_UPDATE]: {
      input: {} as BulkThreadRequest,
      output: {} as StandardResponse,
      affectsLists: true,
      listUpdateStrategy: 'refresh',
      bulk: true,
    },
  },
  // ... rest of config
})

// Advanced usage
const { lock, unlock, pin, unpin } = useThreadModeration()
const { bulkLock, bulkPin } = useThreadBulkOperations()

// Moderate multiple threads
await bulkLock(['thread-1', 'thread-2', 'thread-3'])
await bulkPin(['thread-4', 'thread-5'])
```

### Participant Role Management

```typescript
// Participant store with role hierarchy
export const useParticipantEntityStore = createEntityStore({
  operations: {
    // Role management operations
    'PROMOTE': {
      input: {} as { participantId: string },
      output: {} as Participant,
      affectsLists: true,
      listUpdateStrategy: 'update',
      optimistic: true,
    },
    'ASSIGN_ROLE': { /* ... */ },
    'SUSPEND': { /* ... */ },
  },
  customBehaviors: {
    beforeOperation: async (operation, input) => {
      // Validate role assignments
      if (operation === 'ASSIGN_ROLE') {
        const validRoles = ['member', 'moderator', 'admin', 'owner']
        if (!validRoles.includes(input.role)) {
          throw new Error(`Invalid role: ${input.role}`)
        }
      }
      return input
    },
    afterOperation: async (operation, result, input) => {
      // Audit log for role changes
      if (['PROMOTE', 'DEMOTE', 'ASSIGN_ROLE'].includes(operation)) {
        console.log('Role change audit:', {
          operation,
          participantId: input.participantId,
          newRole: result.role,
          timestamp: new Date().toISOString()
        })
      }
    }
  }
})

// Advanced role management
const { promote, demote, assignRole } = useParticipantRoleManagement()
const { canPromote, getNextRole } = useParticipantManagement()

// Smart role operations
if (canPromote(participant.role)) {
  await promote(participant.id)
}

const nextRole = getNextRole(participant.role, 'up')
await assignRole(participant.id, nextRole)
```

## Migration Guide

### From Old Store to Entity Store

#### Before (Old Manual Store):

```typescript
// Old manual store - 400+ lines
export const useBookmarkStore = create<BookmarkStore>()(
  subscribeWithSelector((set, get) => ({
    // Lots of boilerplate state
    bookmarks: new Map(),
    individualLoading: new Map(),
    individualErrors: new Map(),
    lists: new Map(),
    // ... 50+ lines of state

    // Manual CRUD operations  
    createBookmark: async (request) => {
      // 30+ lines of loading/error/cache management
      set({ individualLoading: new Map(individualLoading).set('create', true) })
      try {
        const bookmark = await createBookmark(client, config, request)
        set({ 
          bookmarks: new Map(bookmarks).set(bookmark.id, bookmark),
          individualLoading: new Map(individualLoading).set('create', false)
        })
        // Manual list sync
        addBookmarkToLists(bookmark)
        return bookmark
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set('create', false),
          individualErrors: new Map(individualErrors).set('create', error)
        })
        throw error
      }
    },
    
    // ... repeat for update, delete, list operations
    // ... 200+ more lines of repetitive code
  }))
)
```

#### After (Entity Store Builder):

```typescript
// New entity store - 50 lines, more features
export const useBookmarkEntityStore = createEntityStore({
  createClient: createBookmarkClient,
  operations: {
    [EntityOperation.CREATE]: {
      input: {} as CreateBookmarkRequest,
      output: {} as ConversationBookmark,
      affectsLists: true,
      listUpdateStrategy: 'add',
      optimistic: true,  // New feature!
    },
    // ... other operations
  },
  operationHandlers: bookmarkOperationHandlers,
  features: {
    optimisticUpdates: true,     // Automatic optimistic updates
    bulkOperations: true,        // Bulk operations support  
    listSync: true,             // Automatic list sync
    caching: true,              // Smart caching
    retryLogic: true,           // Automatic retries
  },
  plugins: [
    optimisticUpdatesPlugin(),   // Plugin-based features
    bulkOperationsPlugin(),
  ]
})

// Clean, generated hooks
const { create } = useBookmarkCreate()        // Auto-generated
const { bulkCreate } = useBookmarkBulkOperations()  // From plugin
const { isOptimisticUpdate } = useBookmarkOptimistic() // From plugin
```

### Migration Steps

1. **Create Operation Map**: Define your operations and their configurations
2. **Create Operation Handlers**: Map operations to API calls
3. **Configure Features**: Enable desired features (optimistic, bulk, etc.)
4. **Add Plugins**: Include relevant plugins
5. **Update Components**: Replace old hooks with new generated ones
6. **Test & Validate**: Ensure all functionality works correctly

### Benefits of Migration

- **90% Less Code**: From 400+ lines to 50 lines
- **More Features**: Optimistic updates, bulk operations, plugins
- **Better Performance**: Smart caching, list sync, retries
- **Type Safety**: Full TypeScript support throughout
- **Consistency**: All entity stores follow same patterns
- **Maintainability**: Single source of truth for store logic

## API Reference

### Core Functions

#### `createEntityStore(config)`

Creates a new entity store with the provided configuration.

**Parameters:**
- `config: EntityStoreConfig` - Store configuration object

**Returns:**
- Store instance with generated methods and state

#### `EntityStoreConfig`

Configuration object for creating entity stores.

```typescript
interface EntityStoreConfig<TEntity, TOperationMap, TListFilters, TListMetadata, TClientParams, TClient> {
  createClient: (params: TClientParams) => TClient
  operations: TOperationMap
  operationHandlers: OperationHandlers<TOperationMap, TClient, TClientParams>
  features?: EntityStoreFeatures
  listConfig?: EntityListConfig<TEntity, TListFilters>
  customBehaviors?: EntityCustomBehaviors<TEntity>
  plugins?: EntityStorePlugin<TEntity, TListFilters, TListMetadata>[]
}
```

### Store State

Every entity store includes:

```typescript
interface EntityStoreState<TEntity, TListFilters, TListMetadata> {
  // Entity cache
  entities: Map<string, TEntity>
  
  // List caches
  lists: Map<string, TEntity[]>
  listMetadata: Map<string, TListMetadata>
  listCursors: Map<string, string>
  
  // Loading states
  loading: Map<EntityOperation, boolean>
  errors: Map<EntityOperation, Error | null>
  listLoading: Map<string, boolean>
  listErrors: Map<string, Error | null>
  
  // Optimistic updates
  optimisticUpdates: Map<string, { operation: EntityOperation; originalData?: any }>
  
  // Client configuration
  clientConfig: any
  client: any
  
  // Metrics
  metrics: {
    operationCounts: Map<EntityOperation, number>
    lastOperation: EntityOperation | null
    lastOperationTime: number | null
  }
}
```

### Store Actions

Generated actions based on configured operations:

```typescript
interface EntityStoreActions<TEntity, TListFilters, TListMetadata> {
  // Configuration
  setClientConfig: (config: any) => void
  
  // Dynamic operation methods (generated at runtime)
  [operationName: string]: (input: any) => Promise<any>
  
  // List utilities
  getList: (filters: TListFilters) => ListResult<TEntity, TListMetadata>
  loadNextPage: (filters: TListFilters) => Promise<void>
  
  // Cache management
  invalidateList: (filters: TListFilters) => void
  invalidateEntity: (entityId: string) => void
  clearCache: () => void
  
  // Utility functions
  getListKey: (filters: TListFilters) => string
  addToMatchingLists: (entity: TEntity) => void
  updateInAllLists: (entity: TEntity) => void
  removeFromAllLists: (entityId: string) => void
}
```

### Generated Hooks

For each configured operation, the following hooks are automatically available:

```typescript
// Individual operations
const use{Entity}Read = (id: string) => ({ entity, loading, error, read })
const use{Entity}Create = () => ({ loading, error, create })
const use{Entity}Update = () => ({ loading, error, update })
const use{Entity}Delete = () => ({ loading, error, delete })

// List operations  
const use{Entity}List = (filters) => ({ data, metadata, loading, error, hasMore, loadNextPage, search, invalidate })

// Plugin-provided hooks
const use{Entity}BulkOperations = () => ({ bulkExecute, bulkCreate, bulkUpdate, bulkDelete })
const use{Entity}Optimistic = () => ({ getOptimisticUpdates, isOptimisticUpdate, cancelOptimisticUpdate })

// Configuration
const use{Entity}Config = () => ({ setClientConfig, clientConfig })
```

## Best Practices

### Operation Design

1. **Keep operations atomic**: Each operation should do one thing well
2. **Use proper list strategies**: Choose appropriate `listUpdateStrategy`
3. **Enable optimistic updates carefully**: Only for operations that rarely fail
4. **Design for bulk operations**: Consider bulk variants for scalability

### Performance

1. **Configure cache limits**: Set appropriate `maxCachedLists`
2. **Use appropriate page sizes**: Balance UX and performance
3. **Leverage optimistic updates**: For better perceived performance
4. **Monitor metrics**: Use built-in metrics for optimization

### Error Handling

1. **Implement proper retry logic**: Configure retryable operations
2. **Provide user feedback**: Use loading and error states
3. **Handle optimistic rollbacks**: Inform users when operations fail
4. **Log errors appropriately**: Use custom behaviors for audit trails

### Type Safety

1. **Define strict types**: Use proper TypeScript interfaces
2. **Leverage type inference**: Let the builder infer types where possible
3. **Validate inputs**: Use custom behaviors for validation
4. **Test type safety**: Ensure generated hooks are properly typed

---

The Entity Store Builder provides a powerful, flexible foundation for managing entity state in React applications. It reduces boilerplate, increases consistency, and provides advanced features out of the box while maintaining full type safety and customization options.