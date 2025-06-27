"use client";

import { useEffect, useState } from "react";

import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import ArticleCard from "./article-card";

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

interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function WikipediaHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const router = useRouter();
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function loadBlogs() {
      const res = await fetch(`${BaseUrl}/api/blogs`);
      const data: BlogsResponse = await res.json();
      setBlogs(data.blogs || []);
    }
    loadBlogs();
  }, [BaseUrl]);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    console.log(query);
    if (!query) return;
    // exact match by slug or title
    let blog = blogs.find(
      (b) => b.slug.toLowerCase() === query || b.title.toLowerCase() === query
    );
    if (!blog) {
      // fallback: partial match in slug or title
      blog = blogs.find(
        (b) =>
          b.slug.toLowerCase().includes(query) ||
          b.title.toLowerCase().includes(query)
      );
    }
    if (blog) {
      router.push(`/article/${blog.slug}`);
    } else {
      // no match found - handle as needed
      console.log("No article found for query:", query);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  text-black py-4 md:py-12 px-4">
      <div className=" w-full max-w-7xl  flex flex-col items-center">
        <>
          <h1 className="text-5xl font-serif tracking-wide mb-1 font-normal">
            Urban-Stash
          </h1>
          <p className="text-sm mb-10 font-serif">
            {" "}
            This is the stash for Urban Knowledge, Lore, and Wisdom
          </p>

          {/* Language Circle with Centered Globe */}
          <div className="w-full flex flex-col gap-2 items-center justify-center mb-12">
            {/* Wikipedia Globe Image - Centered */}
            <div className=" w-[300px] h-[300px] ">
              <img
                src="/images/logo.jpg"
                alt="Wikipedia Globe"
                width={200}
                height={200}
                className="w-full"
              />
            </div>

            {/* English - Top Left */}

            <div className="flex items-center">
              <Link
                href={"/articles-page"}
                className="text-blue-700 hover:text-blue-500 border px-4 py-2 bg-zinc-50 hover:bg-zinc-100 hover:underline text-xl font-semibold`"
              >
                Add Articles
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex w-full max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border border-gray-700 px-4 py-2 "
              placeholder="Search Urban Knowledge"
            />
            <div className="relative inline-block border-y border-r border-gray-700 px-3 py-2">
              <button className="flex items-center text-gray-400">
                EN <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </>

        <h1 className="py-10 text-3xl font-bold font-sans">Latest Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {blogs.slice(0, 4).map((blog, index) => (
            <ArticleCard blog={blog} />
          ))}
        </div>

        <Link
          href={"/articles-page"}
          className="text-blue-700 hover:text-blue-500 border px-4 py-2 my-10 bg-zinc-50 hover:bg-zinc-100 hover:underline text-xl font-semibold`"
        >
          More Articles
        </Link>
      </div>
    </div>
  );
}
