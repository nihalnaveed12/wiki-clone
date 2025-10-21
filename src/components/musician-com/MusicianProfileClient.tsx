"use client";

import Image from "next/image";

import Link from "next/link";

import { MapPin, Globe, Pause, PlayIcon, ExternalLink } from "lucide-react";

import { useState, useRef } from "react";

interface Musician {
  _id: string;

  name: string;

  city: string;

  category: string;

  shortBio: string;

  website: string;

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

  createdAt: string;

  submittedBy: string;

  audio?: string;

  tags?: string;

  readMoreLink?: string;

  yearsActiveStart: string;

  yearsActiveEnd?: string;

  labelCrew?: string;

  associatedActs?: string;

  district?: string;

  frequentProducers?: string;

  breakoutTrack: {
    name: string;
    url?: string;
  };

  definingProject: {
    name: string;
    year?: string;
  };

  fansOf?: string;
}

interface Props {
  musician: Musician;

  canEdit: boolean | string | null;
}

export default function MusicianProfileClient({ musician, canEdit }: Props) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (!musician.audio) {
      alert("No audio available for this artist.");
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(musician.audio);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false)); // reset on end
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset position (optional)
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

  const producersArray = Array.isArray(musician.frequentProducers)
    ? musician.frequentProducers
    : typeof musician.frequentProducers === "string"
    ? musician.frequentProducers.split(",").map((p) => p.trim())
    : [];

  const fansOfArray = Array.isArray(musician.fansOf)
    ? musician.fansOf
    : typeof musician.fansOf === "string"
    ? musician.fansOf.split(",").map((f) => f.trim())
    : [];



  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div
                className="relative cursor-pointer flex-shrink-0"
                onClick={handlePlayAudio}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Image
                  src={musician.image.url}
                  alt={musician.name}
                  width={140}
                  height={140}
                  className="rounded object-cover w-36 h-36"
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

                {musician.readMoreLink && (
                  <Link
                    href={musician.readMoreLink}
                    target="_blank"
                    className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    [ Read the Full Deep Dive ]
                  </Link>
                )}

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
                  {musician.yearsActiveStart}

                  {musician.yearsActiveEnd
                    ? `-${musician.yearsActiveEnd}`
                    : "-Present"}
                </span>
              </div>

              <div className="grid grid-cols-[160px_1fr] gap-4">
                <span className="text-gray-400">Status:</span>

                <span>{musician.category}</span>
              </div>

              {musician.labelCrew && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Label / Crew:</span>

                  <span>{musician.labelCrew}</span>
                </div>
              )}

              {associatedActsArray.length > 0 && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Associated Acts:</span>

                  <span>
                    {associatedActsArray.map((act, idx) => (
                      <span key={idx}>
                        [ {act} ]{idx < associatedActsArray.length - 1 && " "}
                      </span>
                    ))}
                  </span>
                </div>
              )}

              {musician.district && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">
                    Neighborhood / District:
                  </span>

                  <span>{musician.district}</span>
                </div>
              )}

              {producersArray.length > 0 && (
                <div className="grid grid-cols-[160px_1fr] gap-4">
                  <span className="text-gray-400">Frequent Producer(s):</span>

                  <span>{producersArray.join(", ")}</span>
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
                    {musician.definingProject.name}

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
                  <span key={idx} className="text-sm">
                    [ {artist} ]{idx < fansOfArray.length - 1 && " "}
                  </span>
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
