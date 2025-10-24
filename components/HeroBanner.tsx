"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Button from "./ui/Button"
import { SITE } from "../lib/site"

export default function HeroBanner() {
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* 고급스러운 배경 패턴 */}
      <div className="absolute inset-0">
        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-100/30"></div>
        
        {/* 기하학적 패턴 */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-sm"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-cyan-300/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-green-300/30 to-teal-400/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-300/30 to-indigo-400/20 rounded-full blur-sm"></div>
        
        {/* 추가 장식 요소 */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-orange-200/20 to-pink-300/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-gradient-to-br from-purple-200/20 to-violet-300/20 rounded-full blur-sm"></div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* 로고와 사이트명 */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src="/assets/images/logo.svg"
                alt="자림터 로고"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-green-600 mb-2">
                  {SITE.name}
                </h1>
                <div className="w-24 h-1 bg-green-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* 메인 메시지 */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              청소년의 성장과 자람을 돕는 
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                지역 자람터
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
              상담·진로·자람 프로그램을 통해 청소년들의 꿈과 희망을 응원합니다.
              <br />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                더불어 함께 사는 세상
              </span>을 만들어갑니다.
            </p>
          </div>

          {/* CTA 버튼들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/programs">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>프로그램</span>
                    <span className="text-xs opacity-90">보기</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/news">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>공지사항</span>
                    <span className="text-xs opacity-90">확인</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/gallery">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>갤러리</span>
                    <span className="text-xs opacity-90">보기</span>
                  </div>
                </div>
              </div>
            </Link>
            
            <a 
              href="https://me2.do/xoYOEKQ5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <svg className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>후원신청</span>
                  <span className="text-xs opacity-90">하기</span>
                </div>
              </div>
            </a>
          </div>

          {/* 하단 정보 */}
          <div className="mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">전라남도 장성군 장성읍 매화6길 8</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">061-810-1388</span>
            </div>
          </div>
        </div>
      </div>

      {/* 장식적 요소들 */}
      <div className="absolute top-10 right-10 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-20"></div>
    </div>
  )
}
