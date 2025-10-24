const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 데이터베이스 사용자 상태 확인...\n')
    
    // 모든 사용자 조회
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })
    
    console.log('📋 현재 사용자 목록:')
    users.forEach((user, index) => {
      console.log(`${index + 1}. 이메일: ${user.email}`)
      console.log(`   이름: ${user.name}`)
      console.log(`   권한: ${user.role}`)
      console.log(`   비밀번호: ${user.password ? '설정됨' : '없음'}`)
      console.log(`   ID: ${user.id}`)
      console.log('')
    })
    
    // doori1388@naver.com 사용자 상세 확인
    const dooriUser = await prisma.user.findUnique({
      where: { email: 'doori1388@naver.com' }
    })
    
    if (dooriUser) {
      console.log('🎯 doori1388@naver.com 상세 정보:')
      console.log(JSON.stringify(dooriUser, null, 2))
    } else {
      console.log('❌ doori1388@naver.com 사용자를 찾을 수 없습니다!')
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
