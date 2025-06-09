"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";
import Link from "next/link";
import ArticleCard from "@/components/article-card";

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

interface UserRole {
  role: "user" | "admin";
}

export default function ArticlesList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<
    BlogsResponse["pagination"] | null
  >(null);
  const [filter, setFilter] = useState<"all" | "my-articles">("all");
  const [userRole, setUserRole] = useState<"user" | "admin">("user");

  const { user } = useUser();

  // Admin email - should match the one in your API
  const ADMIN_EMAIL = "abdulsamadsiddiqui2000@gmail.com";

  // Check if current user is admin
  const checkUserRole = useCallback(async () => {
    if (!user) return;

    try {
      // Check by email first
      if (user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
        setUserRole("admin");
        return;
      }

      // Alternatively, fetch from your API to get user role from database
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const userData: UserRole = await response.json();
        setUserRole(userData.role);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      // Fallback to email check
      if (user.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
        setUserRole("admin");
      }
    }
  }, [user]);

  const fetchBlogs = useCallback(
    async (page = 1, filterType = filter) => {
      try {
        setLoading(true);
        let url = `/api/blogs?page=${page}&limit=10`;

        if (filterType === "my-articles" && user) {
          url = `/api/blogs/author/${user.id}?page=${page}&limit=10`;
        }

        const response = await fetch(url);
        const data: BlogsResponse = await response.json();

        if (response.ok) {
          setBlogs(data.blogs);
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch articles");
        }
      } catch {
        setError("An error occurred while fetching articles");
      } finally {
        setLoading(false);
      }
    },
    [user, filter]
  );

  useEffect(() => {
    if (user) {
      checkUserRole();
    }
  }, [user, checkUserRole]);

  useEffect(() => {
    fetchBlogs(currentPage, filter);
  }, [currentPage, filter, user, fetchBlogs]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilter: "all" | "my-articles") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleDelete = (blogId: string) => {
    // Remove from local state after successful deletion
    setBlogs(blogs.filter((b) => b._id !== blogId));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          {userRole === "admin" && (
            <p className="text-sm text-green-600 mt-1">
              ✓ Admin privileges active
            </p>
          )}
        </div>

        {user && (
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Articles
            </button>
            <button
              onClick={() => handleFilterChange("my-articles")}
              className={`px-4 py-2 rounded-md ${
                filter === "my-articles"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              My Articles
            </button>
          </div>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {filter === "my-articles"
              ? "You haven't created any articles yet."
              : "No articles found."}
          </p>
          {filter === "my-articles" && (
            <Link
              href="/add-article"
              className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Your First Article
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {blogs.map((blog) => (
              <ArticleCard
                key={blog._id}
                blog={blog}
                onDelete={handleDelete}
                currentUserRole={userRole}
                currentUserId={user?.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-4 py-2 rounded-md ${
                  pagination.hasPrevPage
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md ${
                      page === pagination.currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-4 py-2 rounded-md ${
                  pagination.hasNextPage
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {/* Stats */}
          {pagination && (
            <div className="text-center mt-8 text-gray-600">
              <p>
                Showing {blogs.length} of {pagination.totalBlogs} articles
                {pagination.totalPages > 1 &&
                  ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
