'use client'

import { useEffect, useRef } from 'react'

interface AutoScrollProps {
  dependencyArray: any[]
  scrollAreaClassName?: string
  scrollBehavior?: ScrollBehavior
}

export default function AutoScroll({ dependencyArray, scrollAreaClassName = 'scroll-area', scrollBehavior = 'smooth' }: AutoScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: scrollBehavior,
      })
    }
  }, [dependencyArray, scrollBehavior])

  return <div ref={scrollRef} className={scrollAreaClassName} />
}
