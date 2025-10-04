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
  const [origin, setOrigin] = useState("");
  const [sideSection, setSideSection] = useState("");

  // NEW fields
  const [alsoKnownAs, setAlsoKnownAs] = useState("");
  const [realName, setRealName] = useState("");
  const [genres, setGenres] = useState("");
  const [associatedActs, setAssociatedActs] = useState("");
  const [labels, setLabels] = useState("");

  // YouTube fields
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([""]);

  const addYoutubeField = () => {
    if (youtubeUrls.length < 5) {
      setYoutubeUrls([...youtubeUrls, ""]);
    }
  };

  const removeYoutubeField = (index: number) => {
    setYoutubeUrls(youtubeUrls.filter((_, i) => i !== index));
  };

  const updateYoutubeUrl = (index: number, value: string) => {
    const newUrls = [...youtubeUrls];
    newUrls[index] = value;
    setYoutubeUrls(newUrls);
  };

  const router = useRouter();
  const { isSignedIn, user } = useUser();

  // Function to validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty is valid since it's optional
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
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

    // Validate YouTube URLs
    for (const url of youtubeUrls) {
      if (url.trim() && !isValidYouTubeUrl(url)) {
        alert("One or more YouTube URLs are invalid");
        return;
      }
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
      formData.append("origin", origin);
      formData.append("sideSection", sideSection);

      // new fields append
      formData.append("alsoKnownAs", alsoKnownAs);
      formData.append("realName", realName);
      formData.append("genres", genres);
      formData.append("associatedActs", associatedActs);
      formData.append("labels", labels);

      youtubeUrls.forEach((url) => {
        if (url.trim()) {
          formData.append("youtubeUrls", url.trim());
        }
      });

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
        setOrigin("");
        setSideSection("");
        setAlsoKnownAs("");
        setRealName("");
        setGenres("");
        setAssociatedActs("");
        setLabels("");
        setYoutubeUrls([]);
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
          <h1 className="text-3xl font-bold mb-4 text-card-foreground">
            Sign In Required
          </h1>
          <p className="text-card-foreground">
            Please sign in to create an article.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-sans py-4 text-card-foreground">
        Create Article
      </h1>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
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
          <label
            htmlFor="tags"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
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
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Born
          </label>
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
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Died
          </label>
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
          <label
            htmlFor="occupation"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
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
          <label
            htmlFor="spouses"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
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

        <div>
          <label
            htmlFor="origin"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
            Origin
          </label>
          <input
            id="origin"
            type="text"
            placeholder="e.g., Los Angeles, California, USA"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>
        <div>
          <label
            htmlFor="sideSection"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
            Side/Section
          </label>
          <input
            id="sideSection"
            type="text"
            placeholder=" e.g., Left, Right, Center (Political views) "
            value={sideSection}
            onChange={(e) => setSideSection(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Also Known As
          </label>
          <input
            type="text"
            placeholder="Other names"
            value={alsoKnownAs}
            onChange={(e) => setAlsoKnownAs(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Real Name
          </label>
          <input
            type="text"
            placeholder="Enter real name"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Genres
          </label>
          <input
            type="text"
            placeholder="Comma separated genres"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Associated Acts
          </label>
          <input
            type="text"
            placeholder="Comma separated acts"
            value={associatedActs}
            onChange={(e) => setAssociatedActs(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Labels
          </label>
          <input
            type="text"
            placeholder="Comma separated labels"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md"
          />
        </div>

        {/* YouTube Video URL - NEW FIELD */}
        {/* YouTube Video URLs - Multiple Fields */}
        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            YouTube Video URLs (Max 5)
          </label>

          <div className="space-y-3">
            {youtubeUrls.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="url"
                  placeholder="e.g., https://youtu.be/dQw4w9WgXcQ"
                  value={url}
                  onChange={(e) => updateYoutubeUrl(index, e.target.value)}
                  className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-card-foreground transition-colors ${
                    url.trim() && !isValidYouTubeUrl(url)
                      ? "border-destructive focus:ring-destructive"
                      : "border-border"
                  }`}
                  disabled={loading}
                />
                {youtubeUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeYoutubeField(index)}
                    className="px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/80"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {youtubeUrls.length < 5 && (
            <button
              type="button"
              onClick={addYoutubeField}
              className="mt-2 px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/80"
              disabled={loading}
            >
              + Add another video
            </button>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium mb-2 text-card-foreground"
          >
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
            <p className="text-sm font-medium mb-2 text-card-foreground">
              Image Preview:
            </p>
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
          <label
            htmlFor="published"
            className="text-sm font-medium text-card-foreground"
          >
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
