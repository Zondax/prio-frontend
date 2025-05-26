'use client'

import type { AmbiguousEntity } from '@prio-state/feature/events'
import { BlurView } from 'expo-blur'
import {
  Accessibility,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Globe,
  HelpCircle,
  MapPin,
  Mic2,
  Music,
  Sparkles,
  Tag,
  Ticket,
  Train,
  X,
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import { Text } from '../ui/text'

interface AiDisambiguationDialogProps {
  isOpen: boolean
  onClose: () => void
  ambiguousEntity: AmbiguousEntity | null
  onOptionSelect: (entityType: string, optionId: string) => void
  position?: 'top' | 'center'
}

function cleanDescription(description: string): string {
  return description && description.trim() !== '' ? description : ''
}

export function AiDisambiguationDialog({
  isOpen,
  onClose,
  ambiguousEntity,
  onOptionSelect,
  position = 'top',
}: AiDisambiguationDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Reset selection when entity changes
  useEffect(() => {
    setSelectedOption(null)
  }, [ambiguousEntity])

  if (!ambiguousEntity || !isOpen) return null

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId)

    // Immediately notify parent of selection
    onOptionSelect(ambiguousEntity.type, optionId)

    // Let the animation complete before closing
    setTimeout(() => {
      setSelectedOption(null)
      onClose()
    }, 400)
  }

  // Get icon based on entity type
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <Globe stroke="#a5b4fc" width={20} height={20} />
      case 'time':
        return <Clock stroke="#a5b4fc" width={20} height={20} />
      case 'date':
        return <Calendar stroke="#a5b4fc" width={20} height={20} />
      case 'category':
        return <Tag stroke="#a5b4fc" width={20} height={20} />
      case 'event':
        return <MapPin stroke="#a5b4fc" width={20} height={20} />
      case 'artist':
        return <Mic2 stroke="#a5b4fc" width={20} height={20} />
      case 'venue':
        return <Music stroke="#a5b4fc" width={20} height={20} />
      case 'price':
        return <CreditCard stroke="#a5b4fc" width={20} height={20} />
      case 'transport':
        return <Train stroke="#a5b4fc" width={20} height={20} />
      case 'accessibility':
        return <Accessibility stroke="#a5b4fc" width={20} height={20} />
      case 'ticket':
        return <Ticket stroke="#a5b4fc" width={20} height={20} />
      default:
        return <HelpCircle stroke="#a5b4fc" width={20} height={20} />
    }
  }

  const getDialogTitle = (type: string, value: string) => {
    switch (type) {
      case 'location':
        return 'Did you mean one of these options?'
      case 'time':
        return 'Which time did you mean?'
      case 'date':
        return 'Which date did you mean?'
      case 'category':
        return `Which "${value}" category?`
      case 'event':
        return `Which "${value}" event?`
      case 'artist':
        return `Which "${value}" artist?`
      case 'venue':
        return `Which "${value}" venue?`
      case 'price':
        return 'Which price range?'
      case 'transport':
        return 'Which transport option?'
      case 'accessibility':
        return 'Which accessibility option?'
      case 'ticket':
        return 'Which ticket type?'
      default:
        return `Which "${value}" did you mean?`
    }
  }

  return (
    <View className="absolute inset-0 z-50 flex justify-center items-center">
      {/* Backdrop with blur effect */}
      {position === 'center' && (
        <TouchableOpacity activeOpacity={1} onPress={onClose} className="absolute inset-0 bg-black/60">
          <BlurView intensity={20} className="absolute inset-0" />
        </TouchableOpacity>
      )}

      {/* Main dialog container */}
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="w-[95%] max-w-md bg-black/40 rounded-2xl overflow-hidden border-0 shadow-lg"
      >
        {/* Header section */}
        <View className="p-5 pb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4 w-[75%]">
              <View className="bg-indigo-500/20 w-12 h-12 rounded-full items-center justify-center">
                {getEntityIcon(ambiguousEntity.type)}
              </View>
              <View>
                <Text className="text-lg font-semibold text-white">{getDialogTitle(ambiguousEntity.type, ambiguousEntity.value)}</Text>
                <Text className="text-sm text-slate-300 mt-1">Select the best match</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="h-8 w-8 rounded-full items-center justify-center">
              <X stroke="#94a3b8" width={16} height={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-slate-700/50" />

        {/* Options section */}
        <View className="p-5">
          <ScrollView className="max-h-[350px]" showsVerticalScrollIndicator={false}>
            <View className="space-y-3">
              {ambiguousEntity.options.map((option, index) => (
                <Animated.View key={`option-${option.id}-${index}`} entering={FadeIn.delay(index * 80)}>
                  <TouchableOpacity
                    onPress={() => handleSelect(option.id)}
                    className={`flex-row items-center gap-4 p-4 rounded-xl border ${
                      selectedOption === option.id ? 'bg-indigo-500 border-indigo-600' : 'bg-slate-900/40 border-slate-700/50'
                    }`}
                  >
                    {/* Icon container */}
                    <View
                      className={`w-10 h-10 rounded-full items-center justify-center ${
                        selectedOption === option.id ? 'bg-white/20' : 'bg-slate-800'
                      }`}
                    >
                      {selectedOption === option.id ? (
                        <Check stroke="white" width={20} height={20} />
                      ) : (
                        <Globe stroke="#a5b4fc" width={20} height={20} />
                      )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 min-w-0">
                      <Text className={`font-medium text-base font-body ${selectedOption === option.id ? 'text-white' : 'text-slate-200'}`}>
                        {option.label}
                      </Text>

                      {option.description && cleanDescription(option.description) && (
                        <Text className={`text-sm mt-1 font-body ${selectedOption === option.id ? 'text-white/90' : 'text-slate-400'}`}>
                          {cleanDescription(option.description)}
                        </Text>
                      )}

                      {option.meta && (
                        <View className={`flex-row items-center mt-2 ${selectedOption === option.id ? 'text-white/70' : 'text-slate-500'}`}>
                          <View className={`h-1 w-1 rounded-full ${selectedOption === option.id ? 'bg-white/50' : 'bg-slate-600'}`} />
                          <Text className="text-xs ml-1.5 text-slate-500 font-body">{option.meta}</Text>
                        </View>
                      )}
                    </View>

                    {/* Selection indicator */}
                    {selectedOption === option.id && (
                      <View className="absolute right-4">
                        <Check stroke="white" width={20} height={20} />
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Footer */}
        <View className="p-4 flex-row justify-between items-center border-t border-slate-700/30 bg-black/20">
          <View className="flex-row items-center gap-2">
            <View className="bg-indigo-500/20 p-1.5 rounded-full">
              <Sparkles stroke="#a5b4fc" width={14} height={14} />
            </View>
            <Text className="text-sm text-slate-300 font-medium font-body">AI suggestion</Text>
          </View>

          <TouchableOpacity onPress={onClose} className="px-4 py-2 rounded-full bg-slate-800/70 border border-slate-700/50">
            <Text className="text-xs font-medium text-slate-200 font-body">Skip</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}
