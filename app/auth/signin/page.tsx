"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/admin" });
    if (res?.error) alert("로그인 실패: " + res.error);
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">관리자 로그인</h1>

      <button onClick={() => signIn("github", { callbackUrl: "/admin" })} className="w-full h-11 rounded bg-black text-white">GitHub로 로그인</button>

      <div className="my-4 text-center text-sm text-gray-400">또는</div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="이메일" className="w-full border rounded p-3" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="비밀번호" className="w-full border rounded p-3" />
        <button type="submit" className="w-full h-11 rounded bg-blue-600 text-white">이메일로 로그인</button>
      </form>

      <div className="mt-4 text-right text-sm">
        <Link href="/auth/signup" className="underline">회원가입</Link>
      </div>

      <p className="mt-6 text-xs text-gray-500">관리자 승인 이전에는 /admin 접근이 제한됩니다.</p>
    </div>
  );
}