"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Button from "./ui/Button"

const slides = [
  {
    id: 1,
    image: "/assets/images/gallery1.jpg",
    title: "지역사회와 함께 성장하는",
    subtitle: "장성청소년자람터오늘",
    description: "모든 시민이 행복한 지역사회를 만들어가는 것이 우리의 사명입니다.",
    cta: "문의하기"
  },
  {
    id: 2,
    image: "/assets/images/gallery2.jpg",
    title: "청소년들의 꿈을 응원합니다",
    subtitle: "다양한 교육 프로그램",
    description: "미래를 준비하는 청소년들을 위한 체계적이고 전문적인 교육 서비스를 제공합니다.",
    cta: "프로그램 보기"
  },
  {
    id: 3,
    image: "/assets/images/gallery3.jpg",
    title: "진로 탐색의 기회를 제공합니다",
    subtitle: "진로체험센터",
    description: "다양한 직업 체험을 통해 진로를 탐색할 수 있는 체험형 교육 공간입니다.",
    cta: "체험 신청"
  },
  {
    id: 4,
    image: "/assets/images/gallery4.jpg",
    title: "안전하고 건전한 활동 공간",
    subtitle: "방과후 아카데미",
    description: "청소년들이 안전하고 건전한 환경에서 방과후 활동을 할 수 있는 공간을 제공합니다.",
    cta: "활동 참여"
  }
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* 슬라이드 이미지들 */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-blue-900/60" />
            
            {/* 콘텐츠 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {slide.title}
                  <br />
                  <span className="text-orange-400">{slide.subtitle}</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                  {slide.description}
                </p>
                <Link href="/contact">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="text-lg px-8 py-4"
                  >
                    {slide.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 네비게이션 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
        aria-label="이전 슬라이드"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
        aria-label="다음 슬라이드"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 인디케이터 도트 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide 
                ? "bg-white" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  )
}
