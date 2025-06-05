"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

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

interface EditBlogProps {
  blog: Blog;
}

export default function EditBlogComponent({ blog }: EditBlogProps) {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState(blog.tags.join(", "));
  const [published, setPublished] = useState(blog.published);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(blog.image.url);
  const [removeImage, setRemoveImage] = useState(false);

  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // Redirect if not signed in or not the author
  useEffect(() => {
    if (!isSignedIn || !user || user.id !== blog.author.clerkId) {
      router.push("/articles-page");
    }
  }, [isSignedIn, user, blog.author.clerkId, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setRemoveImage(false);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview("");
    setRemoveImage(true);
  };

  const handleSubmit = async () => {
    if (!isSignedIn || !user) {
      alert("Please sign in to edit the article");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("published", published.toString());
      formData.append("removeImage", removeImage.toString());

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`/api/edit-blog/${blog._id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Article updated successfully!");
        router.push(`/articles-page`);
      } else {
        alert(result.error || "Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("An error occurred while updating the article");
    } finally {
      setLoading(false);
    }
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
        router.push("/articles-page");
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

  if (!isSignedIn || !user || user.id !== blog.author.clerkId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>You can only edit your own articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans">Edit Article</h1>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Deleting..." : "Delete Article"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Article Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter your article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Tags Input */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            placeholder="e.g., technology, programming, tutorial"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Featured Image
          </label>
          <div className="space-y-4">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={loading}
            />

            {imagePreview && !removeImage && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-w-md h-48 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            )}

            {blog.image.url && imagePreview && !image && !removeImage && (
              <p className="text-sm text-gray-600">
                Current image will be kept
              </p>
            )}

            {removeImage && (
              <p className="text-sm text-red-600">
                Image will be removed when you save
              </p>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Article Content *
          </label>
          <div className="border border-gray-300 rounded-md">
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              style={{ height: 300 }}
              readOnly={loading}
            />
          </div>
        </div>

        {/* Publish Checkbox */}
        <div className="flex items-center gap-2 pt-12">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="published" className="text-sm font-medium">
            Published
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            } transition-colors`}
          >
            {loading ? "Updating..." : "Update Article"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
