"use client";

import { Menu, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function WikipediaNavbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full border-b border-gray-300 bg-white">
      <div className="max-w-7xl mx-auto flex h-[45px] w-full items-center px-1">
        {/* Left section with menu and logo */}
        <div className="flex items-center gap-2">
          <button className="">
            <Menu className="sm:h-5 sm:w-5 h-3 w-3 text-gray-600" />
          </button>
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
        <div className="sm:mx-4 mx-2 flex flex-1 items-center">
          <div className="relative flex w-full max-w-[500px] items-center">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
              <Search className="sm:h-4 sm:w-4 h-2 w-2 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Wikipedia"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:h-[34px] h-[16px] w-full rounded-l border border-gray-400 sm:pl-8 pl-4 pr-2 sm:text-sm text-[8px] focus:border-gray-500 focus:outline-none text-zinc-600"
            />
            <button className="sm:h-[34px] h-[16px]  rounded-r border border-l-0 border-gray-400 bg-white sm:px-4 px-2 sm:text-sm text-[7px] hover:bg-gray-100 text-zinc-600">
              Search
            </button>
          </div>
        </div>

        {/* Right section with links */}
        <div className="flex items-center sm:space-x-4 gap-1  sm:text-sm text-[7px]">
          <Link href="#" className="text-[#3366cc] hover:underline">
            <span className="whitespace-nowrap">Donate</span>
          </Link>
          <Link href="#" className="text-[#3366cc] hover:underline">
            <span className="whitespace-nowrap">Create account</span>
          </Link>
          <Link href="#" className="text-[#3366cc] hover:underline">
            <span className="whitespace-nowrap">Log in</span>
          </Link>
          <button>
            <MoreHorizontal className="sm:h-5 sm:w-5 h-3 w-3 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
