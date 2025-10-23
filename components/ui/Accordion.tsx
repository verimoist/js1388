'use client'

import { ReactNode, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

const Accordion = ({ items, allowMultiple = false, className = '' }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <div key={item.id} className="border-b border-gray-200 last:border-b-0">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full py-4 px-0 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown 
              className={clsx(
                'h-5 w-5 text-gray-500 transition-transform duration-200',
                openItems.includes(item.id) && 'rotate-180'
              )}
            />
          </button>
          {openItems.includes(item.id) && (
            <div className="pb-4 text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion
