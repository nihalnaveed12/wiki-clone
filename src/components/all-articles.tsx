"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState } from "react";

const headings = [
  " From today's featured article",
  " In the news",
  " Did you know?",
  " Trending Now",
  " Editor's Pick",
  " Thought of the Day",
];

type Article = {
  id: number;
  title: string;
  image: string;
  content: string;
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  // Update local state with query
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearch(query);
  }, [searchParams]);

  useEffect(() => {
    if (search.trim() === "") {
      router.replace("/articles-page");
    }
  }, [search , router]);

  useEffect(() => {
    const stored = localStorage.getItem("allArticles");
    if (stored) {
      const all = JSON.parse(stored);
      const filtered = all.filter((a: Article) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      );
      setArticles(filtered);
    }
  }, [search]);

  const getRandomHeading = () => {
    const index = Math.floor(Math.random() * headings.length);
    return headings[index];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-10">
      {articles.length === 0 && <p>No articles yet.</p>}
      <div className="grid sm:grid-cols-2 gap-x-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-[#f1fdff] border border-blue-200 p-3"
          >
            <h3 className="text-3xl px-3 mb-6 py-1 font-sans font-bold bg-[#d2f9ff]">
              {getRandomHeading()}
            </h3>

            <div className="relative">
              <div className="float-left mr-3 mb-2" style={{ width: "150px" }}>
                {article.image && (
                  <>
                    <Image
                      height={150}
                      width={150}
                      src={article.image || "/placeholder.svg"}
                      alt="iMac G4 with external peripherals"
                      style={{ border: "1px solid #ddd", padding: "1px" }}
                    />
                    <h1 className="text-xs mt-1">{article.title}</h1>
                  </>
                )}
              </div>

              <div dangerouslySetInnerHTML={{ __html: article.content }} />
              <div style={{ clear: "both" }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
