"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUsers, updateUserRole } from "@/lib/api/users";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo: string;
}

export default function UsersTab({ baseUrl, adminEmail }: { baseUrl: string; adminEmail: string }) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const adminCount = users.filter((u) => u.role === "admin").length;

  useEffect(() => {
    setLoading(true);
    fetchUsers(baseUrl)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [baseUrl]);

  async function handleRoleChange(userId: string, newRole: "admin" | "user") {
    if (!confirm(`Change role to ${newRole}?`)) return;
    setUpdatingId(userId);
    try {
      await updateUserRole(baseUrl, userId, newRole);
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u: any) => (
            <div key={u._id} className="border p-4 rounded-lg shadow bg-gray-50">
              <Image src={u.photo} alt={u.firstName} width={64} height={64} className="rounded-full" />
              <h3 className="font-semibold">{u.firstName} {u.lastName}</h3>
              <p>{u.email}</p>
              {u.email !== adminEmail && (
                <button
                  onClick={() => handleRoleChange(u._id, u.role === "user" ? "admin" : "user")}
                  disabled={updatingId === u._id || (u.role === "user" && adminCount >= 3)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                >
                  {updatingId === u._id ? "Updating..." : u.role === "user" ? "Make Admin" : "Remove Admin"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
