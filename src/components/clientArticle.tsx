"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function extractYouTubeId(url: string): string | null {
  const shortRegex = /youtu\.be\/([^?&]+)/;
  const longRegex = /v=([^?&]+)/;
  return url.match(shortRegex)?.[1] || url.match(longRegex)?.[1] || null;
}

export default function ClientVideoTabs({
  youtubeUrls = [],
  musicVideos = [],
  introVideos = [],
  vlogVideos = [],
}: {
  youtubeUrls?: string[];
  musicVideos?: string[];
  introVideos?: string[];
  vlogVideos?: string[];
}) {
  const [activeTab, setActiveTab] = useState("music");

  const renderVideos = (videos: string[]) => (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      {videos.map((url, i) => {
        const id = extractYouTubeId(url);
        return (
          id && (
            <iframe
              key={i}
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${id}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-md border"
            />
          )
        );
      })}
    </motion.div>
  );

  const tabs = [
    { id: "music", label: "Music Videos", content: renderVideos(musicVideos) },
    { id: "intro", label: "Intro Videos", content: renderVideos(introVideos) },
    { id: "vlog", label: "Vlogs / Behind The Scenes", content: renderVideos(vlogVideos) },
    { id: "other", label: "Other Videos", content: renderVideos(youtubeUrls) },
  ];

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-3 border-b border-gray-400">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm sm:text-base font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tabs.find((t) => t.id === activeTab)?.content}
      </AnimatePresence>
    </div>
  );
}
