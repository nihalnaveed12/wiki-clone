"use client";

import { Menu, Search } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle/Toggle";

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
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const router = useRouter();

  const { user } = useUser();

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL as string;
  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      setUserRole("admin");
    } else {
      setUserRole("user");
    }
  }, [user, ADMIN_EMAIL]);

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
    if (!query) return;
    let blog = blogs.find(
      (b) => b.slug.toLowerCase() === query || b.title.toLowerCase() === query
    );
    if (!blog) {
      blog = blogs.find(
        (b) =>
          b.slug.toLowerCase().includes(query) ||
          b.title.toLowerCase().includes(query)
      );
    }
    if (blog) {
      router.push(`/article/${blog.slug}`);
    } else {
      console.log("No article found for query:", query);
    }
  };

  return (
    <div className="w-full  sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto flex justify-between text-[16px] h-[60px] w-full items-center px-4">
        {/* Left section with menu and logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="">
            <div className="md:text-2xl text-xl font-serif tracking-tight text-neutral-900 dark:text-neutral-100">
              Deep Dives
            </div>
          </Link>

          <ul className="md:flex hidden items-center gap-1">
            <li>
              <Link
                href="/articles-page"
                className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                Add Articles
              </Link>
            </li>
            <li>
              <Link
                href="/musicians-map"
                className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                Find Artists
              </Link>
            </li>
            <li>
              <Link
                href="/musician-form"
                className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                Get Listed
              </Link>
            </li>
          </ul>
        </div>

        {/* Center section with search */}
        <div className="mx-4 items-center hidden lg:flex">
          <div className="relative flex w-full max-w-[500px] items-center">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
              <Search className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
            </div>
            <input
              type="text"
              placeholder="Search Urban Knowledge"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-[34px] w-full rounded-l border border-neutral-400 dark:border-neutral-700 pl-8 pr-2 text-sm focus:border-neutral-500 focus:outline-none text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800"
            />
            <button
              onClick={handleSearch}
              className="h-[34px] rounded-r border border-l-0 border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
            >
              Search
            </button>
          </div>
        </div>

        <div className="md:flex gap-7 hidden items-center">
          {userRole === "admin" && (
            <Link
              href={"/dashboard"}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100"
            >
              Dashboard
            </Link>
          )}

          <div>
          <ThemeToggle />
          </div>

          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <button className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer text-neutral-800 dark:text-neutral-200">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer text-neutral-800 dark:text-neutral-200">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>

          

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

         

        {/* Mobile menu */}
        <div className="md:hidden flex gap-3 items-center">
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-2xl pb-4">Menu Items</SheetTitle>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      href={"/articles-page"}
                      className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100"
                    >
                      Add Articles
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/musicians-map"}
                      className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100"
                    >
                      Find Musicians
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/musician-form"}
                      className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100"
                    >
                      Musician Registration
                    </Link>
                  </li>
                  {userRole === "admin" && (
                    <li>
                      <Link
                        href={"/dashboard"}
                        className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <SignedOut>
                      <div className="flex flex-col gap-4">
                        <SignInButton>
                          <button className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100">
                            Sign In
                          </button>
                        </SignInButton>
                        <SignUpButton>
                          <button className="cursor-pointer text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-neutral-100">
                            Sign Up
                          </button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                  </li>
                  <li>
                    <div className="relative flex w-full max-w-[500px] items-center">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 transform">
                        <Search className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search Urban Knowledge"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-[34px] w-full rounded-l border border-neutral-400 dark:border-neutral-700 pl-8 pr-2 text-sm focus:border-neutral-500 focus:outline-none text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800"
                      />
                      <button
                        onClick={handleSearch}
                        className="h-[34px] rounded-r border border-l-0 border-neutral-400 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                      >
                        Search
                      </button>
                    </div>
                  </li>
                </ul>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
