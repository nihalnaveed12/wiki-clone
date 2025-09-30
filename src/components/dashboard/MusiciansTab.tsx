"use client";
import { useEffect, useState } from "react";
import { fetchMusicians } from "@/lib/api/musicians";

import MusicianDeleteButton from "../musician-com/MusicianDeleteButton";

interface Musicians {
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
  image: {
    id: string;
    url: string;
  };
  _id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  category: string;
  country: string;
  shortBio: string;
  website: string;
  createdAt: string;
  address: string;
  updatedAt: string;
  __v: number;
}

export default function MusiciansTab({ baseUrl }: { baseUrl: string }) {
  const [musicians, setMusicians] = useState<Musicians[]>([]);
  const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadMusicians();
  }, [baseUrl]);

  async function loadMusicians() {
    setLoading(true);
    try {
      const data = await fetchMusicians(baseUrl);
      setMusicians(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  //  async function handleDelete(id: string) {
  //     if (!confirm("Delete this post?")) return;
  //     setDeletingId(id);
  //     try {
  //       await deleteMusicians(id);
  //       setMusicians(musicians.filter((p) => p._id !== id));
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setDeletingId(null);
  //     }
  //   }

return loading ? (
  <p className="text-card-foreground">Loading musicians...</p>
) : (
  <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
    {musicians.length > 0 &&
      musicians.map((m) => (
        <div
          key={m._id}
          className="bg-card shadow-lg rounded-lg p-6 border border-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <img
                src={m.image.url}
                alt={m.name}
                className="w-16 h-16 rounded-full object-cover border border-border"
                width={64}
                height={64}
              />
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{m.name}</h3>
                <p className="text-muted-foreground">
                  {m.category} • {m.city}, {m.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(m.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-card-foreground mb-2">
              <strong>Address:</strong> {m.address}
            </p>
            <p className="text-card-foreground mb-2">
              <strong>Bio:</strong> {m.shortBio}
            </p>
            {m.website && (
              <p className="text-card-foreground mb-2">
                <strong>Website:</strong>
                <a
                  href={m.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1 transition-colors"
                >
                  {m.website}
                </a>
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {m.socials.instagram && (
                <a
                  href={m.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  Instagram
                </a>
              )}
              {m.socials.youtube && (
                <a
                  href={m.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  YouTube
                </a>
              )}
              {m.socials.spotify && (
                <a
                  href={m.socials.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  Spotify
                </a>
              )}
              {m.socials.soundcloud && (
                <a
                  href={m.socials.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm transition-colors"
                >
                  SoundCloud
                </a>
              )}
            </div>
          </div>

          <MusicianDeleteButton id={m._id}/>
        </div>
      ))}
  </div>
);
}
