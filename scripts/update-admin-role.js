const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdminRole() {
  try {
    // doori1388@naver.com 사용자의 권한을 admin으로 업데이트
    const user = await prisma.user.update({
      where: { email: 'doori1388@naver.com' },
      data: { role: 'admin' }
    })
    
    console.log('✅ 사용자 권한 업데이트 성공:', {
      email: user.email,
      role: user.role,
      name: user.name
    })
    
    // 모든 사용자 목록 확인
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        name: true
      }
    })
    
    console.log('\n📋 현재 사용자 목록:')
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - 권한: ${user.role}`)
    })
    
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminRole()
