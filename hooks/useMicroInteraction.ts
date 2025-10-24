"use client"

import { useState, useCallback } from 'react'

interface UseMicroInteractionOptions {
  scale?: number
  duration?: number
  ripple?: boolean
}

export function useMicroInteraction(options: UseMicroInteractionOptions = {}) {
  const { scale = 0.95, duration = 150, ripple = true } = options
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPressed(true)
    
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const newRipple = {
        id: Date.now(),
        x,
        y
      }
      
      setRipples(prev => [...prev, newRipple])
      
      // 리플 애니메이션 완료 후 제거
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }
  }, [ripple])

  const handleMouseUp = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsPressed(false)
  }, [])

  const getInteractionClasses = () => {
    return `transition-transform duration-${duration} ${
      isPressed ? `scale-${Math.round(scale * 100)}` : 'scale-100'
    }`
  }

  return {
    isPressed,
    ripples,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    getInteractionClasses
  }
}
