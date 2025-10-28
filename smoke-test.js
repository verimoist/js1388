// 스모크 테스트 스크립트
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3002'
  const results = {
    debugSystem: null,
    noticesNew: null,
    pressNew: null,
    galleryNew: null,
    resourcesNew: null
  }

  console.log('=== 로컬 스모크 테스트 시작 ===')

  // 1. 디버그 시스템 테스트
  try {
    console.log('1. 디버그 시스템 테스트...')
    const response = await fetch(`${baseUrl}/debug-system`)
    results.debugSystem = {
      status: response.status,
      success: response.ok,
      message: response.ok ? '디버그 페이지 접근 성공' : '디버그 페이지 접근 실패'
    }
    console.log('✅ 디버그 시스템:', results.debugSystem.message)
  } catch (error) {
    results.debugSystem = { success: false, error: error.message }
    console.log('❌ 디버그 시스템 오류:', error.message)
  }

  // 2. 공지사항 새 글 작성 페이지 테스트
  try {
    console.log('2. 공지사항 새 글 작성 페이지 테스트...')
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

  // 3. 보도자료 새 글 작성 페이지 테스트
  try {
    console.log('3. 보도자료 새 글 작성 페이지 테스트...')
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

  // 4. 갤러리 새 항목 추가 페이지 테스트
  try {
    console.log('4. 갤러리 새 항목 추가 페이지 테스트...')
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

  // 5. 자료실 새 자료 추가 페이지 테스트
  try {
    console.log('5. 자료실 새 자료 추가 페이지 테스트...')
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

  console.log('=== 스모크 테스트 결과 요약 ===')
  console.table(results)
  
  return results
}

// 브라우저에서 실행할 수 있도록 전역 함수로 등록
if (typeof window !== 'undefined') {
  window.testEndpoints = testEndpoints
  console.log('스모크 테스트 함수 등록됨. 브라우저 콘솔에서 testEndpoints() 실행하세요.')
}
