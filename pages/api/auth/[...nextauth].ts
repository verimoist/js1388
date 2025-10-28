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
        const u = await prisma.user.findUnique({ where: { email: user.email } });
        token.role = (u as any)?.role ?? "USER";
        token.approved = (u as any)?.approved ?? (u as any)?.adminApproved ?? false;
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
        // 유저가 없으면 생성(PrismaAdapter가 처리). 승인은 관리자에서 하게 둔다.
        // 로그인 자체는 허용하고 /admin 접근은 middleware가 막는다.
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // 로그인 후 기본 대시보드로
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl + "/"; 
    },
  },
  pages: { signIn: "/auth/signin", error: "/auth/signin" },
});
