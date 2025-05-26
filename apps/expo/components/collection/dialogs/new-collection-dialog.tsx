import { type CollectionFormData, useNewCollection } from '@prio-state'
import { FolderPlus, Lock } from 'lucide-react-native'
import React from 'react'
import { ActivityIndicator, KeyboardAvoidingView, Modal, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface NewCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId?: string
  handleCreateCollection: (data: CollectionFormData) => Promise<void>
}

export function NewCollectionDialog({ open, onOpenChange, eventId, handleCreateCollection }: NewCollectionDialogProps) {
  const { name, setName, description, setDescription, isPrivate, setIsPrivate, handleSubmit, isSubmitting, handleClose, error } =
    useNewCollection({
      onOpenChange,
      onCreate: handleCreateCollection,
      eventId,
    })

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView className="flex-1 justify-center items-center bg-black/20">
        <View className="bg-white rounded-xl p-6 w-80 max-w-[90%]">
          {/* Header */}
          <View className="items-center space-y-2">
            <View className="mx-auto bg-green-500/10 p-2 rounded-full w-fit">
              <FolderPlus size={20} color="#22c55e" />
            </View>
            <Text className="text-lg font-semibold text-center mt-2">Create Collection</Text>
            <Text className="text-sm text-gray-400 text-center">Create a collection to organize your assets</Text>
          </View>

          {/* Form */}
          <View className="mt-4 space-y-4">
            <View>
              <Text className="text-xs font-medium mb-1.5">Collection Name *</Text>
              <TextInput
                placeholder="Enter collection name"
                value={name}
                onChangeText={setName}
                className="mt-1.5 h-9 rounded-md bg-gray-100 border border-gray-200 px-3 text-base"
                autoFocus
                editable={!isSubmitting}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            <View>
              <Text className="text-xs font-medium mb-1.5">Description</Text>
              <TextInput
                placeholder="Enter collection description (optional)"
                value={description}
                onChangeText={setDescription}
                className="mt-1.5 min-h-[80px] rounded-md bg-gray-100 border border-gray-200 px-3 text-base"
                multiline
                editable={!isSubmitting}
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
              <Switch value={isPrivate} onValueChange={setIsPrivate} disabled={isSubmitting} />
            </View>
          </View>

          {/* Error */}
          {error ? <Text className="text-red-500 text-xs mt-4">{error}</Text> : null}

          {/* Footer */}
          <View className="flex-row gap-2 mt-6">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isSubmitting}
              className="rounded-md h-9 flex-1 bg-gray-100 items-center justify-center"
            >
              <Text className="text-gray-700 font-medium text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!name.trim() || isSubmitting}
              className={`rounded-md bg-green-500 ${!name.trim() || isSubmitting ? 'opacity-70' : 'hover:bg-green-600'} h-9 flex-1 items-center justify-center`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-medium text-base">Create Collection</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}
