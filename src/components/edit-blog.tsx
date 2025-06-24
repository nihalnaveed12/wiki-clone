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
  bornDate?: string;
  bornPlace?: string;
  diedDate?: string;
  diedPlace?: string;
  occupation?: string;
  spouses?: string;
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
  const [imagePreview, setImagePreview] = useState(blog.image?.url || "");
  const [removeImage, setRemoveImage] = useState(false);

  // Additional Fields
  const [bornDate, setBornDate] = useState(blog.bornDate || "");
  const [bornPlace, setBornPlace] = useState(blog.bornPlace || "");
  const [diedDate, setDiedDate] = useState(blog.diedDate || "");
  const [diedPlace, setDiedPlace] = useState(blog.diedPlace || "");
  const [occupation, setOccupation] = useState(blog.occupation || "");
  const [spouses, setSpouses] = useState(blog.spouses || "");

  const router = useRouter();
  const { isSignedIn, user } = useUser();

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

      // New fields
      formData.append("bornDate", bornDate);
      formData.append("bornPlace", bornPlace);
      formData.append("diedDate", diedDate);
      formData.append("diedPlace", diedPlace);
      formData.append("occupation", occupation);
      formData.append("spouses", spouses);

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
        router.push("/articles-page");
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
    if (!confirm("Are you sure you want to delete this article?")) return;

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
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You can only edit your own articles.</p>
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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
        </div>

        {/* Born */}
        <div>
          <label className="block text-sm font-medium mb-2">Born</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Born Date"
              value={bornDate}
              onChange={(e) => setBornDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Born Place/Description"
              value={bornPlace}
              onChange={(e) => setBornPlace(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        {/* Died */}
        <div>
          <label className="block text-sm font-medium mb-2">Died</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Died Date"
              value={diedDate}
              onChange={(e) => setDiedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Died Place/Description"
              value={diedPlace}
              onChange={(e) => setDiedPlace(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium mb-2">Occupation</label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
        </div>

        {/* Spouses */}
        <div>
          <label className="block text-sm font-medium mb-2">Spouses</label>
          <input
            type="text"
            value={spouses}
            onChange={(e) => setSpouses(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Featured Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
          {imagePreview && !removeImage && (
            <div className="relative mt-4">
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
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">Content *</label>
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

        {/* Publish */}
        <div className="flex items-center gap-2 pt-6">
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

        {/* Actions */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-md text-white font-medium ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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
