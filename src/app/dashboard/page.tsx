"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const { isLoaded, isSignedIn, user } = useUser();
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
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const postsPerPage = 10;

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

   useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      setUserRole("admin");
    } else {
      setUserRole("user");
    }
  },[]);

  // Fetch current user's role
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const fetchUserRole = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/user/role`, {
            credentials: "include", // Ensure Clerk auth cookies are sent
          });
          if (res.ok) {
            const data: { role: "user" | "admin" } = await res.json();
            setUserRole(data.role);
          } else {
            console.error("Failed to fetch user role:", await res.text());
            setUserRole("user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("user");
        }
      };
      fetchUserRole();
    }
  }, [isLoaded, isSignedIn, BASE_URL]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await fetch(`${BASE_URL}/api/user`);
        if (res.ok) {
          const data: UserData[] = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users:", await res.text());
        }
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

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch(`${BASE_URL}/api/blogs`);
        if (res.ok) {
          const data: BlogsResponse = await res.json();
          setPosts(data.blogs);
        } else {
          console.error("Failed to fetch posts:", await res.text());
        }
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

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeletingPostId(postId);
    try {
      const res = await fetch(
        `${BASE_URL}/api/admin/delete-blog?id=${postId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully!");
      } else {
        const error = await res.json();
        alert(`Failed to delete post: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "admin" | "user"
  ) => {
    if (
      !confirm(
        `Are you sure you want to change this user's role to ${newRole}?`
      )
    ) {
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/manage-users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUserId: userId,
          newRole,
        }),
      });

      if (res.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        alert(`User role updated to ${newRole}!`);
      } else {
        const error = await res.json();
        alert(`Failed to update role: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  const adminCount = users.filter((user) => user.role === "admin").length;

  if (!isLoaded || userRole === null) {
    return (
      <div className="p-4 text-center text-gray-500">Loading dashboard...</div>
    );
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Users</h2>
              <div className="text-sm text-gray-600">
                Admins: {adminCount}/3
              </div>
            </div>
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
                      <Image
                      height={1000}
                      width={1000}
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

                      {u.email !== ADMIN_EMAIL && (
                        <div className="mt-3 flex gap-2">
                          {u.role === "user" ? (
                            <button
                              onClick={() => handleRoleChange(u._id, "admin")}
                              disabled={
                                adminCount >= 3 || updatingUserId === u._id
                              }
                              className={`px-3 py-1 text-xs rounded ${
                                adminCount >= 3
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {updatingUserId === u._id
                                ? "Updating..."
                                : "Make Admin"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRoleChange(u._id, "user")}
                              disabled={updatingUserId === u._id}
                              className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                              {updatingUserId === u._id
                                ? "Updating..."
                                : "Remove Admin"}
                            </button>
                          )}
                        </div>
                      )}
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
                        <Image
                        height={1000}
                        width={1000}
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
                            Author: {post.author.firstName}{" "}
                            {post.author.lastName}
                          </p>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            disabled={deletingPostId === post._id}
                            className="px-4 py-1 mt-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                          >
                            {deletingPostId === post._id
                              ? "Deleting..."
                              : "Delete"}
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
