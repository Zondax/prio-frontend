'use client'

import { useEffect, useRef, useState } from 'react'

interface HoverSquare {
  x: number
  y: number
  timestamp: number
}

interface SquaresProps {
  direction?: 'right' | 'left' | 'up' | 'down' | 'diagonal'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
  className?: string
  trailLength?: number
}

export function Squares({
  direction = 'right',
  speed = 1,
  borderColor = '#333',
  squareSize = 40,
  hoverFillColor = '#222',
  className,
  trailLength = 25, // Number of squares in the trail
}: SquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>(0)
  const numSquaresX = useRef<number>(0)
  const numSquaresY = useRef<number>(0)
  const gridOffset = useRef({ x: 0, y: 0 })
  const [hoveredSquares, setHoveredSquares] = useState<HoverSquare[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas background
    canvas.style.background = '#060606'

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      ctx.lineWidth = 0.5

      // Draw base grid
      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize)
          const squareY = y - (gridOffset.current.y % squareSize)
          ctx.strokeStyle = borderColor
          ctx.strokeRect(squareX, squareY, squareSize, squareSize)
        }
      }

      // Draw hovered squares with fade effect
      hoveredSquares.forEach((square, index) => {
        const opacity = 1 - index / trailLength
        if (opacity > 0) {
          const squareX = square.x * squareSize - (gridOffset.current.x % squareSize)
          const squareY = square.y * squareSize - (gridOffset.current.y % squareSize)

          const [r, g, b] = [
            Number.parseInt(hoverFillColor.slice(1, 3), 16),
            Number.parseInt(hoverFillColor.slice(3, 5), 16),
            Number.parseInt(hoverFillColor.slice(5, 7), 16),
          ]
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
          ctx.fillRect(squareX, squareY, squareSize, squareSize)
        }
      })

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      )
      gradient.addColorStop(0, 'rgba(6, 6, 6, 0)')
      gradient.addColorStop(1, '#060606')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)

      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          break
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize
          break
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize
          break
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize
          break
      }

      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize

      const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize)
      const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize)

      setHoveredSquares((prev) => {
        const newSquare = {
          x: hoveredSquareX,
          y: hoveredSquareY,
          timestamp: Date.now(),
        }
        return [newSquare, ...prev.slice(0, trailLength - 1)]
      })
    }

    const handleMouseLeave = () => {
      setHoveredSquares([])
    }

    // Event listeners
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // Initial setup
    resizeCanvas()
    requestRef.current = requestAnimationFrame(updateAnimation)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize, trailLength, hoveredSquares])

  return <canvas ref={canvasRef} className={`w-full h-full border-none block ${className}`} />
}
