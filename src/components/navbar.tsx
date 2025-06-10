"use client";

import { Search } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


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


export default function WikipediaNavbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

 const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim().toLowerCase();

    if (!trimmed) {
      // If empty search, maybe show all articles or home
      router.push("/");
      return;
    }

    try {
      // Fetch all blogs
      const response = await fetch('/api/blogs');
      const data: BlogsResponse = await response.json();
      console.log("Fetched blogs:", data);
      
      // Find blog with matching slug
      const matchingBlog = data.blogs.find(
        (blog: Blog) => blog.slug.toLowerCase().includes(trimmed) || blog.title.toLowerCase().includes(trimmed) || blog.content.toLowerCase().includes(trimmed)
      );

      console.log("Matching blog:", matchingBlog);

      if (matchingBlog) {
        // Redirect to matching article
        router.push(`/article/${matchingBlog.slug}`);
      } else {
        // Show not found or all articles
        router.push(`/article/not-found?query=${encodeURIComponent(trimmed)}`);
        // OR show all articles:
        // router.push('/articles-page');
      }
    } catch (error) {
      console.error("Search failed:", error);
      router.push('/');
    }
  };
   
  return (
    <div className="w-full border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between  h-[60px] w-full items-center px-1">
        {/* Left section with menu and logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <div className="">
              <img
                src="/images/logo.jpg"
                alt="Wikipedia Logo"
                width={54}
                height={54}
                className=" "
              />
            </div>
            <div className=" ml-2">
              <div className="text-xl  font-serif tracking-tight text-black">
                Urban-Stash
              </div>
              <div className="mt-[-5px] text-[10px]   text-gray-700">
                This is the stash for Urban Knowledge, Lore, and Wisdom
              </div>
            </div>
          </Link>
        </div>

        {/* Center section with search */}
        <div className="mx-4   items-center hidden sm:flex">
          <div className="relative flex w-full max-w-[500px] items-center">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
              <Search className="h-4 w-4  text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Urban Knowledge"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[34px] ] w-full rounded-l border border-gray-400 pl-8 pr-2 text-sm focus:border-gray-500 focus:outline-none text-zinc-600"
            />
            <button
              onClick={handleSearch}
              className="h-[34px] cursor-pointer  rounded-r border border-l-0 border-gray-400 bg-white px-4 text-sm  hover:bg-gray-100 text-zinc-600"
            >
              Search
            </button>
          </div>
        </div>

        <div className="">
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="px-4 py-2 hover:bg-zinc-100 rounded-xl cursor-pointer">
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton>
                <button className="px-4 py-2 hover:bg-zinc-100 rounded-xl cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
