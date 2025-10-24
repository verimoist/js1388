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
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id
        session.user.role = (user as any).role || "user"
      }
      return session
    },
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      if (account?.provider === "github") {
        // GitHub 로그인 시 관리자 권한 체크
        const adminEmail = process.env.ADMIN_EMAIL
        console.log("Sign in attempt:", { userEmail: user.email, adminEmail })
        
        if (user.email === adminEmail) {
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
