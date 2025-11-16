"use client";

import { useEffect, useRef, useState } from "react";
import { fetchMusicians } from "@/lib/fetchmusicians";
import Link from "next/link";
import ArticleCard from "./article-card";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, PlayIcon } from "lucide-react";
import { Musicians } from "@/lib/api/musicians";

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

// Helper function to check if URL is YouTube
function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");
    return hostname.includes("youtube.com") || hostname.includes("youtu.be");
  } catch {
    return false;
  }
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");

    if (hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("?")[0];
    }

    if (hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;

      const pathParts = u.pathname.split("/");
      if (pathParts.includes("embed") || pathParts.includes("v")) {
        return pathParts[pathParts.length - 1];
      }
    }

    return null;
  } catch {
    return null;
  }
}

export default function WikipediaHero() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [musicians, setMusicians] = useState<Musicians[]>([]);
  const [loading, setLoading] = useState(true);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isYouTubeAudio, setIsYouTubeAudio] = useState(false);
  const [currentYouTubeId, setCurrentYouTubeId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Setup YouTube player messaging
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          // 0: ended
          if (data.info === 0) {
            setPlayingId(null);
          }
        }
      } catch (e) {
        // Not a YouTube message
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleToggleAudio = (musician: Musicians) => {
    if (!musician.audio) {
      alert("No audio available for this artist.");
      return;
    }

    const isYT = isYouTubeUrl(musician.audio);

    // If clicking same musician → toggle pause/play
    if (playingId === musician._id) {
      if (isYouTubeAudio && youtubePlayerRef.current) {
        // Pause YouTube
        youtubePlayerRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
      } else if (audioRef.current) {
        // Pause regular audio
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setPlayingId(null);
      setIsYouTubeAudio(false);
      setCurrentYouTubeId(null);
      return;
    }

    // Stop previous audio (if any)
    if (playingId) {
      if (isYouTubeAudio && youtubePlayerRef.current) {
        youtubePlayerRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "stopVideo", args: "" }),
          "*"
        );
      } else if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    // Play new audio
    if (isYT) {
      // Handle YouTube Audio
      const videoId = extractYouTubeId(musician.audio);
      if (videoId) {
        setIsYouTubeAudio(true);
        setCurrentYouTubeId(videoId);
        setPlayingId(musician._id);

        // Wait for iframe to load, then play
        setTimeout(() => {
          youtubePlayerRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: "" }),
            "*"
          );
        }, 500);
      }
    } else {
      // Handle Direct Audio (MP3, WAV, OGG)
      setIsYouTubeAudio(false);
      setCurrentYouTubeId(null);

      const newAudio = new Audio(musician.audio);
      audioRef.current = newAudio;
      newAudio.play().catch((err) => console.error("Audio play error:", err));
      newAudio.addEventListener("ended", () => setPlayingId(null));
      setPlayingId(musician._id);
    }
  };

  useEffect(() => {
    const getMusicians = async () => {
      try {
        const data = await fetchMusicians();
        setMusicians(data);
      } catch (err) {
        console.error("Error fetching musicians:", err);
      } finally {
        setLoading(false);
      }
    };
    getMusicians();
  }, []);

  useEffect(() => {
    async function loadBlogs() {
      const res = await fetch(`${BaseUrl}/api/blogs`);
      const data: BlogsResponse = await res.json();
      setBlogs(data.blogs || []);
    }
    loadBlogs();
  }, [BaseUrl]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-card-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-background text-foreground py-6 md:py-12 px-4">
      {/* Hidden YouTube iframe for audio playback */}
      {isYouTubeAudio && currentYouTubeId && (
        <iframe
          ref={youtubePlayerRef}
          src={`https://www.youtube.com/embed/${currentYouTubeId}?enablejsapi=1&controls=0`}
          style={{ display: "none" }}
          allow="autoplay"
        />
      )}

      <div className="w-full max-w-7xl flex flex-col items-center">
        {/* 🎵 Musicians Section */}
        <div className="w-full">
          <h1 className="md:text-4xl text-3xl font-bold font-sans text-center mb-8">
            Uncover the Talent Behind the Music
          </h1>

          <div className="relative ">
            <div
              id="musician-scroll"
              className="flex gap-6 overflow-x-hidden scrollbar-hide scroll-smooth"
            >
              {musicians.slice(0, 10).map((musician) => (
                <div
                  key={musician._id}
                  className="relative min-w-[200px] bg-card rounded-xl shadow hover:shadow-lg transition p-3 border border-border group"
                >
                  {/* Image with play/pause overlay */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() => handleToggleAudio(musician)}
                  >
                    <Image
                      src={musician.image?.url || "/default-avatar.png"}
                      alt={musician.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-40"
                    />
                    {musician.audio && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                        {playingId === musician._id ? (
                          <Pause className="w-10 h-10 text-white" />
                        ) : (
                          <PlayIcon className="w-10 h-10 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Name & Category */}
                  <Link href={`/musician/${musician._id}`}>
                    <h3 className="mt-3 text-lg font-semibold truncate text-card-foreground">
                      {musician.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {musician.category}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
            {/* Scroll Buttons */}
            <button
              onClick={() => {
                const el = document.getElementById("musician-scroll");
                el?.scrollBy({ left: -300, behavior: "smooth" });
              }}
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-card shadow rounded-full p-2 hover:bg-accent border border-border transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-card-foreground" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("musician-scroll");
                el?.scrollBy({ left: 300, behavior: "smooth" });
              }}
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-card shadow rounded-full p-2 hover:bg-accent border border-border transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-card-foreground" />
            </button>
          </div>
        </div>

        {/* 📰 Blogs Section */}
        <h1 className="py-10 mt-10 text-2xl font-bold font-sans text-card-foreground">
          Latest Articles
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.slice(0, 4).map((blog, index) => (
            <ArticleCard blog={blog} key={index} />
          ))}
        </div>

        <Link
          href={"/articles-page"}
          className="text-primary hover:text-primary/80 border border-border px-4 py-2 my-10 bg-card hover:bg-accent hover:underline text-xl font-semibold transition-colors"
        >
          More Articles
        </Link>
      </div>
    </div>
  );
}