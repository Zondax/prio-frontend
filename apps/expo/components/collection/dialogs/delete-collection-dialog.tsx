import { useDeleteCollection } from '@mono-state/feature/collections/hooks/useCollectionActions'
import { Trash2 } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'

interface DeleteCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionId?: string
  collectionName?: string
  onDelete: (collectionId: string) => Promise<void>
  isDeleting?: boolean
  onSuccess?: () => void
}

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  collectionId,
  collectionName,
  onDelete,
  isDeleting = false,
  onSuccess,
}: DeleteCollectionDialogProps) {
  const { handleDelete, isDisabled, showDeletingText } = useDeleteCollection({
    collectionId,
    onDelete,
    onSuccess,
    onOpenChange,
    isDeleting,
  })

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={() => onOpenChange(false)}>
      <View className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-white rounded-xl p-6 w-80 max-w-[90%]">
          <View className="items-center space-y-2">
            <View className="mx-auto bg-red-500/10 p-2 rounded-full">
              <Trash2 size={20} color="#ef4444" />
            </View>
            <Text className="text-lg font-semibold text-center mt-2">Delete Collection</Text>
            <Text className="text-sm text-gray-500 text-center">
              Are you sure you want to delete <Text className="font-medium text-gray-900">{collectionName || 'this collection'}</Text>? This
              action cannot be undone.
            </Text>
          </View>
          <View className="flex-row gap-2 mt-6">
            <TouchableOpacity
              onPress={() => onOpenChange(false)}
              disabled={isDisabled}
              className="rounded-md h-9 flex-1 bg-gray-100 items-center justify-center"
            >
              <Text className="text-gray-700 font-medium text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isDisabled}
              className={`rounded-md h-9 flex-1 bg-red-500 items-center justify-center ${isDisabled ? 'opacity-70' : ''}`}
            >
              {showDeletingText ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-medium text-base">Delete</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
