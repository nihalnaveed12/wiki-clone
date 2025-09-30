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

  // const truncateContent = (content: string, maxLength = 1000) => {
  //   // Remove HTML tags and truncate
  //   const textContent = content.replace(/<[^>]*>/g, "");
  //   return textContent.length > maxLength
  //     ? textContent.substring(0, maxLength) + "..."
  //     : textContent;
  // };

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

  const isAuthor = user?.id === blog?.author?.clerkId;

  return (
  <article className="bg-card border border-border p-3 rounded-lg">
  <h3 className="text-3xl px-3 mb-6 py-1 font-sans font-bold bg-accent rounded-md">
    {blog.title}
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
            className="border border-border p-1 rounded"
          />
          <Link href={`/article/${blog.slug}`}>
            <h1 className="text-xs mt-1 text-card-foreground hover:text-primary transition-colors">
              {blog.title}
            </h1>
          </Link>
        </>
      )}
    </div>

    <article className="flex flex-col">
      <div className="relative max-h-[350px] overflow-hidden article-content">
        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="prose max-w-none text-card-foreground"
        />
        {/* Fade effect at bottom - updated for theme */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card to-transparent" />
      </div>

      <span>
        <Link
          href={`/article/${blog.slug}`}
          className="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-block transition-colors"
        >
          Read More →
        </Link>
      </span>
    </article>
  </div>

  <div className="flex flex-col gap-3 mt-5 items-end">
    <div className="flex items-center gap-2">
      {blog?.author?.photo && (
        <Image
          src={blog.author.photo}
          alt={`${blog.author.firstName} ${blog.author.lastName}`}
          width={32}
          height={32}
          className="rounded-full border border-border"
        />
      )}
      <div>
        <p className="text-sm font-medium text-card-foreground">
          {blog?.author?.firstName} {blog?.author?.lastName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(blog.createdAt)}
        </p>
      </div>
      {!blog.published && (
        <span className="ml-auto px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
          Draft
        </span>
      )}
    </div>

    {blog.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {blog.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
          >
            {tag}
          </span>
        ))}
        {blog.tags.length > 3 && (
          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
            +{blog.tags.length - 3} more
          </span>
        )}
      </div>
    )}

    <div className="flex items-center justify-between w-full">
      {isAuthor && (
        <div className="flex gap-2">
          <Link
            href={`/edit-article/${blog._id}`}
            className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
