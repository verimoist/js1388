import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !(user as any).passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, (user as any).passwordHash);
        if (!ok) return null;
        // 로그인은 성공. /admin 권한은 middleware에서 확인.
        return { id: user.id, email: user.email, name: user.name ?? "" } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        try {
          const u = await prisma.user.findUnique({ where: { email: user.email } });
          token.role = (u as any)?.role ?? "USER";
          token.approved = (u as any)?.approved ?? false;
        } catch (error) {
          console.error("JWT callback error:", error);
          token.role = "USER";
          token.approved = false;
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role ?? "USER";
      (session.user as any).approved = token.approved ?? false;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        try {
          // GitHub 사용자가 이미 존재하는지 확인
          const existingUser = await prisma.user.findUnique({ 
            where: { email: user.email! } 
          });
          
          if (!existingUser) {
            // 새 사용자 생성 (PrismaAdapter가 처리하지만 추가 설정)
            console.log("Creating new GitHub user:", user.email);
          } else {
            console.log("Existing GitHub user:", user.email);
          }
          
          return true;
        } catch (error) {
          console.error("GitHub signIn error:", error);
          return true; // 오류가 있어도 로그인 허용
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 홈페이지로
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/"; 
    },
  },
  pages: { signIn: "/auth/signin", error: "/auth/signin" },
  debug: process.env.NODE_ENV === "development",
});
