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

export default function WikipediaNavbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    const trimmed = searchQuery.trim();

    if (trimmed === "") {
      router.push("/articles-page");
    } else {
      router.push(`/articles-page?search=${encodeURIComponent(trimmed)}`);
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
              className="h-[34px]   rounded-r border border-l-0 border-gray-400 bg-white px-4 text-sm  hover:bg-gray-100 text-zinc-600"
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
