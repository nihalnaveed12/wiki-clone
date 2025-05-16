"use client";

import { useState } from "react";
import Image from "next/image";
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
            WIKIPEDIA
          </h1>
          <p className="text-sm mb-10 font-serif">The Free Encyclopedia</p>

          {/* Language Circle with Centered Globe */}
          <div className="w-full flex flex-col gap-4 items-center justify-center mb-12">
            {/* Wikipedia Globe Image - Centered */}
            <div className=" w-[180px] h-[180px]">
              <Image
                src="/images/logo.png"
                alt="Wikipedia Globe"
                width={180}
                height={180}
              />
            </div>

            {/* English - Top Left */}

            <div className="flex flex-col items-center">
              <Link
                href={"/articles-page"}
                className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
              >
                English
              </Link>
              <span className="text-sm text-gray-600">6,974,000+ articles</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex w-full max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border border-gray-700 px-4 py-2 "
              placeholder="Search Wikipedia"
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





