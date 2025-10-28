// scripts/fix-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const email = "doori1388@naver.com";
  const name = "Doori";
  const plain = "admin123!";
  const hash = await bcrypt.hash(plain, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hash,
      role: "ADMIN",
      adminApproved: true,
      status: "ACTIVE",
    },
    create: {
      email,
      name,
      passwordHash: hash,
      role: "ADMIN",
      adminApproved: true,
      status: "ACTIVE",
    } as any,
  });

  console.log("UPSERTED:", { id: user.id, email: user.email, role: user.role });
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
