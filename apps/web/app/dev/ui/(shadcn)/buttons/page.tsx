'use client'

import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function ShadcnButtonsPage() {
  const buttonSpacing = { marginRight: '1rem', marginBottom: '1rem' }

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Shadcn UI - Buttons (Plainest Demo with Spacing)</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Variants</h2>
        <div>
          <Button variant="default" style={buttonSpacing}>
            Default
          </Button>
          <Button variant="destructive" style={buttonSpacing}>
            Destructive
          </Button>
          <Button variant="outline" style={buttonSpacing}>
            Outline
          </Button>
          <Button variant="secondary" style={buttonSpacing}>
            Secondary
          </Button>
          <Button variant="ghost" style={buttonSpacing}>
            Ghost
          </Button>
          <Button variant="link" style={buttonSpacing}>
            Link
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Sizes</h2>
        <div>
          <Button size="sm" style={buttonSpacing}>
            Small
          </Button>
          <Button size="default" style={buttonSpacing}>
            Default
          </Button>
          <Button size="lg" style={buttonSpacing}>
            Large
          </Button>
          <Button size="icon" style={buttonSpacing}>
            <Mail style={{ height: '1.25rem', width: '1.25rem' }} />
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>With Icon</h2>
        <div>
          <Button style={buttonSpacing}>
            <Mail style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} /> Login with Email
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Loading State</h2>
        <div>
          <Button disabled style={buttonSpacing}>
            <svg
              style={{ animation: 'spin 1s linear infinite', marginRight: '0.75rem', height: '1.25rem', width: '1.25rem' }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>Loading...</title>
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                style={{ opacity: 0.75 }}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '0rem' }}>
        <h2>As Child (Link)</h2>
        <div>
          <Button asChild style={buttonSpacing}>
            <a href="https://shadcn.com/ui" target="_blank" rel="noopener noreferrer">
              Visit Shadcn UI
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
