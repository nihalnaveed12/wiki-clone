"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPosts, deletePost } from "@/lib/api/posts";

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: {
    id: string;
    url: string;
  };
  author: Author;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  photo: string;
  clerkId: string;
}

interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}


export default function PostsTab({ baseUrl }: { baseUrl: string }) {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPosts(baseUrl)
      .then((data:BlogsResponse) => setPosts(data.blogs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [baseUrl]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    setDeletingId(id);
    try {
      await deletePost(baseUrl, id);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Posts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: any) => (
            <div key={p._id} className="border rounded-lg shadow bg-gray-50">
              <Image src={p.image.url} alt={p.title} width={300} height={200} className="object-cover w-full" />
              <div className="p-4">
                <h3 className="font-bold">{p.title}</h3>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={deletingId === p._id}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                >
                  {deletingId === p._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
