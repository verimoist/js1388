const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_MN9Vd0xHXrzY@ep-steep-leaf-ahvq0gga-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function checkUserRole() {
  try {
    console.log('🔍 사용자 권한 확인 중...')
    
    // doori1388@naver.com 계정 확인
    const user = await prisma.user.findUnique({
      where: { email: 'doori1388@naver.com' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true
      }
    })
    
    if (user) {
      console.log('✅ 사용자 발견:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password
      })
      
      // 관리자 권한으로 업데이트
      if (user.role !== 'admin') {
        console.log('🔄 관리자 권한 부여 중...')
        await prisma.user.update({
          where: { email: 'doori1388@naver.com' },
          data: { role: 'admin' }
        })
        console.log('✅ 관리자 권한 부여 완료!')
      } else {
        console.log('✅ 이미 관리자 권한이 있습니다.')
      }
    } else {
      console.log('❌ 사용자를 찾을 수 없습니다.')
    }
    
    // 모든 사용자 목록 확인
    console.log('\n📋 모든 사용자 목록:')
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true
      }
    })
    
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name}) - ${user.role}`)
    })
    
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserRole()
