// 확장된 스모크 테스트 스크립트
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3002'
  const results = {
    healthCheck: null,
    cacheInvalidation: null,
    noticesNew: null,
    pressNew: null,
    galleryNew: null,
    resourcesNew: null,
    attachmentTest: null
  }

  console.log('=== 확장된 스모크 테스트 시작 ===')

  // 1. 헬스체크 테스트
  try {
    console.log('1. 헬스체크 테스트...')
    const response = await fetch(`${baseUrl}/api/health`)
    const data = await response.json()
    results.healthCheck = {
      status: response.status,
      success: response.ok,
      services: data.services,
      message: response.ok ? '헬스체크 성공' : '헬스체크 실패'
    }
    console.log('✅ 헬스체크:', results.healthCheck.message)
  } catch (error) {
    results.healthCheck = { success: false, error: error.message }
    console.log('❌ 헬스체크 오류:', error.message)
  }

  // 2. 캐시 무효화 테스트
  try {
    console.log('2. 캐시 무효화 테스트...')
    const response = await fetch(`${baseUrl}/api/health?invalidate=notices`)
    const data = await response.json()
    results.cacheInvalidation = {
      status: response.status,
      success: response.ok,
      cacheInvalidation: data.cacheInvalidation,
      message: response.ok ? '캐시 무효화 성공' : '캐시 무효화 실패'
    }
    console.log('✅ 캐시 무효화:', results.cacheInvalidation.message)
  } catch (error) {
    results.cacheInvalidation = { success: false, error: error.message }
    console.log('❌ 캐시 무효화 오류:', error.message)
  }

  // 3. 공지사항 새 글 작성 페이지 테스트
  try {
    console.log('3. 공지사항 새 글 작성 페이지 테스트...')
    const response = await fetch(`${baseUrl}/admin/notices/new`)
    results.noticesNew = {
      status: response.status,
      success: response.ok,
      message: response.ok ? '공지사항 작성 페이지 접근 성공' : '공지사항 작성 페이지 접근 실패'
    }
    console.log('✅ 공지사항 작성:', results.noticesNew.message)
  } catch (error) {
    results.noticesNew = { success: false, error: error.message }
    console.log('❌ 공지사항 작성 오류:', error.message)
  }

  // 4. 보도자료 새 글 작성 페이지 테스트
  try {
    console.log('4. 보도자료 새 글 작성 페이지 테스트...')
    const response = await fetch(`${baseUrl}/admin/press/new`)
    results.pressNew = {
      status: response.status,
      success: response.ok,
      message: response.ok ? '보도자료 작성 페이지 접근 성공' : '보도자료 작성 페이지 접근 실패'
    }
    console.log('✅ 보도자료 작성:', results.pressNew.message)
  } catch (error) {
    results.pressNew = { success: false, error: error.message }
    console.log('❌ 보도자료 작성 오류:', error.message)
  }

  // 5. 갤러리 새 항목 추가 페이지 테스트
  try {
    console.log('5. 갤러리 새 항목 추가 페이지 테스트...')
    const response = await fetch(`${baseUrl}/admin/gallery/new`)
    results.galleryNew = {
      status: response.status,
      success: response.ok,
      message: response.ok ? '갤러리 작성 페이지 접근 성공' : '갤러리 작성 페이지 접근 실패'
    }
    console.log('✅ 갤러리 작성:', results.galleryNew.message)
  } catch (error) {
    results.galleryNew = { success: false, error: error.message }
    console.log('❌ 갤러리 작성 오류:', error.message)
  }

  // 6. 자료실 새 자료 추가 페이지 테스트
  try {
    console.log('6. 자료실 새 자료 추가 페이지 테스트...')
    const response = await fetch(`${baseUrl}/admin/resources/new`)
    results.resourcesNew = {
      status: response.status,
      success: response.ok,
      message: response.ok ? '자료실 작성 페이지 접근 성공' : '자료실 작성 페이지 접근 실패'
    }
    console.log('✅ 자료실 작성:', results.resourcesNew.message)
  } catch (error) {
    results.resourcesNew = { success: false, error: error.message }
    console.log('❌ 자료실 작성 오류:', error.message)
  }

  // 7. 첨부파일 업로드 테스트
  try {
    console.log('7. 첨부파일 업로드 테스트...')
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
    const formData = new FormData()
    formData.append('file', testFile)
    formData.append('folder', 'notice')

    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const result = await response.json()
      results.attachmentTest = {
        success: true,
        blobUrl: result.url,
        message: '첨부파일 업로드 성공'
      }
      console.log('✅ 첨부파일 업로드:', results.attachmentTest.message)
      console.log('📎 Blob URL:', result.url)
    } else {
      const error = await response.json()
      results.attachmentTest = {
        success: false,
        error: error.error,
        message: '첨부파일 업로드 실패'
      }
      console.log('❌ 첨부파일 업로드:', results.attachmentTest.message)
    }
  } catch (error) {
    results.attachmentTest = { success: false, error: error.message }
    console.log('❌ 첨부파일 업로드 오류:', error.message)
  }

  console.log('=== 확장된 스모크 테스트 결과 요약 ===')
  console.table(results)
  
  return results
}

// 프로덕션 테스트 함수
const testProduction = async () => {
  const baseUrl = 'https://js1388.vercel.app'
  console.log('=== 프로덕션 테스트 시작 ===')
  
  try {
    // 헬스체크
    const healthResponse = await fetch(`${baseUrl}/api/health`)
    const healthData = await healthResponse.json()
    console.log('프로덕션 헬스체크:', healthData)
    
    // 캐시 무효화 테스트
    const cacheResponse = await fetch(`${baseUrl}/api/health?invalidate=notices`)
    const cacheData = await cacheResponse.json()
    console.log('프로덕션 캐시 무효화:', cacheData.cacheInvalidation)
    
    return { health: healthData, cache: cacheData }
  } catch (error) {
    console.error('프로덕션 테스트 오류:', error)
    return { error: error.message }
  }
}

// 브라우저에서 실행할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  window.testEndpoints = testEndpoints
  window.testProduction = testProduction
  console.log('확장된 스모크 테스트 함수 등록됨.')
  console.log('- 로컬 테스트: testEndpoints()')
  console.log('- 프로덕션 테스트: testProduction()')
}
