import { render, screen } from '@testing-library/react'
import { Home } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders with basic props', () => {
    render(<EmptyState icon={Home} title="Test Title" subtitle="Test Subtitle" />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Icon is rendered as SVG
  })

  it('renders with button when provided', () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        icon={Home}
        title="Test Title"
        subtitle="Test Subtitle"
        button={{
          label: 'Test Button',
          onClick,
        }}
      />
    )

    const button = screen.getByRole('button', { name: 'Test Button' })
    expect(button).toBeInTheDocument()
    button.click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders with link button when href is provided', () => {
    render(
      <EmptyState
        icon={Home}
        title="Test Title"
        subtitle="Test Subtitle"
        button={{
          label: 'Test Link',
          href: '/test',
        }}
      />
    )

    const link = screen.getByRole('link', { name: 'Test Link' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  // REVIEW: Should we test the className prop? It's using a utility function (cn) that combines classes
  it('applies custom className', () => {
    render(<EmptyState icon={Home} title="Test Title" subtitle="Test Subtitle" className="custom-class" />)

    const container = screen.getByText('Test Title').closest('div')?.parentElement
    expect(container).toHaveClass('custom-class')
  })
})
