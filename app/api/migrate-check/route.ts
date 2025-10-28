import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔄 데이터베이스 마이그레이션 시작...");
    
    // 현재 User 테이블 구조 확인
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `;
    
    console.log("현재 User 테이블 구조:", result);
    
    // passwordHash 컬럼이 있는지 확인
    const columns = result as any[];
    const hasPasswordHash = columns.some(col => col.column_name === 'passwordHash');
    const hasApproved = columns.some(col => col.column_name === 'approved');
    
    if (!hasPasswordHash) {
      console.log("❌ passwordHash 컬럼이 없습니다. 마이그레이션이 필요합니다.");
      return NextResponse.json({ 
        error: "passwordHash 컬럼이 없습니다. 마이그레이션이 필요합니다.",
        currentColumns: columns.map(col => col.column_name),
        needsMigration: true
      }, { status: 400 });
    }
    
    if (!hasApproved) {
      console.log("❌ approved 컬럼이 없습니다. 마이그레이션이 필요합니다.");
      return NextResponse.json({ 
        error: "approved 컬럼이 없습니다. 마이그레이션이 필요합니다.",
        currentColumns: columns.map(col => col.column_name),
        needsMigration: true
      }, { status: 400 });
    }
    
    console.log("✅ 모든 필요한 컬럼이 존재합니다.");
    
    // 기존 사용자 데이터 확인
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        approved: true,
        passwordHash: true
      }
    });
    
    console.log("현재 사용자 데이터:", users);
    
    return NextResponse.json({ 
      success: true,
      message: "데이터베이스 스키마가 올바릅니다.",
      currentColumns: columns.map(col => col.column_name),
      userCount: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        approved: u.approved,
        hasPassword: !!u.passwordHash
      }))
    });
    
  } catch (error) {
    console.error("❌ 마이그레이션 확인 중 오류:", error);
    return NextResponse.json({ 
      error: "마이그레이션 확인 중 오류가 발생했습니다.",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
