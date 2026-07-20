"use client";

import { useEffect, useState } from "react";
import { api, type PublicUser } from "@/lib/admin/api";

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-[var(--admin-muted)] mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-[var(--admin-muted)]">Loading...</p>
        ) : users.length === 0 ? (
          <p className="p-8 text-center text-[var(--admin-muted)]">No registered customers yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Name</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Email</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Phone</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Provider</th>
                <th className="text-left p-4 font-medium text-[var(--admin-muted)]">Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-[var(--admin-muted)]">{user.email}</td>
                  <td className="p-4">{user.phone ?? "—"}</td>
                  <td className="p-4 capitalize">{user.provider}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.emailVerified ? "bg-green-100 text-green-700" : "bg-slate-100"}`}>
                      {user.emailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
