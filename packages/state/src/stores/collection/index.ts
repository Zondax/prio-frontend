/**
 * This file re-exports the collection store functionality from separate modules for backward compatibility.
 * The implementation has been split into multiple files for better maintainability.
 */

export * from './collection'
export * from './types'
export * from './permissions'
export { createEventsCollectionsClient } from './client'
export { mergeCollectionOperations, handleCollectionResponse, getMergedCollections } from './utils'
export { createReadStore, createWriteStore } from './store'
