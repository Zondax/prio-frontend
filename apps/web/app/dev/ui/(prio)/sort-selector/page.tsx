'use client'

import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { SortSelector } from '@/components/filterbar/sort-selector'
import type { Option } from '@prio-state/stores'
import { useState } from 'react'

const mockOptionsAlpha: Option<string>[] = [
  { id: 'name', label: 'Name', value: 'name' },
  { id: 'date', label: 'Date XYZ', value: 'date' },
  { id: 'relevance', label: 'Relevance', value: 'relevance' },
]

export default function SortSelectorPage() {
  // State for Alpha SortSelector - Instance 1 (Selected: Name)
  const [selectedAlphaName, setSelectedAlphaName] = useState<Option<string> | undefined>(mockOptionsAlpha[0])
  const handleAlphaNameChange = (option: Option<string>) => {
    console.log('Selected Alpha Option (Name):', option)
    setSelectedAlphaName(option)
  }

  // State for Alpha SortSelector - Instance 2 (Selected: Date)
  const [selectedAlphaDate, setSelectedAlphaDate] = useState<Option<string> | undefined>(mockOptionsAlpha[1])
  const handleAlphaDateChange = (option: Option<string>) => {
    console.log('Selected Alpha Option (Date):', option)
    setSelectedAlphaDate(option)
  }

  // State for Alpha SortSelector - Instance 3 (Selected: Relevance)
  const [selectedAlphaRelevance, setSelectedAlphaRelevance] = useState<Option<string> | undefined>(mockOptionsAlpha[2])
  const handleAlphaRelevanceChange = (option: Option<string>) => {
    console.log('Selected Alpha Option (Relevance):', option)
    setSelectedAlphaRelevance(option)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Prio UI - SortSelector with DebugWrapper</h1>

      <DebugScenarioWrapper title="SortSelector: Alphabetical Options (Default: Name)">
        <SortSelector options={mockOptionsAlpha} value={selectedAlphaName} onValueChange={handleAlphaNameChange} />
        <SortSelector options={mockOptionsAlpha} value={selectedAlphaDate} onValueChange={handleAlphaDateChange} />
        <SortSelector options={mockOptionsAlpha} value={selectedAlphaRelevance} onValueChange={handleAlphaRelevanceChange} />
      </DebugScenarioWrapper>
    </div>
  )
}
