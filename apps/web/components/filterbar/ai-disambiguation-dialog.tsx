'use client'

import type { AmbiguousEntity } from '@prio-state/feature/events'
import { AnimatePresence, motion } from 'framer-motion'
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
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AiDisambiguationDialogProps {
  isOpen: boolean
  onClose: () => void
  ambiguousEntity: AmbiguousEntity | null
  onOptionSelect: (entityType: string, optionId: string) => void
  className?: string
  position?: 'top' | 'center'
}

/**
 * Cleans up an option description by removing redundant text patterns
 */
const cleanDescription = (description?: string): string | undefined => {
  if (!description) return undefined

  // Remove "Location filter for X", "Category filter for X", etc.
  return description.replace(/^(Location|Category|Event|Artist|Venue|Price|Date|Time|Transport|Accessibility|Ticket) filter for .+$/i, '')
}

export function AiDisambiguationDialog({
  isOpen,
  onClose,
  ambiguousEntity,
  onOptionSelect,
  className,
  position = 'top',
}: AiDisambiguationDialogProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hoverOption, setHoverOption] = useState<string | null>(null)

  // Reset selection when entity changes
  useEffect(() => {
    setSelectedOption(null)
  }, [ambiguousEntity])

  if (!ambiguousEntity) return null

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
        return <Globe className="h-5 w-5" />
      case 'time':
        return <Clock className="h-5 w-5" />
      case 'date':
        return <Calendar className="h-5 w-5" />
      case 'category':
        return <Tag className="h-5 w-5" />
      case 'event':
        return <MapPin className="h-5 w-5" />
      case 'artist':
        return <Mic2 className="h-5 w-5" />
      case 'venue':
        return <Music className="h-5 w-5" />
      case 'price':
        return <CreditCard className="h-5 w-5" />
      case 'transport':
        return <Train className="h-5 w-5" />
      case 'accessibility':
        return <Accessibility className="h-5 w-5" />
      case 'ticket':
        return <Ticket className="h-5 w-5" />
      default:
        return <HelpCircle className="h-5 w-5" />
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
    <AnimatePresence>
      {isOpen && (
        <div className={cn('fixed inset-x-0 z-50 flex justify-center', position === 'top' ? 'top-18' : 'inset-y-0 items-center')}>
          {/* Premium backdrop with enhanced blur */}
          {position === 'center' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={onClose}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 400,
              duration: 0.4,
            }}
            className={cn('relative z-50 w-[95%] max-w-md mx-auto', position === 'top' ? 'mt-2' : '', className)}
          >
            {/* Main dialog card with subtle glass effect */}
            <motion.div
              className="overflow-hidden border-0 rounded-2xl bg-black/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(14,44,121,0.25)]"
              layoutId="dialog-container"
            >
              {/* Header section with minimal design */}
              <div className="relative">
                <div className="p-5 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="bg-indigo-500/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center text-indigo-200"
                      >
                        {getEntityIcon(ambiguousEntity.type)}
                      </motion.div>
                      <div>
                        <motion.h2
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15, duration: 0.4 }}
                          className="text-xl font-semibold text-white"
                        >
                          {getDialogTitle(ambiguousEntity.type, ambiguousEntity.value)}
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                          className="text-sm text-slate-300 mt-1"
                        >
                          Select the best match
                        </motion.p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />

              {/* Options section with premium animations */}
              <div className="p-5">
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600/30">
                  {ambiguousEntity.options.map((option, index) => (
                    <motion.div
                      key={`option-${option.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                    >
                      <motion.button
                        layoutId={`option-${option.id}`}
                        onMouseEnter={() => setHoverOption(option.id)}
                        onMouseLeave={() => setHoverOption(null)}
                        onClick={() => handleSelect(option.id)}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all',
                          selectedOption === option.id
                            ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                            : 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-200 border border-slate-700/50 hover:border-indigo-500/50'
                        )}
                      >
                        {/* Background gradient effect on hover */}
                        {(hoverOption === option.id || selectedOption === option.id) && (
                          <motion.div
                            layoutId={`gradient-${option.id}`}
                            className={cn('absolute inset-0 rounded-xl opacity-40', selectedOption === option.id ? 'opacity-100' : '')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: selectedOption === option.id ? 1 : 0.4 }}
                            style={{
                              background: 'linear-gradient(125deg, rgba(99,102,241,0.6) 0%, rgba(79,70,229,0.6) 100%)',
                              zIndex: -1,
                            }}
                          />
                        )}

                        {/* Icon container */}
                        <div
                          className={cn(
                            'shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                            selectedOption === option.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-300',
                            hoverOption === option.id && selectedOption !== option.id ? 'bg-slate-700' : ''
                          )}
                        >
                          {selectedOption === option.id ? <Check className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={cn('font-medium text-base', selectedOption === option.id ? 'text-white' : 'text-slate-200')}>
                            {option.label}
                          </h3>

                          {option.description && cleanDescription(option.description) && (
                            <p className={cn('text-sm mt-1', selectedOption === option.id ? 'text-white/90' : 'text-slate-400')}>
                              {cleanDescription(option.description)}
                            </p>
                          )}

                          {option.meta && (
                            <div
                              className={cn(
                                'flex items-center gap-1.5 mt-2 text-xs',
                                selectedOption === option.id ? 'text-white/70' : 'text-slate-500'
                              )}
                            >
                              <div className={cn('h-1 w-1 rounded-full', selectedOption === option.id ? 'bg-white/50' : 'bg-slate-600')} />
                              {option.meta}
                            </div>
                          )}
                        </div>

                        {/* Visual selection indicator */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: selectedOption === option.id ? 1 : 0,
                            opacity: selectedOption === option.id ? 1 : 0,
                          }}
                          className="absolute right-4 text-white"
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 flex justify-between items-center border-t border-slate-700/30 bg-black/20">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-500/20 p-1.5 rounded-full">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">AI suggestion</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="text-xs font-medium rounded-full px-4 py-2 bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 border border-slate-700/50 transition-colors"
                >
                  Skip
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
