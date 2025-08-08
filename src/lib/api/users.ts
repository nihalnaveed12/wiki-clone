export async function fetchUsers(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/user`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateUserRole(baseUrl: string, userId: string, newRole: "admin" | "user") {
  const res = await fetch(`${baseUrl}/api/admin/manage-users`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUserId: userId, newRole }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
