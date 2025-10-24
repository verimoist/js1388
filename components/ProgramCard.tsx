import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Users, Calendar, MapPin } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

interface Program {
  id: number
  title: string
  description: string
  services: string[]
  target: string
  schedule: string
  location: string
  image: string
}

interface ProgramCardProps {
  program: Program
  className?: string
}

const ProgramCard = ({ program, className = '' }: ProgramCardProps) => {
  return (
    <Card hover className={`h-full ${className}`}>
      <div className="space-y-4">
        {/* 이미지 */}
        <div className="relative h-48 overflow-hidden rounded-lg">
          <Image
            src={program.image}
            alt={program.title}
            fill
            className="object-cover"
          />
        </div>

        {/* 내용 */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {program.title}
          </h3>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {program.description}
          </p>

          {/* 서비스 목록 */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">주요 서비스</h4>
            <ul className="space-y-1">
              {program.services.map((service, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-brand-primary" />
              <span>대상: {program.target}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-brand-primary" />
              <span>일정: {program.schedule}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-brand-primary" />
              <span>장소: {program.location}</span>
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="pt-4">
            <Link href={`/programs/${program.id}`} className="block">
              <Button variant="outline" size="sm" className="w-full group">
                자세히 보기
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProgramCard
