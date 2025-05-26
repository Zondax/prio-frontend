'use client'

import { createGetCollectionPermissionsRequest, useCollectionPermissionsStore, useCollectionsStore } from '@prio-state'
import { useEndpointStore } from '@prio-state/stores'
import { EventCollection, type EventCollectionPermission, EventCollectionVisibilityType } from '@prio-state/stores/collection'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import {
  AlertTriangle,
  ChevronDown,
  Edit,
  Eye,
  EyeOff,
  Link,
  Link2Off,
  Loader2,
  PenLine,
  Plus,
  RefreshCcw,
  Shield,
  ShieldCheck,
  Trash,
  UserCircle,
  UserPlus,
  UserX,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'

export default function CollectionsPage() {
  const {
    getData,
    metadata,
    isLoading,
    error,
    setParams,
    loadNextPage,
    hasReachedEnd,
    createCollection,
    updateExistingCollection,
    removeCollection,
    isWriting,
    setInput,
  } = useCollectionsStore()

  const {
    setCollectionPermission,
    removeCollectionPermission,
    isLoading: isPermissionsLoading,
    error: permissionsError,
    setParams: setPermissionsParams,
    data: permissionsData,
    setInput: setPermissionsInput,
  } = useCollectionPermissionsStore()

  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)
  // Setup params for permissions store too
  useGrpcSetup(setPermissionsParams, selectedEndpoint)

  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newVisibility, setNewVisibility] = useState(EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString())

  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editVisibility, setEditVisibility] = useState('')
  const [editId, setEditId] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showJsonView, setShowJsonView] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Permissions state
  const [permissionsCollectionId, setPermissionsCollectionId] = useState('')
  const [permissionsCollectionName, setPermissionsCollectionName] = useState('')
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
  const [newPermissionUserId, setNewPermissionUserId] = useState('')
  const [newPermissionLevel, setNewPermissionLevel] = useState('1') // Default to read permission

  const handleCreateCollection = async () => {
    try {
      await createCollection(newName, {
        description: newDescription,
        visibility: Number.parseInt(newVisibility),
      })

      // Reset form state
      setNewName('')
      setNewDescription('')
      setNewVisibility(EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString())

      // Close the dialog
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating collection:', error)
    }
  }

  const openEditDialog = (collection: EventCollection) => {
    setEditId(collection.getId())
    setEditName(collection.getName())
    setEditDescription(collection.getDescription())
    setEditVisibility(collection.getVisibility().toString())
    setIsEditOpen(true)
  }

  const handleUpdateCollection = () => {
    updateExistingCollection(editId, {
      name: editName,
      description: editDescription,
      visibility: Number.parseInt(editVisibility),
    })
    setIsEditOpen(false)
  }

  const openPermissionsDialog = async (collection: EventCollection) => {
    const collectionId = collection.getId()
    setPermissionsCollectionId(collectionId)
    setPermissionsCollectionName(collection.getName())

    setPermissionsInput(createGetCollectionPermissionsRequest(collectionId))

    setIsPermissionsOpen(true)
  }

  const handleAddPermission = async () => {
    if (!newPermissionUserId || !permissionsCollectionId) return

    try {
      await setCollectionPermission(permissionsCollectionId, newPermissionUserId, Number.parseInt(newPermissionLevel))

      // Reset form
      setNewPermissionUserId('')
    } catch (error) {
      console.error('Error setting permission:', error)
    }
  }

  const handleRemovePermission = async (userName: string) => {
    await removeCollectionPermission(permissionsCollectionId, userName)
  }

  const getPermissionLabel = (permission: number) => {
    switch (permission) {
      case 1:
        return 'Read'
      case 2:
        return 'Write'
      case 3:
        return 'Admin'
      default:
        return 'Unknown'
    }
  }

  const getPermissionIcon = (permission: number) => {
    switch (permission) {
      case 1:
        return <Eye className="h-3.5 w-3.5 mr-2 opacity-70" />
      case 2:
        return <PenLine className="h-3.5 w-3.5 mr-2 opacity-70" />
      case 3:
        return <ShieldCheck className="h-3.5 w-3.5 mr-2 opacity-70" />
      default:
        return <Eye className="h-3.5 w-3.5 mr-2 opacity-70" />
    }
  }

  const data = getData()

  const handleLoadMore = () => {
    if (loadNextPage) {
      loadNextPage()
    }
  }

  const getBadgeVariant = (permission: number) => {
    switch (permission) {
      case 1:
        return 'outline'
      case 2:
        return 'destructive'
      case 3:
        return 'default'
      default:
        return 'outline'
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setInput({ pageSize: 10 })}
            className="rounded-lg border p-2 flex items-center justify-center gap-2 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            Refresh
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {!hasReachedEnd && (
            <Button onClick={handleLoadMore} disabled={isLoading || isWriting} variant="outline" size="sm">
              {isLoading ? 'Loading...' : 'Load More'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Collection name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Collection description"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={newVisibility} onValueChange={setNewVisibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString()}>Private</SelectItem>
                      <SelectItem value={EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC.toString()}>Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateCollection} disabled={isWriting || !newName}>
                  {isWriting ? 'Creating...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          {metadata && <div className="text-xs text-muted-foreground mr-2">{data?.length || 0} items loaded</div>}

          <Button variant="outline" size="sm" onClick={() => setShowJsonView(!showJsonView)}>
            {showJsonView ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showJsonView ? 'Hide JSON' : 'Show JSON'}
          </Button>
        </div>
      </div>

      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Edit Collection Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Name</Label>
              <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea id="editDescription" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editVisibility">Visibility</Label>
              <Select value={editVisibility} onValueChange={setEditVisibility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString()}>Private</SelectItem>
                  <SelectItem value={EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC.toString()}>Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateCollection} disabled={isWriting || !editName}>
              {isWriting ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4 mb-2 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="h-5 w-5" />
              Manage Permissions - {permissionsCollectionName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-2">
            {/* Current Permissions */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2 opacity-70" />
                Current Permissions
              </h3>
              {(() => {
                const permissionsList = permissionsData?.getPermissionsList() || []
                return permissionsList.length > 0 ? (
                  <div className="space-y-2">
                    {permissionsList.map((permission: EventCollectionPermission) => (
                      <div
                        key={permission.getUser()?.getUsername()}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/10 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <UserCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                          <div className="flex flex-1 items-center justify-between pr-2">
                            <span className="font-medium text-sm truncate max-w-[200px] inline-block">
                              {permission.getUser()?.getUsername()}
                            </span>
                            <Badge className="ml-2 shrink-0" variant={getBadgeVariant(permission.getPermission())}>
                              {getPermissionLabel(permission.getPermission())}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePermission(permission.getUser()?.getUsername() || '')}
                          disabled={isPermissionsLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground p-6 border rounded-md bg-muted/30 flex items-center justify-center">
                    <UserX className="h-4 w-4 mr-2 opacity-70" />
                    No permissions set for this collection
                  </div>
                )
              })()}
            </div>

            {/* Add New Permission */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <UserPlus className="h-4 w-4 mr-2 opacity-70" />
                Add New Permission
              </h3>
              <div className="border rounded-md p-5 pb-6 bg-card">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="userId" className="text-xs font-medium mb-2 block text-muted-foreground">
                      User ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="userId"
                        placeholder="Enter user ID or username"
                        value={newPermissionUserId}
                        onChange={(e) => setNewPermissionUserId(e.target.value)}
                        className="w-full pl-[42px] h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="permissionLevel" className="text-xs font-medium mb-2 block text-muted-foreground">
                      Permission
                    </Label>
                    <Select value={newPermissionLevel} onValueChange={setNewPermissionLevel}>
                      <SelectTrigger className="w-full h-11" id="permissionLevel">
                        <div className="flex items-center">
                          {getPermissionIcon(Number.parseInt(newPermissionLevel))}
                          <span>{getPermissionLabel(Number.parseInt(newPermissionLevel))}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1" className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 opacity-80" />
                          Read
                        </SelectItem>
                        <SelectItem value="2" className="flex items-center">
                          <PenLine className="h-4 w-4 mr-2 opacity-80" />
                          Write
                        </SelectItem>
                        <SelectItem value="3" className="flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2 opacity-80" />
                          Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleAddPermission}
                    disabled={isPermissionsLoading || !newPermissionUserId}
                    className="w-full h-12 rounded-md"
                    variant={newPermissionUserId ? 'default' : 'secondary'}
                  >
                    {isPermissionsLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 mr-2" />
                        Add Permission
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {permissionsError && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md border border-destructive/20 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
                <span>{permissionsError}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isLoading && !data ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {showJsonView && (
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <div className="rounded-lg bg-muted p-4 h-[500px] overflow-auto">
                <h3 className="mb-2 text-sm font-semibold">Collections Data ({data?.length || 0})</h3>
                <pre className="text-xs sm:text-sm">
                  <code>
                    {JSON.stringify(
                      data?.map((c) => c.toObject()),
                      null,
                      2
                    )}
                  </code>
                </pre>
              </div>
            </div>
          )}

          <div className={`w-full ${showJsonView ? 'md:w-1/2' : 'w-full'}`}>
            <div className="space-y-4 h-[500px] overflow-auto pr-2">
              <h3 className="text-sm font-semibold mb-2">Collections ({data?.length || 0})</h3>
              {data?.map((collectionWithSummary) => (
                <div key={collectionWithSummary.getCollection()?.getId()} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{collectionWithSummary.getCollection()?.getName()}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {collectionWithSummary.getCollection()?.getDescription() || 'No description'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 items-center">
                        <span className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs">
                          {collectionWithSummary.getCollection()?.getVisibility() ===
                          EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
                            ? 'Private'
                            : 'Public'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openPermissionsDialog(collectionWithSummary.getCollection() || new EventCollection())}
                        disabled={isPermissionsLoading}
                        title="Manage permissions"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(collectionWithSummary.getCollection() || new EventCollection())}
                        disabled={isWriting}
                        title="Edit collection"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeCollection(collectionWithSummary.getCollection()?.getId() || '')}
                        disabled={isWriting}
                        title="Delete collection"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {!data?.length && !isLoading && (
                <div className="p-8 text-center text-muted-foreground">
                  No collections found. Create your first collection using the button above.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {metadata && <div className="mt-4 text-xs text-muted-foreground">Full metadata: {JSON.stringify(metadata)}</div>}
    </div>
  )
}
