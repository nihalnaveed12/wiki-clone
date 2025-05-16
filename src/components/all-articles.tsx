"use client";

import Image from "next/image";

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

  useEffect(() => {
    const stored = localStorage.getItem("allArticles");
    if (stored) {
      setArticles(JSON.parse(stored));
    }
  }, []);

  // Function to get a random heading for each article
  const getRandomHeading = () => {
    const index = Math.floor(Math.random() * headings.length);
    return headings[index];
  };

  return (
    // <div className="max-w-7xl mx-auto px-4 pb-10">
    //   {articles.length === 0 && <p>No articles yet.</p>}
    //   <div className="grid grid-cols-2 gap-x-4 ">
    //     {articles.map((article) => (
    //       <div
    //         key={article.id}
           
    //         className="bg-emerald-50 border border-blue-200 p-4"
    //       >
    //         <h3 style={{ color: "#555" }}>{getRandomHeading()}</h3>
    //         <h2>{article.title}</h2>
    //         {article.image && (
    //           <Image
    //             height={1000}
    //             width={1000}
    //             src={article.image}
    //             alt="Article"
    //             style={{ maxWidth: "100%", marginBottom: 10 }}
    //           />
    //         )}
    //         <div dangerouslySetInnerHTML={{ __html: article.content }} />
    //       </div>
    //     ))}
    //   </div>

    
    // </div>

     <div className="max-w-7xl mx-auto px-4 pb-10">
      {articles.length === 0 && <p>No articles yet.</p>}
      <div className="grid sm:grid-cols-2 gap-x-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-[#f1fdff] border border-blue-200 p-3">
            <h3 className="text-3xl px-3 mb-6 py-1 font-sans font-bold bg-[#d2f9ff]">{getRandomHeading()}</h3>
            <h2>{article.title}</h2>

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
                    <div className="text-xs mt-1">iMac G4 with external peripherals</div>
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
