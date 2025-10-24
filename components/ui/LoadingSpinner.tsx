"use client"

import { useEffect, useState } from 'react'

interface LoadingSpinnerProps {
  isLoading: boolean
}

export default function LoadingSpinner({ isLoading }: LoadingSpinnerProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
    } else {
      const timer = setTimeout(() => setShow(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
      isLoading ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="flex flex-col items-center space-y-4">
        {/* 스피너 애니메이션 */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-green-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        {/* 로딩 텍스트 */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 mb-1">로딩 중...</p>
          <p className="text-sm text-gray-500">잠시만 기다려주세요</p>
        </div>
        
        {/* 프로그레스 바 */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
