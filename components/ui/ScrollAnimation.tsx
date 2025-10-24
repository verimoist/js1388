"use client"

import { ReactNode } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

interface ScrollAnimationProps {
  children: ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  duration?: number
  className?: string
}

export default function ScrollAnimation({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = ''
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation()

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out'
    const durationClass = `duration-[${duration}ms]`
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeIn':
          return `${baseClasses} ${durationClass} opacity-0`
        case 'slideUp':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`
        case 'slideLeft':
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-8`
        case 'slideRight':
          return `${baseClasses} ${durationClass} opacity-0 translate-x-8`
        case 'scale':
          return `${baseClasses} ${durationClass} opacity-0 scale-95`
        default:
          return `${baseClasses} ${durationClass} opacity-0`
      }
    } else {
      return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}
