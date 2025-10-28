"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/signup", { method: "POST", body: JSON.stringify({ email, name, password }) });
    if (!r.ok) return alert("회원가입 실패");
    router.push("/auth/pending");
  }

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">회원가입(관리자 승인 필요)</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="이메일" className="w-full border rounded p-3" />
        <input value={name} onChange={e=>setName(e.target.value)} type="text" placeholder="이름(선택)" className="w-full border rounded p-3" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="비밀번호" className="w-full border rounded p-3" />
        <button className="w-full h-11 rounded bg-green-600 text-white">회원가입</button>
      </form>
    </div>
  );
}