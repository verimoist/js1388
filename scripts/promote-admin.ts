// scripts/promote-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "doori1388@naver.com";
  const name = "Doori";
  const plainPassword = "admin123!";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        status: "ACTIVE",
        adminApproved: true,
        passwordHash,
      },
      create: {
        email,
        name,
        passwordHash,
        role: "ADMIN",
        status: "ACTIVE",
        adminApproved: true,
      },
    });

    console.log("✅ 관리자 계정 적용 완료:");
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
    console.log(`Admin Approved: ${user.adminApproved}`);
    console.log(`Password: ${plainPassword}`);
  } catch (error) {
    console.error("❌ 관리자 권한 부여 중 오류:", error);
    throw error;
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ 스크립트 실행 중 오류:", err);
    prisma.$disconnect();
    process.exit(1);
  });
