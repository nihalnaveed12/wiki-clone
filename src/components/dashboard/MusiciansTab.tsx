"use client";
import { useEffect, useState } from "react";
import { fetchMusicians } from "@/lib/api/musicians";

interface Musicians {
  socials: {
    instagram: string;
    twitter: string;
    youtube: string;
    spotify: string;
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
  shortBio: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function MusiciansTab({baseUrl}: {baseUrl: string}) {
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
    <div>
      {musicians.length > 0 && musicians.map((m: Musicians) => (
        <div key={m._id} className="bg-white shadow rounded p-4 mb-4">
          <h3 className="text-xl font-bold">{m.name}</h3>
          <p>{m.city} - {m.category}</p>
          <p>{m.shortBio}</p>
        </div>
      ))}
    </div>
  );
}
