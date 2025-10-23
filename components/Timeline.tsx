interface TimelineItem {
  year: string
  title: string
  description: string
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const Timeline = ({ items, className = '' }: TimelineProps) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="relative">
          {/* 연결선 */}
          {index < items.length - 1 && (
            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-300"></div>
          )}
          
          <div className="flex items-start space-x-6">
            {/* 연도 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {item.year}
              </div>
            </div>
            
            {/* 내용 */}
            <div className="flex-1 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
