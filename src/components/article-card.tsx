"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

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

interface ArticleCardProps {
  blog: Blog;
  onDelete?: (blogId: string) => void;
  currentUserRole?: string;
}

export default function ArticleCard({
  blog,
  onDelete,
  currentUserRole,
}: ArticleCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    // Remove HTML tags and truncate
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/edit-blog/${blog._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        alert("Article deleted successfully!");
        if (onDelete) {
          onDelete(blog._id);
        }
      } else {
        alert(result.error || "Failed to delete article");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("An error occurred while deleting the article");
    } finally {
      setLoading(false);
    }
  };

  const isAuthor = user?.id === blog.author.clerkId;
  const isAdmin = currentUserRole === "admin";
  const canEdit = isAuthor;
  const canDelete = isAuthor || isAdmin;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {blog.image.url && (
        <div className="relative h-48 w-full">
          <Image
            src={blog.image.url}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {blog.author.photo && (
            <Image
              src={blog.author.photo}
              alt={`${blog.author.firstName} ${blog.author.lastName}`}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {blog.author.firstName} {blog.author.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(blog.createdAt)}
            </p>
          </div>
          {!blog.published && (
            <span className="ml-auto px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
              Draft
            </span>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link
            href={`/blog/${blog.slug}`}
            className="hover:text-blue-600 transition-colors"
          >
            {blog.title}
          </Link>
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateContent(blog.content)}
        </p>

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Link
            href={`/blog/${blog.slug}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read More →
          </Link>

          {(canEdit || canDelete) && (
            <div className="flex gap-2">
              {canEdit && (
                <Link
                  href={`/edit-article/${blog._id}`}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Edit
                </Link>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "..." : "Delete"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
