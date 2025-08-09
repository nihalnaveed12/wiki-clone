"use client";
import { useEffect, useState } from "react";
import { fetchMusicians } from "@/lib/api/musicians";
import Image from "next/image";

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
  country:string
  shortBio: string;
  website:string
  createdAt: string;
  address:string;
  updatedAt: string;
  __v: number;
}

export default function MusiciansTab({ baseUrl }: { baseUrl: string }) {
  const [musicians, setMusicians] = useState<Musicians[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMusicians(baseUrl)
      .then(setMusicians)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [baseUrl]);

  return loading ? (
    <p>Loading musicians...</p>
  ) : (
    <div className="grid lg:grid-cols-3 sm:grid-cols-2  gap-4">
      {musicians.length > 0 &&
        musicians.map((m: Musicians) => (
          <div
            key={m._id}
            className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={m.image.url}
                  alt={m.name}
                  className="w-16 h-16 rounded-full object-cover"
                  width={64}
                  height={64}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {m.name}
                  </h3>
                  <p className="text-gray-600">
                    {m.category} • {m.city}, {m.country}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted:{" "}
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> {m.address}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Bio:</strong> {m.shortBio}
              </p>
              {m.website && (
                <p className="text-gray-700 mb-2">
                  <strong>Website:</strong>
                  <a
                    href={m.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
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
                    className="text-pink-600 hover:underline text-sm"
                  >
                    Instagram
                  </a>
                )}
                {m.socials.youtube && (
                  <a
                    href={m.socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline text-sm"
                  >
                    YouTube
                  </a>
                )}
                {m.socials.spotify && (
                  <a
                    href={m.socials.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm"
                  >
                    Spotify
                  </a>
                )}
                {m.socials.soundcloud && (
                  <a
                    href={m.socials.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline text-sm"
                  >
                    SoundCloud
                  </a>
                )}
              </div>
            </div>

          

            
          </div>
        ))}
    </div>
  );
}
