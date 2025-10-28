// 프로덕션 스모크 테스트 스크립트
const baseUrl = 'https://js1388.vercel.app'

async function smokeTest() {
  console.log('=== 프로덕션 스모크 테스트 시작 ===')
  
  const results = {
    healthCheck: { success: false, details: null },
    galleryCreate: { success: false, details: null },
    galleryList: { success: false, details: null },
    cacheInvalidation: { success: false, details: null }
  }

  try {
    // 1. 헬스체크 테스트
    console.log('1. 헬스체크 테스트...')
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      results.healthCheck = {
        success: true,
        details: {
          environment: healthData.environment,
          database: healthData.services?.database,
          nextAuth: healthData.services?.nextAuth,
          vercelBlob: healthData.services?.vercelBlob
        }
      }
      console.log('✅ 헬스체크 성공:', results.healthCheck.details)
    } else {
      console.log('❌ 헬스체크 실패:', healthResponse.status)
    }

    // 2. 캐시 무효화 테스트
    console.log('2. 캐시 무효화 테스트...')
    const cacheResponse = await fetch(`${baseUrl}/api/health?invalidate=gallery`)
    if (cacheResponse.ok) {
      const cacheData = await cacheResponse.json()
      results.cacheInvalidation = {
        success: !!cacheData.cacheInvalidation,
        details: cacheData.cacheInvalidation
      }
      console.log('✅ 캐시 무효화:', results.cacheInvalidation.details)
    } else {
      console.log('❌ 캐시 무효화 실패:', cacheResponse.status)
    }

    // 3. 갤러리 목록 조회 테스트
    console.log('3. 갤러리 목록 조회 테스트...')
    const galleryListResponse = await fetch(`${baseUrl}/api/gallery`)
    if (galleryListResponse.ok) {
      const galleryData = await galleryListResponse.json()
      results.galleryList = {
        success: true,
        details: {
          count: galleryData.length,
          hasAttachments: galleryData.some(item => item.attachments && item.attachments.length > 0)
        }
      }
      console.log('✅ 갤러리 목록 조회 성공:', results.galleryList.details)
    } else {
      console.log('❌ 갤러리 목록 조회 실패:', galleryListResponse.status)
    }

    // 4. 갤러리 생성 테스트 (관리자 권한 필요하므로 실제로는 불가능)
    console.log('4. 갤러리 생성 API 엔드포인트 접근 테스트...')
    const galleryCreateResponse = await fetch(`${baseUrl}/api/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '테스트 갤러리',
        caption: '스모크 테스트용',
        imageUrl: 'https://example.com/test.jpg',
        attachments: []
      })
    })
    
    // 403 (권한 없음)이면 API는 정상 작동하는 것
    if (galleryCreateResponse.status === 403) {
      results.galleryCreate = {
        success: true,
        details: 'API 엔드포인트 정상 작동 (권한 없음으로 예상된 응답)'
      }
      console.log('✅ 갤러리 생성 API 정상:', results.galleryCreate.details)
    } else {
      const errorData = await galleryCreateResponse.json()
      results.galleryCreate = {
        success: false,
        details: `예상치 못한 응답: ${galleryCreateResponse.status} - ${errorData.error || '알 수 없는 오류'}`
      }
      console.log('❌ 갤러리 생성 API 오류:', results.galleryCreate.details)
    }

  } catch (error) {
    console.error('스모크 테스트 오류:', error)
  }

  console.log('\n=== 스모크 테스트 결과 요약 ===')
  console.table(results)
  
  const allPassed = Object.values(results).every(result => result.success)
  console.log(`\n전체 테스트 결과: ${allPassed ? '✅ 성공' : '❌ 실패'}`)
  
  return results
}

// 브라우저에서 실행 가능하도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  window.smokeTest = smokeTest
  console.log('스모크 테스트 함수 등록됨. 브라우저 콘솔에서 smokeTest() 실행하세요.')
}

// Node.js에서 직접 실행
if (typeof window === 'undefined') {
  smokeTest().then(results => {
    process.exit(Object.values(results).every(result => result.success) ? 0 : 1)
  })
}
