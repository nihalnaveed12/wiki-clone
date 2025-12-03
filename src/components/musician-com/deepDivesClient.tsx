"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.82 1.573l-7 10.5a1 1 0 11-1.64-1.146L9.53 7H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.5 3.5A1.5 1.5 0 0 0 4 5v10a1.5 1.5 0 0 0 3 0V5a1.5 1.5 0 0 0-1.5-1.5zM12.5 3.5A1.5 1.5 0 0 0 11 5v10a1.5 1.5 0 0 0 3 0V5a1.5 1.5 0 0 0-1.5-1.5z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.411-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.739 12.84c.361.21.599.659.359 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057 1.645-.18 1.14-.6-3.861-1.98-11.281-2.58-15.721-1.411-.539-.148-.719-.069-1.56.42-.421-1.02-.599-1.559-.3z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.7 5.5" />
  </svg>
);

const SoundcloudIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M1.175 12.225c-.051 0-.175.016-.175.175v1.2c0 .159.124.175.175.175h.975v-1.55H1.175zm1.949 0c-.05 0-.175.016-.175.175v1.2c0 .159.125.175.175.175h.975v-1.55h-.975zm1.949 0c-.051 0-.175.016-.175.175v1.2c0 .159.124.175.175.175h.975v-1.55h-.975zm6.3-5.213c-.659 0-1.275.135-1.867.339v9.404h1.867c2.757 0 4.992-2.234 4.992-4.992 0-2.757-2.235-4.99-4.992-4.99zm-4.134 5.213c-.05 0-.175.016-.175.175v1.2c0 .159.125.175.175.175h.975v-1.55h-.975zm11.867 0c-.051 0-.175.016-.175.175v1.2c0 .159.124.175.175.175h.975v-1.55h-.975z" />
  </svg>
);

export interface Musician {
  name: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  category: string;
  artistStatus?: string;
  website?: string;

  socials?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    twitter?: string;
    appleMusic?: string;
  };

  heroBannerImage?: {
    id?: string;
    url?: string;
  };

  heroTags?: string[];
  image: { id: string; url: string };
  shortBio: string;

  audio?: string;

  videos?: {
    title?: string;
    type?: string;
    embedUrl?: string;
    isFeatured?: boolean;
  }[];

  definingTracks?: {
    title?: string;
    year?: number;
    image?: { id?: string; url?: string };
    externalLink?: string;
  }[];

  deepDiveNarrative?: string;
  videoEmbed?: string;
  videoWidth?: number;
  videoHeight?: number;
  alsoKnownAs?: string[];
  born?: string;
  origin?: string;

  primaryAffiliation?: {
    name?: string;
    link?: string;
  };

  notableCollaborators?: string[];
  proteges?: string[];
  relatedArtists?: string[];

  readMoreLink?: string;

  yearsActive?: {
    start?: number;
    end?: number;
  };

  labelCrew?: string;
  labelCrewLink?: string;

  associatedActs?: string[];
  associatedActsLinks?: string[];

  district?: string;
  districtLink?: string;

  frequentProducers?: string[];
  frequentProducersLink?: string[];

  breakoutTrack?: {
    name?: string;
    url?: string;
  };

  status?: "active" | "inactive";

  definingProject?: {
    name?: string;
    year?: number;
    link?: string;
  };

  fansOf?: string[];
  fansOfLink?: string[];
  submittedBy?: string;
  _id?: string;
  createdAt: string;
}

interface Props {
  musician: Musician;
  canEdit: boolean | string | null;
}

export function isYouTubeUrl(url: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    return host.includes("youtube.com") || host.includes("youtu.be");
  } catch {
    return false;
  }
}

export function extractYouTubeId(url: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    if (host.includes("youtu.be")) return u.pathname.slice(1);
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      return parts[parts.length - 1];
    }
  } catch {}
  return null;
}

export default function MusicianProfileClient({ musician, canEdit }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYouTubeAudio, setIsYouTubeAudio] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("music");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (musician.audio) {
      const isYT = isYouTubeUrl(musician.audio);
      setIsYouTubeAudio(isYT);

      if (isYT) {
        const videoId = extractYouTubeId(musician.audio);
        setYoutubeVideoId(videoId);
      }
    }
  }, [musician.audio]);

  useEffect(() => {
    if (isYouTubeAudio && youtubePlayerRef.current) {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://www.youtube.com") return;

        try {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange") {
            if (data.info === 0) {
              setIsPlaying(false);
            }
          }
        } catch (e) {
          // Not a YouTube message
        }
      };

      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }
  }, [isYouTubeAudio]);

  const handlePlayAudio = () => {
    if (!musician.audio) {
      alert("No audio available for this artist.");
      return;
    }

    if (isYouTubeAudio && youtubePlayerRef.current) {
      const iframe = youtubePlayerRef.current;

      if (isPlaying) {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
        setIsPlaying(false);
      } else {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
        setIsPlaying(true);
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(musician.audio);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play error:", err));
      setIsPlaying(true);
    }
  };

  const tags = musician.heroTags || [];
  const filteredVideos =
    musician.videos?.filter((v) => {
      if (activeTab === "music") return v.type === "Music Video";
      if (activeTab === "interview") return v.type === "Interview";
      if (activeTab === "vlog") return v.type === "Vlog Videos" 
      if (activeTab === "other") return v.type === "Other Videos";
    }) || [];

  return (
    <div className="bg-black text-white min-h-screen">
      {isYouTubeAudio && youtubeVideoId && (
        <iframe
          ref={youtubePlayerRef}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&controls=0`}
          style={{ display: "none" }}
          allow="autoplay"
        />
      )}

      {/* HERO BANNER */}
      <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
        {musician.heroBannerImage?.url && (
          <Image
            src={musician.heroBannerImage.url || "/placeholder.svg"}
            alt={musician.name}
            fill
            className="object-cover "
          />
        )}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 space-y-4">
          {/* Hero Tags and Artist Name */}
          <div className="flex items-center justify-center gap-6 md:gap-12">
            {tags[0] && (
              <span className="text-gray-300 text-lg font-medium">
                {tags[0]}
              </span>
            )}
            <h1 className="text-9xl  font-bold text-white text-balance">
              {musician.name}
            </h1>
            {tags[1] && (
              <span className="text-gray-300 text-lg font-medium">
                {tags[1]}
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p className="text-gray-300 text-base md:text-lg">
            {musician.origin
              ? `King of the ${musician.origin}`
              : musician.shortBio}
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 justify-center pt-2">
            {musician.socials?.instagram && (
              <a
                href={musician.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <InstagramIcon />
              </a>
            )}
            {musician.socials?.youtube && (
              <a
                href={musician.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <YouTubeIcon />
              </a>
            )}
            {musician.socials?.spotify && (
              <a
                href={musician.socials.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <SpotifyIcon />
              </a>
            )}
            {musician.socials?.twitter && (
              <a
                href={musician.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <TwitterIcon />
              </a>
            )}
            {musician.socials?.soundcloud && (
              <a
                href={musician.socials.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <SoundcloudIcon />
              </a>
            )}

            {musician.website && (
              <a
                href={musician.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <GlobeIcon />
              </a>
            )}

            {musician.socials?.appleMusic && (
              <a
                href={musician.socials.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.365 1.43c-.96.113-2.092.64-2.77 1.42-.6.7-1.12 1.82-1.01 2.89 1.08.04 2.18-.55 2.77-1.32.6-.78 1.12-1.9 1.01-2.99zm-2.54 4.95c-.83.1-1.7.5-2.24 1.12-.5.54-.83 1.3-.75 2.05 1.02-.04 2.06-.48 2.58-1.14.53-.66.86-1.5.73-2.03zm4.19 7.28c-.02-3.22-2.64-4.77-5.22-4.77-2.24 0-3.44 1.26-4.07 2.21-.88 1.29-1.34 3.02-1.15 4.74l-.01.03c-.02 3.22 2.64 4.77 5.22 4.77 2.24 0 3.44-1.26 4.07-2.21.88-1.29 1.34-3.02 1.15-4.74zm-1.92 4.66c-.45.66-1.36 1.58-2.93 1.58-1.22 0-2-.8-2-.8s-.38-.36-.72-.9c-.37-.6-.63-1.42-.52-2.24l5.96-3.43c.45-.66 1.36-1.58 2.93-1.58 1.22 0 2 .8 2 .8s.38.36.72.9c.37.6.63 1.42.52 2.24l-5.96 3.43z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="border-b border-gray-700 p-2 bg-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 flex gap-8 justify-center overflow-x-auto">
          {[
            { id: "music", label: "Music Videos" },
            { id: "interview", label: "Interview Videos" },
            { id: "vlog", label: "Vlogs / Behind The Scenes" },
            { id: "other", label: "Other Videos" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 text-sm whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "border-white text-white font-medium"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT - 3 COLUMNS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
          {/* LEFT COLUMN: DEFINING TRACKS */}
          <div className="border-2 p-4 rounded-[12px] bg-background h-fit" >
            <h2 className="text-lg  font-bold mb-6 uppercase tracking-wide text-gray-100">
              ## DEFINING TRACKS
            </h2>
            <div className="space-y-4">
              {musician.definingTracks && musician.definingTracks.length > 0 ? (
                musician.definingTracks.map((track, idx) => (
                  <Link
                    key={idx}
                    href={track.externalLink || "#"}
                    target="_blank"
                    className="group flex gap-3 bg-gray-900 rounded p-3 hover:bg-gray-800 transition"
                  >
                    {track.image?.url && (
                      <div className="w-14 h-14 flex-shrink-0 relative rounded overflow-hidden">
                        <img
                          src={track.image.url || "/placeholder.svg"}
                          alt={track.title}
                          className="object-cover object-center w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-gray-300">
                        {track.title}
                      </p>
                      {track.year && (
                        <p className="text-xs text-gray-500 mt-1">
                          {track.year}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No defining tracks available
                </p>
              )}

              {musician.readMoreLink && (
                <Link
                  href={musician.readMoreLink}
                  target="_blank"
                  className="text-gray-400 hover:text-white text-sm mt-6 flex items-center gap-2"
                >
                  View Full Discography →
                </Link>
              )}
            </div>
          </div>

          {/* MIDDLE COLUMN: DEEP DIVE NARRATIVE */}
          <div className="border-2 p-4 rounded-[12px] bg-background h-fit">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-gray-100">
              ## DEEP DIVE NARRATIVE
            </h2>
            <div className="space-y-4">
              {musician.deepDiveNarrative && (
                <p className="text-sm text-gray-300 leading-relaxed ">
                  {musician.deepDiveNarrative}
                </p>
              )}

              {filteredVideos.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Secondary Videos
                  </p>
                  <div className="space-y-3">
                    {filteredVideos.slice(0, 3).map((video, idx) => {
                      const videoId = extractYouTubeId(video.embedUrl || "");
                      const thumbnailUrl = videoId
                        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                        : "/placeholder.svg";

                      if (currentlyPlaying === video.embedUrl && videoId) {
                        return (
                          <div
                            key={idx}
                            className="relative w-full aspect-video rounded overflow-hidden"
                          >
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setCurrentlyPlaying(video.embedUrl || "")
                          }
                          className="block group relative rounded overflow-hidden bg-gray-900 hover:opacity-90 transition cursor-pointer"
                        >
                          <div className="relative w-full aspect-video">
                            <Image
                              src={thumbnailUrl || "/placeholder.svg"}
                              alt={video.title || "Video Thumbnail"}
                              fill
                              className="object-cover"
                            />
                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition flex items-center justify-center">
                              <div className="bg-red-600 rounded-full p-3">
                                <PlayIcon />
                              </div>
                            </div>
                          </div>
                          <p className="text-lg text-gray-300 p-2 line-clamp-2">
                            {video.title}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: AT-A-GLANCE */}
          <div className="border-2 p-4 rounded-[12px] bg-background h-fit">
            <h2 className="text-lg font-bold mb-6 uppercase tracking-wide text-gray-100">
              AT-A-GLANCE
            </h2>

            <div className="space-y-5 text-sm">
              {musician.alsoKnownAs && musician.alsoKnownAs?.length > 0 && (
                <Row label="Also Known As">
                  {musician.alsoKnownAs.join(", ")}
                </Row>
              )}

              {musician.born && <Row label="Born">{musician.born}</Row>}

              {musician.origin && <Row label="Origin">{musician.origin}</Row>}

              {musician.yearsActive && (
                <Row label="Years Active">
                  {musician.yearsActive.start}
                  {musician.yearsActive.end && ` - ${musician.yearsActive.end}`}
                </Row>
              )}

              {musician.labelCrew && (
                <Row label="Label / Crew">
                  <Link
                    href={musician.labelCrewLink || "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.labelCrew}
                  </Link>
                </Row>
              )}
              {musician.category && (
                <Row label="Category">{musician.category}</Row>
              )}
              {musician.artistStatus && (
                <Row label="Artist Status">{musician.artistStatus}</Row>
              )}
              {musician.status && <Row label="Status">{musician.status}</Row>}
              {musician.district && (
                <Row label="District">
                  {musician.districtLink ? (
                    <Link
                      href={musician.districtLink}
                      target="_blank"
                      className="text-blue-400 hover:underline"
                    >
                      {musician.district}
                    </Link>
                  ) : (
                    musician.district
                  )}
                </Row>
              )}
              {musician.website && (
                <Row label="Website">
                  <Link
                    href={musician.website}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.website}
                  </Link>
                </Row>
              )}
              {musician.primaryAffiliation?.name && (
                <Row label="Primary Affiliation">
                  <Link
                    href={musician.primaryAffiliation.link || "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.primaryAffiliation.name}
                  </Link>
                </Row>
              )}
              {musician.breakoutTrack?.name && (
                <Row label="Breakout Track">
                  <Link
                    href={musician.breakoutTrack.url || "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.breakoutTrack.name}
                  </Link>
                </Row>
              )}
              {musician.definingProject?.name && (
                <Row label="Defining Project">
                  <Link
                    href={musician.definingProject.link || "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {`${musician.definingProject.name} (${musician.definingProject.year})`}
                  </Link>
                </Row>
              )}

              {musician.associatedActs &&
                musician.associatedActs.length > 0 && (
                  <Row label="Associated Acts">
                    <Links
                      list={musician.associatedActs}
                      links={musician.associatedActsLinks || []}
                    />
                  </Row>
                )}

              {musician.notableCollaborators &&
                musician.notableCollaborators.length > 0 && (
                  <Row label="Notable Collaborators">
                    {musician.notableCollaborators.join(", ")}
                  </Row>
                )}

              {musician.proteges && musician.proteges.length > 0 && (
                <Row label="Proteges">{musician.proteges.join(", ")}</Row>
              )}

              {musician.frequentProducers &&
                musician.frequentProducers.length > 0 && (
                  <Row label="Frequent Producers">
                    <Links
                      list={musician.frequentProducers}
                      links={musician.frequentProducersLink || []}
                    />
                  </Row>
                )}

              {musician.fansOf && musician.fansOf.length > 0 && (
                <Row label="Fans Of">
                  <Links
                    list={musician.fansOf}
                    links={musician.fansOfLink || []}
                  />
                </Row>
              )}
            </div>

            {/* SOCIALS */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                Socials
              </p>
              <div className="flex gap-4">
                {musician.socials?.spotify && (
                  <a
                    href={musician.socials.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <SpotifyIcon />
                  </a>
                )}
                {musician.socials?.instagram && (
                  <a
                    href={musician.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {musician.socials?.youtube && (
                  <a
                    href={musician.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <YouTubeIcon />
                  </a>
                )}
                {musician.socials?.twitter && (
                  <a
                    href={musician.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <TwitterIcon />
                  </a>
                )}
                {musician.socials?.soundcloud && (
                  <a
                    href={musician.socials.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <SoundcloudIcon />
                  </a>
                )}

                {musician.website && (
                  <a
                    href={musician.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition"
                  >
                    <GlobeIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED ARTISTS SECTION */}
      {musician.relatedArtists && musician.relatedArtists.length > 0 && (
        <div className="bg-gray-950 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-10 text-center uppercase tracking-wide text-gray-100">
              ## THE KINGDOM / RELATED ARTISTS
            </h2>
            <div className="flex justify-center gap-12 flex-wrap">
              {musician.relatedArtists.map((artist, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-24 h-24 rounded-full bg-red-600 mx-auto mb-3 flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold text-center px-2">
                      {artist}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">{artist}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="fixed top-20 right-8 z-50">
        <button
          onClick={handlePlayAudio}
          className="bg-red-600 text-white rounded-full p-4 cursor-pointer shadow-lg hover:bg-red-700 transition flex items-center justify-center"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      {canEdit && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link
            href={`/musician/${musician._id}/edit`}
            className="bg-blue-600 text-white rounded-full px-4 py-2 cursor-pointer shadow-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: any }) {
  return (
    <div>
      <p className="text-gray-600 text-xs font-semibold uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-300 text-sm">{children}</p>
    </div>
  );
}

function Links({ list = [], links = [] }: { list: string[]; links: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item, i) => (
        <Link
          key={i}
          href={links[i] || "#"}
          className="text-blue-400 hover:underline text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
