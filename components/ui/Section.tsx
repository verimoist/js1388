import { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'gray' | 'primary' | 'premium' | 'premium-dark'
}

const Section = ({ children, className = '', background = 'white' }: SectionProps) => {
  const backgroundClasses = {
    white: 'bg-white/90 backdrop-blur-sm',
    gray: 'bg-gradient-to-br from-gray-50/80 via-slate-50/60 to-gray-100/40 backdrop-blur-sm',
    primary: 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800',
    premium: 'section-premium',
    'premium-dark': 'section-premium-dark'
  }

  return (
    <section className={`py-20 ${backgroundClasses[background]} ${className}`}>
      <Container>
        {children}
      </Container>
    </section>
  )
}

export default Section
