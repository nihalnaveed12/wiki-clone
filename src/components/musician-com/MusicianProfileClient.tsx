"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, Pause, PlayIcon, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Musician {
  _id: string;
  name: string;
  city: string;
  category: string;
  shortBio: string;
  website: string;
  artistStatus?: string;
  image: {
    id: string;
    url: string;
  };
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
 
  submittedBy: string;
  audio?: string;
  tags?: string;
  readMoreLink?: string;
  yearsActive: {
    end?: string;
    start?: string;
  };
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string;
  associatedActsLinks?: string;
  district?: string;
  districtLink?: string;
  frequentProducers?: string;
  frequentProducersLink?: string;
  breakoutTrack: {
    name?: string;
    url?: string;
  };
  definingProject: {
    name?: string;
    year?: string;
    link?: string;
  };
  fansOf?: string;
  fansOfLink?: string;
  videoEmbed?: string;
  videoWidth?: number;
  videoHeight?: number;
}

interface Props {
  musician: Musician;
  canEdit: boolean | string | null;
}

// Helper function to check if URL is YouTube
export function isYouTubeUrl(url: string): boolean {
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
export function extractYouTubeId(url: string): string | null {
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

export default function MusicianProfileClient({ musician, canEdit }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYouTubeAudio, setIsYouTubeAudio] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);

  // Check if audio is YouTube on mount
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

  // Setup YouTube player messaging
  useEffect(() => {
    if (isYouTubeAudio && youtubePlayerRef.current) {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== "https://www.youtube.com") return;

        try {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange") {
            // -1: unstarted, 0: ended, 1: playing, 2: paused
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

    // Handle YouTube Audio
    if (isYouTubeAudio && youtubePlayerRef.current) {
      const iframe = youtubePlayerRef.current;

      if (isPlaying) {
        // Pause YouTube video
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
          "*"
        );
        setIsPlaying(false);
      } else {
        // Play YouTube video
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: "" }),
          "*"
        );
        setIsPlaying(true);
      }
      return;
    }

    // Handle Direct Audio (MP3, WAV, OGG)
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

  const tagsArray = Array.isArray(musician.tags)
    ? musician.tags
    : typeof musician.tags === "string"
    ? musician.tags.split(",").map((t) => t.trim())
    : [];

  const associatedActsArray = Array.isArray(musician.associatedActs)
    ? musician.associatedActs
    : typeof musician.associatedActs === "string"
    ? musician.associatedActs.split(",").map((a) => a.trim())
    : [];

  const associatedActsLinksArray = Array.isArray(musician.associatedActsLinks)
    ? musician.associatedActsLinks
    : typeof musician.associatedActsLinks === "string"
    ? musician.associatedActsLinks.split(",").map((l) => l.trim())
    : [];

  const producersArray = Array.isArray(musician.frequentProducers)
    ? musician.frequentProducers
    : typeof musician.frequentProducers === "string"
    ? musician.frequentProducers.split(",").map((p) => p.trim())
    : [];

  const producersLinksArray = Array.isArray(musician.frequentProducersLink)
    ? musician.frequentProducersLink
    : typeof musician.frequentProducersLink === "string"
    ? musician.frequentProducersLink.split(",").map((l) => l.trim())
    : [];

  const fansOfArray = Array.isArray(musician.fansOf)
    ? musician.fansOf
    : typeof musician.fansOf === "string"
    ? musician.fansOf.split(",").map((f) => f.trim())
    : [];

  const fansOfLinksArray = Array.isArray(musician.fansOfLink)
    ? musician.fansOfLink
    : typeof musician.fansOfLink === "string"
    ? musician.fansOfLink.split(",").map((l) => l.trim())
    : [];

  console.log("MusicianProfileClient render:", musician);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hidden YouTube iframe for audio playback */}
      {isYouTubeAudio && youtubeVideoId && (
        <iframe
          ref={youtubePlayerRef}
          src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&controls=0`}
          style={{ display: "none" }}
          allow="autoplay"
        />
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-12">
              <div className="flex flex-col gap-4">
                <div
                  className="relative cursor-pointer w-36 h-36"
                  onClick={handlePlayAudio}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Image
                    src={musician.image.url}
                    alt={musician.name}
                    width={140}
                    height={140}
                    className="rounded relative object-cover w-36 h-36"
                  />

                  {isHovering && musician.audio && (
                    <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                      {isPlaying ? (
                        <Pause className="w-8 h-8" />
                      ) : (
                        <PlayIcon className="w-8 h-8" />
                      )}
                    </span>
                  )}
                </div>

                <div className="">
                  {musician.videoEmbed && (
                    <div className="mt-6">
                      <div
                        className="relative border border-gray-700 rounded-lg resize overflow-hidden bg-black"
                        style={{
                          width: musician.videoWidth || 400,
                          height: musician.videoHeight || 300,
                          minWidth: 100,
                          minHeight: 100,
                          resize: "both",
                        }}
                      >
                        <iframe
                          src={
                            musician.videoEmbed.includes("youtube.com/embed/")
                              ? musician.videoEmbed
                              : musician.videoEmbed.replace(
                                  /(youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
                                  "youtube.com/embed/$2"
                                )
                          }
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{musician.name}</h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tagsArray.map((tag, idx) => (
                    <span key={idx} className="text-xs text-gray-400">
                      {tag}
                      {idx < tagsArray.length - 1 && " •"}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{musician.city}, California</span>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">
                  {musician.shortBio}
                </p>

               
                  <Link
                    href={`${musician._id}/deep-dives`}
                    target="_blank"
                    className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    [ Read the Full Deep Dive ]
                  </Link>
                

                {musician.breakoutTrack.name && musician.breakoutTrack.url && (
                  <div className="mt-4 text-sm text-gray-400">
                    (Embedded YouTube player for his song "
                    {`${musician.breakoutTrack.name})`}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {canEdit && (
                <Link
                  href={`/musician/${musician._id}/edit`}
                  className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-lg font-semibold mb-4">At-a-Glance</h2>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-[160px_1fr] gap-4">
                <span className="text-gray-400">Years Active:</span>
                <span>
                  {musician.yearsActive.start}
                  {musician.yearsActive.end
                    ? ` - ${musician.yearsActive.end}`
                    : "-"}
                </span>
              </div>

              <div className="grid grid-cols-[160px_1fr] gap-4">
                <span className="text-gray-400">Category:</span>
                <span>{musician.category}</span>
              </div>

              {musician.labelCrew && musician.labelCrewLink && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Label / Crew:</span>
                  <Link
                    href={musician.labelCrewLink ? musician.labelCrewLink : "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.labelCrew}
                  </Link>
                </div>
              )}

              {musician.artistStatus && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Artist Status:</span>
                  <span>{musician.artistStatus}</span>
                </div>
              )}

              {associatedActsArray.length > 0 && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Associated Acts:</span>
                  <div className="flex flex-wrap gap-2">
                    {associatedActsArray.map((act, idx) => (
                      <Link
                        key={idx}
                        href={
                          associatedActsLinksArray[idx]
                            ? associatedActsLinksArray[idx]
                            : "#"
                        }
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        {act}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {musician.district && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">
                    Neighborhood / District:
                  </span>
                  <Link
                    href={musician.districtLink ? musician.districtLink : "#"}
                    target="_blank"
                    className="text-blue-400 hover:underline"
                  >
                    {musician.district}
                  </Link>
                </div>
              )}

              {producersArray.length > 0 && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Frequent Producer(s):</span>
                  <div className="flex flex-wrap gap-2">
                    {producersArray.map((producer, idx) => (
                      <Link
                        key={idx}
                        href={
                          producersLinksArray[idx]
                            ? producersLinksArray[idx]
                            : "#"
                        }
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        {producer}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {musician.breakoutTrack && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Breakout Track:</span>
                  <span>
                    {musician.breakoutTrack.url ? (
                      <Link
                        href={musician.breakoutTrack.url}
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        "{musician.breakoutTrack.name}"
                      </Link>
                    ) : (
                      `"${musician.breakoutTrack.name}"`
                    )}
                  </span>
                </div>
              )}

              {musician.definingProject && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Defining Project:</span>
                  <span>
                    {musician.definingProject.link ? (
                      <Link
                        href={musician.definingProject.link}
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        {musician.definingProject.name}
                      </Link>
                    ) : (
                      musician.definingProject.name
                    )}
                    {musician.definingProject.year &&
                      ` (${musician.definingProject.year})`}
                  </span>
                </div>
              )}
            </div>

            {musician.website && (
              <div className="mt-6">
                <Link
                  href={musician.website}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Export to Sheets
                </Link>
              </div>
            )}
          </div>

          {fansOfArray.length > 0 && (
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-lg font-semibold mb-4">For Fans Of</h2>
              <div className="flex flex-wrap gap-2">
                {fansOfArray.map((artist, idx) => (
                  <Link
                    key={idx}
                    href={
                      fansOfLinksArray.length === fansOfArray.length
                        ? fansOfLinksArray[idx]
                        : "#"
                    }
                    target="_blank"
                    className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    {artist}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-lg font-semibold mb-4">Socials</h2>
            <div className="flex flex-wrap gap-3">
              {musician.socials.youtube && (
                <Link
                  href={musician.socials.youtube}
                  target="_blank"
                  className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  YouTube
                </Link>
              )}
              {musician.socials.spotify && (
                <Link
                  href={musician.socials.spotify}
                  target="_blank"
                  className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Spotify
                </Link>
              )}
              {musician.socials.soundcloud && (
                <Link
                  href={musician.socials.soundcloud}
                  target="_blank"
                  className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  SoundCloud
                </Link>
              )}
              {musician.socials.instagram && (
                <Link
                  href={musician.socials.instagram}
                  target="_blank"
                  className="px-4 py-2 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Instagram
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
