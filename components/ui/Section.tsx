import { ReactNode } from 'react'
import Container from './Container'

interface SectionProps {
  children: ReactNode
  className?: string
  background?: 'white' | 'gray' | 'primary'
}

const Section = ({ children, className = '', background = 'white' }: SectionProps) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-brand-primary'
  }

  return (
    <section className={`py-16 ${backgroundClasses[background]} ${className}`}>
      <Container>
        {children}
      </Container>
    </section>
  )
}

export default Section
