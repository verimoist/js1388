import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  
  if (!email || !password) {
    console.log("skip: no seed admin env")
    return
  }
  
  const passwordHash = await hash(password, 12)
  
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, role: "ADMIN", name: "Admin" }
  })
  
  console.log("seed admin ok")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
