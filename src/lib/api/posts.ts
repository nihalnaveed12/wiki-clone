export async function fetchPosts(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/blogs`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deletePost(baseUrl: string, postId: string) {
  const res = await fetch(`${baseUrl}/api/admin/delete-blog?id=${postId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
