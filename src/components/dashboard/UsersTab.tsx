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
  <h2 className="text-xl font-semibold mb-4 text-card-foreground">All Users</h2>
  {loading ? (
    <p className="text-card-foreground">Loading...</p>
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((u: any) => (
        <div key={u._id} className="border border-border p-4 rounded-lg shadow bg-card">
          <Image 
            src={u.photo} 
            alt={u.firstName} 
            width={64} 
            height={64} 
            className="rounded-full border border-border" 
          />
          <h3 className="font-semibold text-card-foreground mt-2">
            {u.firstName} {u.lastName}
          </h3>
          <p className="text-muted-foreground">{u.email}</p>
          {u.email !== adminEmail && (
            <button
              onClick={() => handleRoleChange(u._id, u.role === "user" ? "admin" : "user")}
              disabled={updatingId === u._id || (u.role === "user" && adminCount >= 3)}
              className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
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
