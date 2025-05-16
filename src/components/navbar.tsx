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

    if (trimmed === '') {
      router.push('/articles-page');
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
            <div className="relative sm:h-[35px]  sm:w-[35px] h-[20px] w-[20px]">
              <Image
                src="/images/logo.png"
                alt="Wikipedia Logo"
                width={35}
                height={35}
                className="rounded-full"
              />
            </div>
            <div className=" sm:ml-2">
              <div className="sm:text-xl text-[8px] font-serif tracking-tight text-black">
                <span className="font-bold">W</span>IKIPEDI
                <span className="font-bold">A</span>
              </div>
              <div className="mt-[-5px] sm:text-[10px] text-[5px]  text-gray-700">
                The Free Encyclopedia
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
              placeholder="Search Wikipedia"
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
