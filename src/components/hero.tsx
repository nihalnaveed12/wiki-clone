"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, ChevronDown, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function WikipediaHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 700);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const languages = [
    { name: "English", count: "6,974,000+ articles", href: "/articles-page" },
    { name: "日本語", count: "1,457,000+ 記事" },
    { name: "Русский", count: "2 036 000+ статей" },
    { name: "Deutsch", count: "3,001,000+ Artikel" },
    { name: "Español", count: "2,021,000+ artículos" },
    { name: "Français", count: "2,674,000+ articles" },
    { name: "中文", count: "1,470,000+ 条目 / 條目" },
    { name: "Italiano", count: "1,910,000+ voci" },
    { name: "Português", count: "1,146,000+ artigos" },
    { name: "Polski", count: "1 652 000+ haseł" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  text-black py-4 md:py-12 px-4">
      <div className=" w-full max-w-3xl  flex flex-col items-center">
        {/* Desktop View */}
        {!isMobile && (
          <>
            {/* Wikipedia Logo */}
            <h1 className="text-5xl font-serif tracking-wide mb-1 font-normal">
              WIKIPEDIA
            </h1>
            <p className="text-sm mb-10 font-serif">The Free Encyclopedia</p>

            {/* Language Circle with Centered Globe */}
            <div className="relative w-full h-[400px] mb-12">
              {/* Wikipedia Globe Image - Centered */}
              <div className="absolute left-1/2 top-56 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[180px] h-[180px]">
                <Image
                  src="/images/logo.png"
                  alt="Wikipedia Globe"
                  width={180}
                  height={180}
                  priority
                />
              </div>

              {/* English - Top Left */}
              <div className="absolute top-[12%] left-[25%] z-20">
                <div className="flex flex-col items-end">
                  <Link
                    href={"/articles-page"}
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    English
                  </Link>
                  <span className="text-sm text-gray-600">
                    6,974,000+ articles
                  </span>
                </div>
              </div>

              {/* Japanese - Top Right */}
              <div className="absolute top-[12%] right-[25%] z-20">
                <div className="flex flex-col items-start">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    日本語
                  </a>
                  <span className="text-sm text-gray-600">1,457,000+ 記事</span>
                </div>
              </div>

              {/* Russian - Middle Left */}
              <div className="absolute top-[30%] left-[18%] z-20">
                <div className="flex flex-col items-end">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Русский
                  </a>
                  <span className="text-sm text-gray-600">
                    2 036 000+ статей
                  </span>
                </div>
              </div>

              {/* German - Middle Right */}
              <div className="absolute top-[30%] right-[18%] z-20">
                <div className="flex flex-col items-start">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Deutsch
                  </a>
                  <span className="text-sm text-gray-600">
                    3,001,000+ Artikel
                  </span>
                </div>
              </div>

              {/* Spanish - Upper Bottom Left */}
              <div className="absolute top-[50%] left-[13%] z-20">
                <div className="flex flex-col items-end">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Español
                  </a>
                  <span className="text-sm text-gray-600">
                    2,021,000+ artículos
                  </span>
                </div>
              </div>

              {/* French - Upper Bottom Right */}
              <div className="absolute top-[50%] right-[13%] z-20">
                <div className="flex flex-col items-start">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Français
                  </a>
                  <span className="text-sm text-gray-600">
                    2,674,000+ articles
                  </span>
                </div>
              </div>

              {/* Chinese - Lower Middle Left */}
              <div className="absolute top-[70%] left-[15%] z-20">
                <div className="flex flex-col items-end">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    中文
                  </a>
                  <span className="text-sm text-gray-600">
                    1,470,000+ 条目 / 條目
                  </span>
                </div>
              </div>

              {/* Italian - Lower Middle Right */}
              <div className="absolute top-[70%] right-[18%] z-20">
                <div className="flex flex-col items-start">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Italiano
                  </a>
                  <span className="text-sm text-gray-600">1,910,000+ voci</span>
                </div>
              </div>

              {/* Portuguese - Bottom Left */}
              <div className="absolute top-[90%] left-[28%] z-20">
                <div className="flex flex-col items-end">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Português
                  </a>
                  <span className="text-sm text-gray-600">
                    1,146,000+ artigos
                  </span>
                </div>
              </div>

              {/* Polish - Bottom Right */}
              <div className="absolute top-[88%] right-[28%] z-20">
                <div className="flex flex-col items-start">
                  <a
                    href="#"
                    className="text-blue-700 hover:text-blue-500 hover:underline text-lg font-normal"
                  >
                    Polski
                  </a>
                  <span className="text-sm text-gray-600">
                    1 652 000+ haseł
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex w-full max-w-md mb-8">
              <input
                type="text"
                className="flex-grow border border-gray-700 px-4 py-2 "
                placeholder="Search Wikipedia"
              />
              <div className="relative inline-block border-y border-r border-gray-700 px-3 py-2">
                <button className="flex items-center text-gray-400">
                  EN <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
              <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2">
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Read Wikipedia in your language */}
            <div className="flex items-center justify-center w-full border-t border-b border-gray-800 py-4">
              <button className="flex items-center text-blue-700 hover:text-blue-400">
                <Globe className="mr-2 h-4 w-4" />
                Read Wikipedia in your language
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {/* Mobile View */}
        {isMobile && (
          <div className="w-full">
            {/* Header with Logo */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center ">
                <div className="w-12 h-12 mr-3">
                  <Image
                    src="/images/logo.png"
                    alt="Wikipedia Globe"
                    width={48}
                    height={48}
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-serif tracking-wide font-normal">
                    WIKIPEDIA
                  </h1>
                  <p className="text-xs font-serif">The Free Encyclopedia</p>
                </div>
              </div>

              <Link href={"/add-article"}>
                <Button
                  variant="outline"
                  className="cursor-pointer flex items-center gap-1 rounded border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4" />
                  Add article
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex w-full mb-6">
              <input
                type="text"
                className="flex-grow  border border-gray-700 px-4 py-2 text-black"
                placeholder="Search Wikipedia"
              />
              <div className="relative inline-block border-y border-r border-gray-700 px-3 py-2">
                <button className="flex items-center text-gray-400">
                  EN <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 sm:px-4 sm:py-2 px-2 py-1 text-white">
                <Search className="sm:h-5 sm:w-5 h-3 w-3" />
              </button>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <a
                    href={lang?.href}
                    className="text-blue-400 hover:text-blue-300 hover:underline text-base font-normal"
                  >
                    {lang.name}
                  </a>
                  <span className="text-xs text-gray-400">{lang.count}</span>
                </div>
              ))}
            </div>

            {/* Read Wikipedia in your language */}
            <div className="flex items-center justify-center w-full border-t border-b border-gray-800 py-3">
              <button className="flex items-center text-blue-400 hover:text-blue-300 text-sm">
                <Globe className="mr-2 h-4 w-4" />
                Read Wikipedia in your language
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
