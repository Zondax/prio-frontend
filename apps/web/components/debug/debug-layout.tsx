import { cn } from '@/lib/utils'

interface DepthIndicatorDisplayProps {
  depth: number
  textColor: string
}

const patternAlpha = 0.2
const step = 30
const lineThicknessPx = 10
const lineGapPx = 40

const patternLineColors = [
  `rgba(255, 100, 100, ${patternAlpha})`, // Reddish
  `rgba(100, 100, 255, ${patternAlpha})`, // Bluish
  `rgba(255, 150, 100, ${patternAlpha})`, // Orangish
  `rgba(100, 255, 100, ${patternAlpha})`, // Greenish
  `rgba(255, 100, 255, ${patternAlpha})`, // Pinkish
  `rgba(100, 255, 255, ${patternAlpha})`, // Cyanish
  `rgba(255, 255, 100, ${patternAlpha})`, // Yellowish
  `rgba(150, 100, 255, ${patternAlpha})`, // Purplish
]

function DepthIndicatorDisplay({ depth, textColor }: DepthIndicatorDisplayProps) {
  return (
    <div // Depth Indicator
      style={{
        position: 'absolute',
        top: `${3}px`,
        left: `${3}px`,
        padding: '2px 4px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        color: textColor,
        fontSize: '24px',
        fontWeight: 'bold',
        borderRadius: '3px',
        lineHeight: '1',
        pointerEvents: 'none',
        zIndex: 9500 + depth,
        border: '1px solid rgba(255, 255, 255, 0.25)',
      }}
    >
      D:{depth}
    </div>
  )
}

interface PatternOverlayProps {
  index: number
  linePatternImage: string
  backgroundSizeForLines: string
}

function PatternOverlay({ index, linePatternImage, backgroundSizeForLines }: PatternOverlayProps) {
  return (
    <div // Pattern Overlay
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: linePatternImage,
        backgroundSize: backgroundSizeForLines,
        pointerEvents: 'none',
        zIndex: 9000 + index,
      }}
    />
  )
}

interface DebugLayoutProps {
  children: React.ReactNode
  index?: number
  className?: string
}

export default function DebugLayout({ children, index = 0, className }: DebugLayoutProps) {
  if (process.env.NEXT_PUBLIC_DEBUG_LAYOUT !== 'true') {
    if (className) {
      return <div className={className}>{children}</div>
    }
    return <>{children}</>
  }

  const lineColor = patternLineColors[index % patternLineColors.length]
  const lineAngles = Array.from({ length: 11 }, (_, i) => (i + 1) * step).filter((angle) => angle % 90 !== 0)
  const currentAngle = lineAngles[index % lineAngles.length]
  const totalLineCyclePx = lineThicknessPx + lineGapPx

  const linePatternImage = `repeating-linear-gradient(
    ${currentAngle}deg,
    ${lineColor},
    ${lineColor} ${lineThicknessPx}px,
    transparent ${lineThicknessPx}px,
    transparent ${totalLineCyclePx}px
  )`

  // Increase background size significantly to make lines appear much longer
  const backgroundSizeForLines = '2048px 2048px'
  const depthTextColor = lineColor.replace(patternAlpha.toString(), '1')

  return (
    <div
      className={cn('flex flex-col', className)}
      style={{
        position: 'relative',
        outline: `2px solid ${patternLineColors[index % patternLineColors.length].replace('0.75', '0.9')}`,
        outlineOffset: '-2px',
      }}
    >
      <PatternOverlay index={index} linePatternImage={linePatternImage} backgroundSizeForLines={backgroundSizeForLines} />
      <div className="flex-1">{children}</div>
      <DepthIndicatorDisplay depth={index} textColor={depthTextColor} />
    </div>
  )
}
