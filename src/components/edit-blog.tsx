"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import "react-quill-new/dist/quill.snow.css";
import Image from "next/image";

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
  origin?: string;
  sideSection?: string;
  youtubeUrls?: string[];

  alsoKnownAs?: string;
  realName?: string;
  genres?: string;
  associatedActs?: string;
  labels?: string;
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

  // Existing bio fields
  const [bornDate, setBornDate] = useState(blog.bornDate || "");
  const [bornPlace, setBornPlace] = useState(blog.bornPlace || "");
  const [diedDate, setDiedDate] = useState(blog.diedDate || "");
  const [diedPlace, setDiedPlace] = useState(blog.diedPlace || "");
  const [occupation, setOccupation] = useState(blog.occupation || "");
  const [spouses, setSpouses] = useState(blog.spouses || "");
  const [origin, setOrigin] = useState(blog.origin || "");
  const [sideSection, setSideSection] = useState(blog.sideSection || "");
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>(
    blog.youtubeUrls && blog.youtubeUrls.length > 0 ? blog.youtubeUrls : [""]
  );

  // NEW FIELDS
  const [alsoKnownAs, setAlsoKnownAs] = useState(blog.alsoKnownAs || "");
  const [realName, setRealName] = useState(blog.realName || "");
  const [genres, setGenres] = useState(blog.genres || "");
  const [associatedActs, setAssociatedActs] = useState(blog.associatedActs || "");
  const [labels, setLabels] = useState(blog.labels || "");

  const router = useRouter();
  const { isSignedIn, user } = useUser();

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

      // Bio
      formData.append("bornDate", bornDate);
      formData.append("bornPlace", bornPlace);
      formData.append("diedDate", diedDate);
      formData.append("diedPlace", diedPlace);
      formData.append("occupation", occupation);
      formData.append("spouses", spouses);
      formData.append("origin", origin);
      formData.append("sideSection", sideSection);

      // NEW FIELDS
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans text-card-foreground">
          Edit Article
        </h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Born
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Born Date"
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

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Died
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Died Date"
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

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Occupation
          </label>
          <input
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Spouses
          </label>
          <input
            type="text"
            value={spouses}
            onChange={(e) => setSpouses(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Origin
          </label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Side/Section
          </label>
          <input
            type="text"
            value={sideSection}
            onChange={(e) => setSideSection(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
        </div>

         <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">Also Known As</label>
          <input
            type="text"
            value={alsoKnownAs}
            onChange={(e) => setAlsoKnownAs(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">Real Name</label>
          <input
            type="text"
            value={realName}
            onChange={(e) => setRealName(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">Genres</label>
          <input
            type="text"
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">Associated Acts</label>
          <input
            type="text"
            value={associatedActs}
            onChange={(e) => setAssociatedActs(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">Labels</label>
          <input
            type="text"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md bg-background text-card-foreground"
            disabled={loading}
          />
        </div>



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
                  className={`flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-card-foreground transition-colors`}
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

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-card-foreground disabled:bg-muted disabled:text-muted-foreground transition-colors"
            disabled={loading}
          />
          {imagePreview && !removeImage && (
            <div className="relative mt-4">
              <Image
                height={1000}
                width={1000}
                src={imagePreview}
                alt="Preview"
                className="max-w-md h-48 object-cover rounded-md border border-border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center hover:bg-destructive/90 transition-colors"
                disabled={loading}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-card-foreground">
            Content *
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

        <div className="flex items-center gap-2 pt-6">
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
            Published
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-3 rounded-md text-primary-foreground font-medium transition-colors ${
              loading
                ? "bg-muted cursor-not-allowed"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? "Updating..." : "Update Article"}
          </button>

          <button
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 rounded-md border border-border text-card-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
