import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role || "user"
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        // GitHub 로그인 시 관리자 권한 체크
        const adminEmail = process.env.ADMIN_EMAIL
        if (user.email === adminEmail) {
          // 관리자 이메일인 경우 role을 admin으로 설정
          await prisma.user.update({
            where: { email: user.email! },
            data: { role: "admin" }
          })
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
