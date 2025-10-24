const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_MN9Vd0xHXrzY@ep-steep-leaf-ahvq0gga-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function createAdmin() {
  try {
    const email = "doori1388@naver.com"
    const password = "admin123!" // 임시 비밀번호
    const hashedPassword = await bcrypt.hash(password, 12)

    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // 기존 사용자 업데이트
      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: "admin"
        }
      })
      console.log("기존 사용자를 관리자로 업데이트했습니다:", email)
    } else {
      // 새 사용자 생성
      await prisma.user.create({
        data: {
          email,
          name: "관리자",
          password: hashedPassword,
          role: "admin"
        }
      })
      console.log("새 관리자 계정을 생성했습니다:", email)
    }

    console.log("로그인 정보:")
    console.log("이메일:", email)
    console.log("비밀번호:", password)
    console.log("⚠️  보안을 위해 로그인 후 비밀번호를 변경하세요!")
    
  } catch (error) {
    console.error("오류 발생:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
