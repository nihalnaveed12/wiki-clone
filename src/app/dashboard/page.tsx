"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  photo: string;
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



export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "posts">("users");
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isLoaded) {
      if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
        setUserRole("admin");
      } else {
        setUserRole("user");
      }
    }
  }, [isLoaded, user, ADMIN_EMAIL]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch(`${BASE_URL}/api/user`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (userRole === "admin" && activeTab === "users") {
      fetchUsers();
    }
  }, [userRole, activeTab, BASE_URL]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(`${BASE_URL}/api/blogs`);
        const data:BlogsResponse = await res.json();
        setPosts(data.blogs);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userRole === "admin" && activeTab === "posts") {
      fetchPosts();
    }
  }, [userRole, activeTab, BASE_URL]);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  if (!isLoaded || userRole === null) {
    return <div className="p-4 text-center text-gray-500">Loading dashboard...</div>;
  }

  if (userRole !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-600 text-lg font-semibold">
        <p>🚫 Sorry, you cannot access this page.</p>
        <p>Only admins are allowed to view the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Admin Panel</h1>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab("posts")}
              className={`w-full text-left px-3 py-2 rounded-lg transition ${
                activeTab === "posts"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              Posts
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <div className="bg-white p-4 shadow rounded-lg">
              {loadingUsers ? (
                <p className="text-gray-500">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="border p-4 rounded-lg shadow hover:shadow-md transition bg-gray-50"
                    >
                      <img
                        src={u.photo}
                        alt={`${u.firstName} ${u.lastName}`}
                        className="w-16 h-16 rounded-full object-cover mb-2"
                      />
                      <h3 className="font-semibold text-lg">
                        {u.firstName} {u.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{u.email}</p>
                      <p className="text-xs mt-1 font-medium">
                        Role: <span className="text-blue-600">{u.role}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Posts</h2>
            <div className="bg-white p-4 shadow rounded-lg">
              {loadingPosts ? (
                <p className="text-gray-500">Loading posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-500">No posts found.</p>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {paginatedPosts.map((post) => (
                      <div
                        key={post._id}
                        className="border rounded-lg shadow hover:shadow-md transition bg-gray-50 overflow-hidden"
                      >
                        <img
                          src={post.image.url}
                          alt={post.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <a href={`/article/${post.slug}`}>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {post.title}
                          </h3>

                          </a>
                          <p className="text-sm text-gray-600 mb-2">
                            Author: {post.author.firstName} {post.author.lastName}
                          </p>
                          <button className="px-4 py-1 mt-2 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
