"use client";

import { Search } from "lucide-react";
import Image from "next/image";
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
      <div className="max-w-7xl mx-auto flex justify-between  h-[45px] w-full items-center px-1">
        {/* Left section with menu and logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <div className="">
              <Image
                src="/images/logo.jpg"
                alt="Wikipedia Logo"
                width={35}
                height={50}
                className=" "
              />
            </div>
            <div className=" sm:ml-2">
              <div className="sm:text-xl text-[8px] font-serif tracking-tight text-black">
                Urban-Stash
              </div>
              <div className="mt-[-5px] sm:text-[10px] text-[5px]  text-gray-700">
                This is the stash for Urban Knowledge, Lore, and Wisdom
              </div>
            </div>
          </Link>
        </div>

        {/* Center section with search */}
        <div className="mx-4  flex items-center">
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
      </div>
    </div>
  );
}
