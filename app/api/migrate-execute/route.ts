import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔄 데이터베이스 마이그레이션 실행 시작...");
    
    // 1. passwordHash 컬럼 추가 (없는 경우)
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordHash" TEXT;
      `;
      console.log("✅ passwordHash 컬럼 추가 완료");
    } catch (error) {
      console.log("passwordHash 컬럼 추가 중 오류 (이미 존재할 수 있음):", error);
    }
    
    // 2. approved 컬럼 추가 (없는 경우)
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "approved" BOOLEAN NOT NULL DEFAULT false;
      `;
      console.log("✅ approved 컬럼 추가 완료");
    } catch (error) {
      console.log("approved 컬럼 추가 중 오류 (이미 존재할 수 있음):", error);
    }
    
    // 3. 기존 adminApproved 컬럼이 있다면 approved로 마이그레이션
    try {
      await prisma.$executeRaw`
        UPDATE "User" SET "approved" = "adminApproved" WHERE "adminApproved" IS NOT NULL;
      `;
      console.log("✅ adminApproved → approved 마이그레이션 완료");
    } catch (error) {
      console.log("adminApproved 마이그레이션 중 오류 (컬럼이 없을 수 있음):", error);
    }
    
    // 4. 기존 status 컬럼이 있다면 approved로 마이그레이션
    try {
      await prisma.$executeRaw`
        UPDATE "User" SET "approved" = true WHERE "status" = 'ACTIVE';
      `;
      console.log("✅ status → approved 마이그레이션 완료");
    } catch (error) {
      console.log("status 마이그레이션 중 오류 (컬럼이 없을 수 있음):", error);
    }
    
    // 5. doori1388@naver.com 계정을 관리자로 설정
    try {
      const dooriUser = await prisma.user.findUnique({
        where: { email: "doori1388@naver.com" }
      });
      
      if (dooriUser) {
        await prisma.user.update({
          where: { email: "doori1388@naver.com" },
          data: {
            role: "ADMIN",
            approved: true,
            passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password
          }
        });
        console.log("✅ doori1388@naver.com 관리자 계정 설정 완료");
      } else {
        // 계정이 없으면 생성
        await prisma.user.create({
          data: {
            email: "doori1388@naver.com",
            name: "Doori",
            role: "ADMIN",
            approved: true,
            passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi" // password
          }
        });
        console.log("✅ doori1388@naver.com 관리자 계정 생성 완료");
      }
    } catch (error) {
      console.log("doori 계정 설정 중 오류:", error);
    }
    
    // 6. 최종 상태 확인
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        approved: true,
        passwordHash: true
      }
    });
    
    console.log("✅ 마이그레이션 완료. 현재 사용자:", users);
    
    return NextResponse.json({ 
      success: true,
      message: "데이터베이스 마이그레이션이 완료되었습니다.",
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        approved: u.approved,
        hasPassword: !!u.passwordHash
      }))
    });
    
  } catch (error) {
    console.error("❌ 마이그레이션 실행 중 오류:", error);
    return NextResponse.json({ 
      error: "마이그레이션 실행 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
