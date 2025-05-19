"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css";


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function Home() {
  const [title, setTitle] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result); // base64 image
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGoToArticles = () => {
    const newArticle = {
      id: Date.now(),
      title,
      image: imageDataUrl,
      content,
    };

    const existing = localStorage.getItem("allArticles");
    const articles = existing ? JSON.parse(existing) : [];
    articles.push(newArticle);

    localStorage.setItem("allArticles", JSON.stringify(articles));
    router.push("/articles-page");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-sans py-4">Create Article</h1>

      <label htmlFor="title">Enter Your Article Title:</label>
      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border my-2"
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="image">Upload Your Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="bg-zinc-100 px-4 py-2 w-[200px]"
          style={{ marginBottom: 20 }}
        />
      </div>

      {imageDataUrl && (
        <img
          src={imageDataUrl}
          alt="Preview"
          style={{ maxWidth: "50%"}}
          className="pb-10"
          height={50}
          width={50}
        />
      )}

      <ReactQuill
        value={content}
        onChange={setContent}
        theme="snow"
        style={{ height: 200 }}
      />

      <br />
      <button onClick={handleGoToArticles} className="bg-blue-500 hover:bg-blue-600 my-10 px-4 cursor-pointer rounded-[5px] py-2 text-white text-xl">
         Publish
      </button>
    </div>
  );
}
