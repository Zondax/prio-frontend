import type { EventCollection } from '@prio-state'
import type { CollectionFormData } from '@prio-state'
import { useCollectionsStore, useEndpointStore } from '@prio-state/stores'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import { BookmarkCheck, CheckCircle, Pin, Plus, Search, X } from 'lucide-react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FlatList, Keyboard, Modal, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Button } from '~/components/ui/button'

import { NewCollectionDialog } from '../collection/dialogs/new-collection-dialog'

// TODO: adjust it to the new design
interface PinButtonProps {
  isPinned: boolean
  eventId: string
  onPinToggle: (e?: any) => void
}

interface PinModalContentProps {
  isPinned: boolean
  handlePinToggle: (e?: any) => void
  collections: EventCollection[]
  searchQuery: string
  handleSearchChange: (text: string) => void
  isInCollection: (id: string) => boolean
  toggleEventInCollection: (id: string) => void
  setIsCreateCollectionDialogOpen: (value: boolean) => void
  setSearchQuery: (value: string) => void
  onClose: () => void
}

// TODO: think about replacing it by bottom sheet
function PinModalContent({
  isPinned,
  handlePinToggle,
  collections,
  searchQuery,
  handleSearchChange,
  isInCollection,
  toggleEventInCollection,
  setIsCreateCollectionDialogOpen,
  setSearchQuery,
  onClose,
}: PinModalContentProps) {
  const { height: windowHeight } = useWindowDimensions()
  const maxHeight = useMemo(() => Math.min(windowHeight * 0.7, 600), [windowHeight])

  return (
    <View className="px-4 pt-4 pb-8 bg-white rounded-t-2xl min-w-[280px]" style={{ maxHeight }}>
      <View className="items-center mb-3">
        <View className="w-10 h-1 rounded bg-gray-200 mb-2" />
      </View>
      <TouchableOpacity
        onPress={() => {
          handlePinToggle()
          onClose()
        }}
        className="flex-row items-center mb-3"
      >
        <Pin size={18} color={isPinned ? '#2563eb' : '#6b7280'} fill={isPinned ? '#2563eb' : 'none'} />
        <Text className="ml-2 font-medium text-[#111]">{isPinned ? 'Unpin Event' : 'Pin Event'}</Text>
      </TouchableOpacity>

      <Text className="text-xs text-gray-500 mb-2 font-semibold">Add to Collection</Text>

      <View className="mb-3">
        <View className="flex-row items-center bg-gray-100 rounded-lg">
          <Search size={16} color="#9ca3af" style={{ marginLeft: 8 }} />
          <TextInput
            placeholder="Search collections..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            className="flex-1 h-9 px-2 text-sm text-[#111] bg-transparent"
            onBlur={Keyboard.dismiss}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="px-2 h-9 justify-center">
              <X size={16} color="#9ca3af" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={{ maxHeight: 180 }}>
        {collections.length === 0 ? (
          <Text className="text-center text-gray-400 text-sm my-3">No collections found</Text>
        ) : (
          <FlatList
            data={collections}
            keyExtractor={(item) => item.getId() || ''}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  toggleEventInCollection(item.getId() || '')
                  onClose()
                }}
                className="flex-row items-center justify-between py-2 px-1"
              >
                <Text numberOfLines={1} className="flex-1 text-[#111]">
                  {item.getName()}
                </Text>
                {isInCollection(item.getId() || '') && <CheckCircle size={18} color="#2563eb" className="ml-2" />}
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          setIsCreateCollectionDialogOpen(true)
          onClose()
        }}
        className="flex-row items-center mt-4"
      >
        <Plus size={18} color="#2563eb" className="mr-2" />
        <Text className="text-[#2563eb] font-medium">Create New Collection</Text>
      </TouchableOpacity>
    </View>
  )
}

export function PinButton({ isPinned, eventId, onPinToggle }: PinButtonProps) {
  const { getData, setInput, setParams, addEventToCollection, createCollection: storeCreateCollection } = useCollectionsStore()
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  const collections = getData()
    .map((c) => c.getCollection() ?? null)
    .filter((c) => c !== null)

  const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Initialize collections data
  useEffect(() => {
    setInput({})
  }, [setInput])

  // Reset search query when modal closes
  useEffect(() => {
    if (!showModal) setSearchQuery('')
  }, [showModal])

  // Check if event is in collection
  const isInCollection = useCallback((collectionId: string) => {
    // TODO: Implement actual check if event is in collection
    return false
  }, [])

  // Check if event is in any collection
  const isInAnyCollection = useCallback(() => {
    // TODO: Implement actual check
    return false
  }, [])

  // Toggle event in collection
  const toggleEventInCollection = async (collectionId: string) => {
    if (isInCollection(collectionId)) {
      // TODO: Remove event from collection
    } else {
      await addEventToCollection(collectionId, eventId)
    }
  }

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
  }

  const handleCreateCollection = useCallback(
    async (data: CollectionFormData) => {
      await storeCreateCollection(
        data.name,
        {
          description: data.description,
          visibility: data.visibility,
        },
        eventId
      )
    },
    [storeCreateCollection, eventId]
  )

  // Filter collections by search query
  const filteredCollections = collections.filter((c) => c.getName().toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <View className="absolute right-4 top-4 z-10">
      <Button size="icon" variant={isPinned ? 'default' : 'secondary'} className="h-10 w-10" onPress={() => setShowModal(true)}>
        {isInAnyCollection() ? (
          <BookmarkCheck fill={isPinned ? '#000' : 'none'} className={'h-4 w-4'} />
        ) : (
          <Pin fill={isPinned ? '#000' : 'none'} color={isPinned ? '#000' : 'none'} className={'h-4 w-4'} />
        )}
      </Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        hardwareAccelerated={true}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowModal(false)} />
          <PinModalContent
            isPinned={isPinned}
            handlePinToggle={onPinToggle}
            collections={filteredCollections}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            isInCollection={isInCollection}
            toggleEventInCollection={toggleEventInCollection}
            setIsCreateCollectionDialogOpen={setIsCreateCollectionDialogOpen}
            setSearchQuery={setSearchQuery}
            onClose={() => setShowModal(false)}
          />
        </View>
      </Modal>

      <NewCollectionDialog
        open={isCreateCollectionDialogOpen}
        onOpenChange={setIsCreateCollectionDialogOpen}
        handleCreateCollection={handleCreateCollection}
      />
    </View>
  )
}
