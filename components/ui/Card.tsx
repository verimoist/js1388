import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  premium?: boolean
}

const Card = ({ children, className = '', hover = false, premium = false }: CardProps) => {
  return (
    <div
      className={clsx(
        premium 
          ? 'card-premium p-8' 
          : 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
        hover && 'hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
