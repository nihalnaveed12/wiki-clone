"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddYourArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Biographical fields
  const [bornDate, setBornDate] = useState("");
  const [bornPlace, setBornPlace] = useState("");
  const [diedDate, setDiedDate] = useState("");
  const [diedPlace, setDiedPlace] = useState("");
  const [occupation, setOccupation] = useState("");
  const [spouses, setSpouses] = useState("");
  
  // New YouTube video URL field
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // Function to validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid since it's optional
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!isSignedIn || !user) {
      alert("Please sign in to create an article");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    // Validate YouTube URL if provided
    if (youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl)) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("tags", tags);
      formData.append("published", published.toString());
      formData.append("bornDate", bornDate);
      formData.append("bornPlace", bornPlace);
      formData.append("diedDate", diedDate);
      formData.append("diedPlace", diedPlace);
      formData.append("occupation", occupation);
      formData.append("spouses", spouses);
      formData.append("youtubeUrl", youtubeUrl.trim()); // Add YouTube URL to form data

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Article created successfully!");
        setTitle("");
        setContent("");
        setImage(null);
        setTags("");
        setPublished(false);
        setImagePreview("");
        setBornDate("");
        setBornPlace("");
        setDiedDate("");
        setDiedPlace("");
        setOccupation("");
        setSpouses("");
        setYoutubeUrl(""); // Reset YouTube URL
        router.push("/articles-page");
      } else {
        alert(result.error || "Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      alert("An error occurred while creating the article");
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-card-foreground">Sign In Required</h1>
        <p className="text-card-foreground">Please sign in to create an article.</p>
      </div>
    </div>
  );
}

return (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold font-sans py-4 text-card-foreground">Create Article</h1>

    <div className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-card-foreground">
          Article Title *
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter your article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
          disabled={loading}
        />
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2 text-card-foreground">
          Tags (comma separated)
        </label>
        <input
          id="tags"
          type="text"
          placeholder="e.g., technology, programming, tutorial"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
          disabled={loading}
        />
      </div>

      {/* Born Fields */}
      <div>
        <label className="block text-sm font-medium mb-2 text-card-foreground">Born</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Born Date (e.g., June 19, 1903)"
            value={bornDate}
            onChange={(e) => setBornDate(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Born Place/Description"
            value={bornPlace}
            onChange={(e) => setBornPlace(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>
      </div>

      {/* Died Fields */}
      <div>
        <label className="block text-sm font-medium mb-2 text-card-foreground">Died</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Died Date (e.g., June 2, 1941)"
            value={diedDate}
            onChange={(e) => setDiedDate(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Died Place/Description"
            value={diedPlace}
            onChange={(e) => setDiedPlace(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>
      </div>

      {/* Occupation */}
      <div>
        <label htmlFor="occupation" className="block text-sm font-medium mb-2 text-card-foreground">
          Occupation
        </label>
        <input
          id="occupation"
          type="text"
          placeholder="e.g., Actor, Politician"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
          disabled={loading}
        />
      </div>

      {/* Spouses */}
      <div>
        <label htmlFor="spouses" className="block text-sm font-medium mb-2 text-card-foreground">
          Spouses
        </label>
        <input
          id="spouses"
          type="text"
          placeholder="e.g., Jane Doe (m. 1950–1980)"
          value={spouses}
          onChange={(e) => setSpouses(e.target.value)}
          className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
          disabled={loading}
        />
      </div>

      {/* YouTube Video URL - NEW FIELD */}
      <div>
        <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-2 text-card-foreground">
          YouTube Video URL (Optional)
        </label>
        <input
          id="youtubeUrl"
          type="url"
          placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors ${
            youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl)
              ? "border-destructive focus:ring-destructive"
              : "border-border"
          }`}
          disabled={loading}
        />
        {youtubeUrl.trim() && !isValidYouTubeUrl(youtubeUrl) && (
          <p className="text-destructive text-sm mt-1">
            Please enter a valid YouTube URL
          </p>
        )}
        <p className="text-muted-foreground text-sm mt-1">
          Add a YouTube video link to embed in your article (optional)
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-2 text-card-foreground">
          Featured Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border border-border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80 bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
          disabled={loading}
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 text-card-foreground">Image Preview:</p>
          <Image
            height={1000} 
            width={1000}
            src={imagePreview}
            alt="Preview"
            className="max-w-md h-48 object-cover rounded-md border border-border"
          />
        </div>
      )}

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium mb-2 text-card-foreground">
          Article Content *
        </label>
        <div className="border border-border rounded-md">
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
          className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          disabled={loading}
        />
        <label htmlFor="published" className="text-sm font-medium text-card-foreground">
          Publish immediately
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-md text-primary-foreground font-medium transition-colors ${
            loading
              ? "bg-muted cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 cursor-pointer"
          }`}
        >
          {loading
            ? "Creating..."
            : published
            ? "Publish Article"
            : "Save Draft"}
        </button>
      </div>
    </div>
  </div>
);
}