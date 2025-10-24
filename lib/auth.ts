import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role || "user"
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "github") {
        // GitHub 로그인 시 관리자 권한 체크
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        const fallbackAdminEmail = process.env.ADMIN_EMAIL
        
        // 기존 단일 이메일도 지원 (하위 호환성)
        if (fallbackAdminEmail) {
          adminEmails.push(fallbackAdminEmail)
        }
        
        console.log("Sign in attempt:", { userEmail: user.email, adminEmails })
        
        if (adminEmails.includes(user.email)) {
          // 관리자 이메일인 경우 role을 admin으로 설정
          try {
            await prisma.user.update({
              where: { email: user.email! },
              data: { role: "admin" }
            })
            console.log("Admin role assigned to:", user.email)
          } catch (error) {
            console.error("Error assigning admin role:", error)
          }
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

// NextAuth 인스턴스는 app/api/auth/[...nextauth]/route.ts에서 사용됩니다
