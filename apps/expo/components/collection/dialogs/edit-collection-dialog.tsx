import { useEditCollection } from '@prio-state/feature/collections/hooks/useCollectionActions'
import { Lock, Pencil } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface EditCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection?: any // EventCollection
  onUpdate: (collectionId: string, data: Partial<any>) => Promise<void>
  isUpdating?: boolean
  onSuccess?: () => void
}

export function EditCollectionDialog({
  open,
  onOpenChange,
  collection,
  onUpdate,
  isUpdating = false,
  onSuccess,
}: EditCollectionDialogProps) {
  const { isSaving, handleSubmit, name, setName, description, setDescription, isPrivate, setIsPrivate, handleClose, error } =
    useEditCollection({
      open,
      onOpenChange,
      collection,
      onUpdate,
      isUpdating,
      onSuccess,
    })

  if (!collection) return null

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-white rounded-2xl p-6 w-80 max-w-[90%]">
          {/* Header */}
          <View className="items-center space-y-2 mb-4">
            <View className="mx-auto bg-blue-500/10 p-2 rounded-full w-fit">
              <Pencil size={20} color="#3b82f6" />
            </View>
            <Text className="text-lg font-semibold text-center mt-2">Edit Collection</Text>
            <Text className="text-center text-sm text-gray-400">Update details for “{collection.getName?.()}”</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-xs font-medium mb-1.5">Collection Name</Text>
              <TextInput
                placeholder="Enter collection name"
                value={name}
                onChangeText={setName}
                className="mt-1.5 h-9 rounded-md bg-gray-100 border border-gray-200 px-3 text-base"
                autoFocus
                editable={!isSaving}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            <View>
              <Text className="text-xs font-medium mb-1.5">Description (Optional)</Text>
              <TextInput
                placeholder="Enter collection description"
                value={description}
                onChangeText={setDescription}
                className="mt-1.5 rounded-md resize-none h-20 bg-gray-100 border border-gray-200 px-3 text-base"
                multiline
                editable={!isSaving}
              />
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center gap-3">
                <View className="h-7 w-7 rounded-full items-center justify-center bg-slate-100 mr-2">
                  <Lock size={14} color="#64748b" />
                </View>
                <View>
                  <Text className="text-xs font-medium">Private Collection</Text>
                  <Text className="text-xs text-gray-400 mt-0.5">Only visible to you</Text>
                </View>
              </View>
              <Switch value={isPrivate} onValueChange={setIsPrivate} disabled={isSaving} />
            </View>
          </View>

          {/* Error */}
          {error ? <Text className="text-red-500 text-xs mt-4">{error}</Text> : null}

          {/* Footer */}
          <View className="flex-row gap-2 mt-6">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isSaving}
              className="rounded-md h-9 flex-1 bg-gray-100 items-center justify-center"
            >
              <Text className="text-gray-700 font-medium text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!name.trim() || isSaving}
              className={`rounded-md bg-blue-500/90 ${!name.trim() || isSaving ? 'opacity-70' : 'hover:bg-blue-500'} h-9 flex-1 items-center justify-center`}
            >
              {isSaving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-medium text-base">Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
