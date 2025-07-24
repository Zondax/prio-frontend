# Drilldown Navigation Guide: Connecting Two Views (A → B)

This guide shows how to define two views and connect them with navigation in the drilldown system.

## Quick Example: Categories → Products

Here's a complete example showing how to connect a Categories view (A) to a Products view (B):

```typescript
import { createDrilldown, useDrilldown } from '@zondax/ui-web/client'
import type { ViewDefinition, Context, ReactiveDataSubscription } from '@zondax/ui-web/server'

// Step 1: Define your data types
interface Category {
  id: string
  name: string
  description: string
}

interface Product {
  id: string
  name: string
  price: number
  categoryId: string
}

// Step 2: Create View A (Categories)
const categoriesView: ViewDefinition<Category> = {
  getData: (context: Context): ReactiveDataSubscription<Category> => ({
    subscribe: (handlers) => {
      // Your data fetching logic - can be from Zustand store, API, etc.
      const unsubscribe = yourCategoriesStore.subscribe(
        (state) => handlers.onData(state.categories),
        (state) => state.categories // Only re-run when categories change
      )
      
      // Initial data load
      handlers.onData(yourCategoriesStore.getState().categories)
      return unsubscribe
    }
  }),
  columns: [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Description', accessorKey: 'description' }
  ],
  onEnter: (_context, updateContext) => {
    // Set breadcrumb label when entering this view
    updateContext(ctx => ({ ...ctx, _breadcrumbLabel: 'Categories' }))
  }
}

// Step 3: Create View B (Products)
const productsView: ViewDefinition<Product> = {
  getData: (context: Context): ReactiveDataSubscription<Product> => ({
    subscribe: (handlers) => {
      const unsubscribe = yourProductsStore.subscribe(
        (state) => {
          // Filter products by selected category from context
          const filtered = state.products.filter(p => p.categoryId === context.selectedCategoryId)
          handlers.onData(filtered)
        },
        (state) => state.products
      )
      
      // Initial filtered data
      const filtered = yourProductsStore.getState().products.filter(
        p => p.categoryId === context.selectedCategoryId
      )
      handlers.onData(filtered)
      return unsubscribe
    }
  }),
  columns: [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Price', accessorKey: 'price' },
  ]
}

// Step 4: Build the drilldown flow
const drilldownFlow = createDrilldown()
  .views({
    categories: categoriesView,
    products: productsView
  })
  .navigation([
    {
      from: categoriesView,          // Navigate FROM categories view
      to: productsView,              // Navigate TO products view
      updateContext: (category, ctx) => ({
        ...ctx,
        selectedCategoryId: category.id,        // Pass selected category ID
        selectedCategoryName: category.name,    // Pass category name for breadcrumbs
        _breadcrumbLabel: category.name         // Set breadcrumb label
      })
    }
  ])
  .start(categoriesView)  // Start with categories view
  .build()

// Step 5: Use in your React component
function CatalogPage() {
  const { 
    data, 
    columns, 
    currentView, 
    context, 
    breadcrumbs, 
    actions, 
    loading, 
    error 
  } = useDrilldown(drilldownFlow)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {index > 0 && ' > '}
            <button onClick={crumb.onClick}>{crumb.label}</button>
          </span>
        ))}
      </div>

      {/* Data table */}
      <div className="space-y-2">
        {data.map(item => (
          <div 
            key={item.id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-50"
            onClick={() => actions.navigate(item)}
          >
            <h3>{item.name}</h3>
            {currentView === categoriesView && <p>{item.description}</p>}
            {currentView === productsView && <p>${item.price}</p>}
          </div>
        ))}
      </div>

      {/* Back button (shows when not on first view) */}
      {breadcrumbs.length > 1 && (
        <button onClick={actions.goBack}>← Back</button>
      )}
    </div>
  )
}
```

## Key Concepts

### 1. **View Definition** (`ViewDefinition<TData>`)
Each view defines:
- `getData()`: Reactive data subscription function
- `columns`: Table column definitions (optional for custom rendering)
- `onEnter()`: Called when navigating to this view (optional)

### 2. **Navigation Rules**
Defined in `.navigation()` array:
- `from`: Source view (where navigation starts)
- `to`: Target view (where navigation goes)
- `updateContext()`: Transform context when navigating (passes data between views)

### 3. **Context Flow**
Context carries data between views:
- Initial context set with `.start(view, context)`
- Updated via `updateContext()` function in navigation rules
- Used by `getData()` to filter/load data for each view

### 4. **Reactive Data**
Each view's `getData()` returns a subscription that:
- Calls `handlers.onData()` when data changes
- Returns cleanup function to unsubscribe
- Can be connected to Zustand stores, APIs, or any reactive data source

## Common Patterns

### Dynamic Destinations
```typescript
.navigation([{
  from: itemsView,
  to: (item, context) => {
    // Choose destination based on item properties
    return item.type === 'folder' ? foldersView : filesView
  },
  updateContext: (item, ctx) => ({ ...ctx, selectedId: item.id })
}])
```

### Multiple Navigation Paths
```typescript
.navigation([
  // Primary path: A → B
  { from: viewA, to: viewB, updateContext: (item, ctx) => ({ ...ctx, id: item.id }) },
  // Secondary path: A → C  
  { from: viewA, to: viewC, updateContext: (item, ctx) => ({ ...ctx, type: item.type }) },
  // Chain: B → D
  { from: viewB, to: viewD, updateContext: (item, ctx) => ({ ...ctx, detailId: item.id }) }
])
```

### Alternative Routes (Keyboard Shortcuts)
```typescript
.alternatives([{
  from: categoriesView,
  to: adminView,
  label: "Admin Panel",
  key: "a",  // Press 'a' to navigate
  when: (item, context) => context.userRole === 'admin'
}])
```

That's it! The navigation between View A and View B is defined in the `.navigation()` array, and the context flows automatically through the `updateContext` function.