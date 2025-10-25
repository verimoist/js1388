import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      }
    })
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
      console.log("Sign in attempt:", { 
        userEmail: user.email, 
        provider: account?.provider,
        userRole: user.role 
      })
      
      if (account?.provider === "github") {
        // GitHub 로그인 시 관리자 권한 체크
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        const fallbackAdminEmail = process.env.ADMIN_EMAIL
        
        // 기존 단일 이메일도 지원 (하위 호환성)
        if (fallbackAdminEmail) {
          adminEmails.push(fallbackAdminEmail)
        }
        
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
      } else if (account?.provider === "credentials") {
        // 이메일 로그인 시에도 관리자 권한 체크
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || []
        const fallbackAdminEmail = process.env.ADMIN_EMAIL
        
        // 기존 단일 이메일도 지원 (하위 호환성)
        if (fallbackAdminEmail) {
          adminEmails.push(fallbackAdminEmail)
        }
        
        if (adminEmails.includes(user.email)) {
          // 관리자 이메일인 경우 role을 admin으로 설정
          try {
            await prisma.user.update({
              where: { email: user.email! },
              data: { role: "admin" }
            })
            console.log("Admin role assigned to credentials user:", user.email)
            user.role = "admin" // 세션에 반영
          } catch (error) {
            console.error("Error assigning admin role to credentials user:", error)
          }
        }
        console.log("Credentials login - user role:", user.role)
      }
      
      return true
    },
  },
  pages: {
    signIn: "/auth/login",
  },
}

// NextAuth 인스턴스는 app/api/auth/[...nextauth]/route.ts에서 사용됩니다
