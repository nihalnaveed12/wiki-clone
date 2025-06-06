"use client";

import { useState } from "react";

import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function WikipediaHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery) {
      router.push(
        `/articles-page?search=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      router.push(
        `/articles-page?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  text-black py-4 md:py-12 px-4">
      <div className=" w-full max-w-7xl  flex flex-col items-center">
        <>
          <h1 className="text-5xl font-serif tracking-wide mb-1 font-normal">
            Urban-Stash
          </h1>
          <p className="text-sm mb-10 font-serif"> This is the stash for Urban Knowledge, Lore, and Wisdom</p>

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
      </div>
    </div>
  );
}





