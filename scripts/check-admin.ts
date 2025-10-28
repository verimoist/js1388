// scripts/check-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "doori1388@naver.com";
  const pwd = "admin123!";

  const u = await prisma.user.findUnique({ where: { email } });
  if (!u) {
    console.log("NOT_FOUND");
    return;
  }
  console.log("USER:", {
    id: u.id,
    email: u.email,
    role: u.role,
    approved: u.approved ?? false,
    passwordHashLen: u.passwordHash?.length ?? 0,
  });

  if (!u.passwordHash) {
    console.log("NO_HASH");
    return;
  }
  const ok = await bcrypt.compare(pwd, u.passwordHash);
  console.log("BCRYPT_COMPARE:", ok);
}

main().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
