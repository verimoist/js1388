"use client";
import { useState, useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users/pending");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  async function approve(id: string) {
    await fetch(`/api/admin/users/${id}/approve`, { method: "POST" });
    fetchUsers();
  }
  async function promote(id: string) {
    await fetch(`/api/admin/users/${id}/promote`, { method: "POST" });
    fetchUsers();
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">승인 대기 사용자</h1>
      <ul className="space-y-2">
        {users.map((u: any) => (
          <li key={u.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-sm text-gray-500">{u.name} / {u.role}</div>
            </div>
            <div className="space-x-2">
              <button onClick={()=>approve(u.id)} className="px-3 py-1 rounded bg-blue-600 text-white">승인</button>
              <button onClick={()=>promote(u.id)} className="px-3 py-1 rounded bg-black text-white">관리자 승격</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
