# Prio Zustand Stores

This directory contains Zustand stores that wrap the mock data from `prio-mock-data.ts`. All data is now accessible through reactive stores that can be consumed throughout the application.

## Store Structure

### Individual Entity Stores
- `useParticipantsStore` - Manages participants/users
- `useGoalsStore` - Manages goals
- `useObjectivesStore` - Manages objectives
- `useChatChannelsStore` - Manages chat channels
- `useActivitiesStore` - Manages activity feed items
- `useTemplatesStore` - Manages templates for chats, missions, and objectives

### Composed Stores
- `useComposedStore` - Provides computed data and relationships between entities
- `useNavigationStore` - Handles navigation nodes and activity feed formatting

## Usage Examples

### Accessing Data

```typescript
import { useGoalsStore, useObjectivesStore, useComposedStore } from '@/app/(app)/prio/store'

// Get all active goals
const activeGoals = useGoalsStore(state => state.getActiveGoals())

// Get objectives for a specific goal
const objectives = useObjectivesStore(state => state.getObjectivesByGoal(goalId))

// Get detailed goal information with relationships
const goalDetail = useComposedStore(state => state.getGoalDetail(goalId))

// Get navigation nodes for sidebar
const navNodes = useNavigationStore(state => state.getNavigationNodes())
```

### Updating Data

```typescript
// Update goal progress
useGoalsStore.getState().updateGoalProgress(goalId, 75)

// Update objective status
useObjectivesStore.getState().updateObjectiveStatus(objectiveId, 'completed')

// Add a new activity
useActivitiesStore.getState().addActivity({
  id: 'activity-new',
  type: 'success',
  title: 'Task Completed',
  description: 'Finished implementation',
  timestamp: new Date(),
  userId: 'user-123',
  entityType: 'objective',
  entityId: 'objective-123'
})

// Archive a chat channel
useChatChannelsStore.getState().archiveChatChannel(channelId)
```

### Migration Guide

Replace static imports from mock data with store hooks:

```typescript
// Before
import { GOALS, getGoalDetail } from './prio-mock-data'
const goals = Object.values(GOALS)
const detail = getGoalDetail(id)

// After
import { useGoalsStore, useComposedStore } from '../store'
const goals = useGoalsStore(state => Object.values(state.goals))
const detail = useComposedStore(state => state.getGoalDetail(id))
```

### React Component Usage

```typescript
function GoalsList() {
  const activeGoals = useGoalsStore(state => state.getActiveGoals())
  const updateProgress = useGoalsStore(state => state.updateGoalProgress)

  return (
    <div>
      {activeGoals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.name}</h3>
          <button onClick={() => updateProgress(goal.id, goal.progress + 10)}>
            Increase Progress
          </button>
        </div>
      ))}
    </div>
  )
}
```

## Benefits

1. **Reactive Updates** - UI automatically updates when store data changes
2. **Centralized State** - Single source of truth for all prio data
3. **Type Safety** - Full TypeScript support with proper types
4. **DevTools Integration** - All stores are integrated with Redux DevTools
5. **Computed Values** - Composed stores provide derived data efficiently
6. **Easy Testing** - Stores can be easily mocked for testing

## Store Methods

Each store provides standard CRUD operations plus domain-specific queries:
- `get[Entity]` - Get single entity by ID
- `get[Entities]By[Property]` - Filter entities by property
- `add[Entity]` - Add new entity
- `update[Entity]` - Update existing entity
- `remove[Entity]` - Remove entity
- Domain-specific methods (e.g., `updateGoalProgress`, `archiveChatChannel`)