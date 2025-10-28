"use client";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
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

  const act = async (id: string, action: "approve" | "reject" | "promote") => {
    setActionLoading(id);
    try {
      const r = await fetch(`/api/admin/users/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (r.ok) {
        fetchUsers(); // Refresh the list
      } else {
        const error = await r.json();
        alert("실패: " + (error.error || "알 수 없는 오류"));
      }
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const pending = users.filter((u) => !u.approved);
  const approved = users.filter((u) => u.approved);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">사용자 승인/권한 관리</h1>
        <p className="mt-2 text-gray-600">사용자 승인 및 관리자 권한을 관리합니다.</p>
      </div>

      {/* 승인 대기 */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          승인 대기 ({pending.length}명)
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">승인 대기 중인 사용자가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((u) => (
              <div
                key={u.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-gray-900">{u.email}</div>
                  {u.name && <div className="text-sm text-gray-600">{u.name}</div>}
                  <div className="text-xs text-gray-500">
                    가입일: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => act(u.id, "approve")}
                    disabled={actionLoading === u.id}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === u.id ? "처리중..." : "승인"}
                  </button>
                  <button
                    onClick={() => act(u.id, "reject")}
                    disabled={actionLoading === u.id}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 승인됨 */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          승인된 사용자 ({approved.length}명)
        </h2>
        {approved.length === 0 ? (
          <p className="text-gray-500">승인된 사용자가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((u) => (
              <div
                key={u.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-gray-900">{u.email}</div>
                  {u.name && <div className="text-sm text-gray-600">{u.name}</div>}
                  <div className="text-xs text-gray-500">
                    권한: {u.role} · 가입일: {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => act(u.id, "promote")}
                      disabled={actionLoading === u.id}
                      className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === u.id ? "처리중..." : "ADMIN 승격"}
                    </button>
                  )}
                  {u.role === "ADMIN" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      관리자
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
