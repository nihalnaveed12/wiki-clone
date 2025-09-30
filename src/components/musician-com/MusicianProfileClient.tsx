"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, Pause, PlayIcon } from "lucide-react";
import MusicianDeleteButton from "./MusicianDeleteButton";
import { useState, useRef } from "react";

interface Musician {
  _id: string;
  name: string;
  city: string;
  country: string;
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
  address: string;
  createdAt: string;
  submittedBy: string;
  audio?: string; // NEW FIELD
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
      audioRef.current.play().catch((err) => console.error("Audio play error:", err));
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-border">
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex gap-3">
        {canEdit && (
          <Link
            href={`/musician/${musician._id}/edit`}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold"
          >
            Edit
          </Link>
        )}
        <MusicianDeleteButton id={musician._id} />
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-8">
        <div
          className="relative cursor-pointer"
          onClick={handlePlayAudio}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image
            src={musician.image.url}
            alt={musician.name}
            width={140}
            height={140}
            className="rounded-full object-cover w-36 h-36 border-4 border-border shadow-lg"
          />
          {isHovering && musician.audio && (
            <span className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full text-white text-sm font-semibold">
              {isPlaying ? <Pause /> : <PlayIcon />}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-4xl font-extrabold">{musician.name}</h1>
          <p className="text-muted-foreground mt-1">
            {musician.category} • {musician.city}, {musician.country}
          </p>
          <p className="text-sm text-muted-foreground">
            Joined on {new Date(musician.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Bio & Address */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-card-foreground">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{musician.address}</span>
        </div>
        <p className="text-card-foreground leading-relaxed">
          {musician.shortBio}
        </p>
        {musician.website && (
          <p className="flex items-center gap-2 text-primary hover:underline transition-colors">
            <Globe className="w-4 h-4" />
            <a
              href={musician.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {musician.website}
            </a>
          </p>
        )}
      </div>

      {/* Social Links */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Socials</h2>
        <div className="flex flex-wrap gap-3">
          {musician.socials.instagram && (
            <a
              href={musician.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              Instagram
            </a>
          )}
          {musician.socials.youtube && (
            <a
              href={musician.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              YouTube
            </a>
          )}
          {musician.socials.spotify && (
            <a
              href={musician.socials.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              Spotify
            </a>
          )}
          {musician.socials.soundcloud && (
            <a
              href={musician.socials.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              SoundCloud
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
