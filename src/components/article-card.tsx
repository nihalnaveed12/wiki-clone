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
  currentUserId?: string;
}

export default function ArticleCard({ blog, onDelete }: ArticleCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const headings = [
    " From today's featured article",
    " In the news",
    " Did you know?",
    " Trending Now",
    " Editor's Pick",
    " Thought of the Day",
  ];

  const truncateContent = (content: string, maxLength = 1000) => {
    // Remove HTML tags and truncate
    const textContent = content.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const handleDelete = async () => {
    const confirmMessage =
      "Are you sure you want to delete this article? This action cannot be undone.";

    if (!confirm(confirmMessage)) {
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

  const getRandomHeading = () => {
    const index = Math.floor(Math.random() * headings.length);
    return headings[index];
  };

  const isAuthor = user?.id === blog?.author?.clerkId;

  return (
    <article className="bg-[#f1fdff] border border-blue-200 p-3">
      <h3 className="text-3xl px-3 mb-6 py-1 font-sans font-bold bg-[#d2f9ff]">
        {getRandomHeading()}
      </h3>

      <div className="">
        <div className="float-left mr-3 mb-2" style={{ width: "150px" }}>
          {blog.image.url && (
            <>
              <Image
                height={250}
                width={250}
                src={blog.image.url}
                alt={blog.title}
                style={{ border: "1px solid #ddd", padding: "1px" }}
              />
              <Link href={`/article/${blog.slug}`}>
                <h1 className="text-xs mt-1">{blog.title}</h1>
              </Link>
            </>
          )}
        </div>

        <p className="text-gray-600 text-sm ">
          {truncateContent(blog.content)}
        </p>

        <Link
          href={`/article/${blog.slug}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read More →
        </Link>
      </div>

      <div className="flex flex-col gap-3 mt-5 items-end">
        <div className=" flex items-center gap-2 ">
          {blog?.author?.photo && (
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
              {blog?.author?.firstName} {blog?.author?.lastName}
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

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 ">
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
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                href={`/edit-article/${blog._id}`}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
