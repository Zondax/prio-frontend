'use client'

import { TagSelector } from '@/components/filterbar/tag-selector'
import { useState } from 'react'

export default function TagSelectorPage() {
  const componentSpacing = { marginRight: '1rem', marginBottom: '1rem' }
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagsChange = (tags: string[]) => {
    console.log('Selected tags:', tags)
    setSelectedTags(tags)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Prio UI - TagSelector</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Basic Example</h2>
        <div style={componentSpacing}>
          <TagSelector selectedTags={selectedTags} onTagsChange={handleTagsChange} />
        </div>
        <p>Selected Tags: {selectedTags.join(', ')}</p>
      </div>

      {/* Add more examples as needed */}
    </div>
  )
}
