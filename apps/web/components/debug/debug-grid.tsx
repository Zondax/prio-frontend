'use client'

import * as React from 'react'

interface DebugGridProps {
  children: React.ReactNode
  numCols: number
  childColSpan: number
  title?: string
}

export function DebugGrid({ children, numCols, childColSpan, title }: DebugGridProps) {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))`,
    gap: '1rem',
    padding: '1rem',
    border: '1px dashed #ccc',
    borderRadius: '0.5rem',
    margin: '1rem 0',
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // Check if the child already has a colSpan prop
      const childProps = child.props as { colSpan?: number }
      const colSpanToApply = childProps.colSpan !== undefined ? childProps.colSpan : childColSpan

      // @ts-expect-error - colSpan is a valid prop for children, assuming children can accept it
      return React.cloneElement(child, { colSpan: colSpanToApply })
    }
    return child
  })

  return (
    <div style={{ marginBottom: '2rem' }}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div style={gridStyle}>{childrenWithProps}</div>
    </div>
  )
}
