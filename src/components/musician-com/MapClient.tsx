"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchMusicians } from "@/lib/fetchmusicians";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as { getIconUrl?: () => string }).getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface Musician {
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

export default function MapClient() {
  const [search, setSearch] = useState("");
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  useEffect(() => {
    const getMusicians = async () => {
      try {
        const data = await fetchMusicians();
        setMusicians(data || []);
      } catch (err) {
        console.error("Error fetching musicians:", err);
      } finally {
        setLoading(false);
      }
    };
    getMusicians();
  }, []);

  // Filtered list based on search
  const filteredMusicians = useMemo(() => {
    if (!search.trim()) return [];
    return musicians.filter((m) =>
      m.city.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [search, musicians]);

  // Map fly-to helper
  function FlyToLocation() {
    const map = useMap();
    useEffect(() => {
      if (filteredMusicians.length > 0) {
        map.flyTo([filteredMusicians[0].lat, filteredMusicians[0].lng], 10);
      }
    }, [filteredMusicians, map]);
    return null;
  }

  const handleSearchSubmit = () => {
    setSearchSubmitted(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchSubmitted(false);
  };

  if (loading) return <p className="p-10 text-center text-2xl">Loading...</p>;

  if (!musicians.length)
    return <p className="text-center mt-10">No musicians found.</p>;

  return (
    <div className="text-black flex h-screen font-sans">
      {/* Left Side - Search */}
      <div className="absolute top-20 left-20 z-10 w-[25%] ">
        {/* Search Box */}
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Enter city name..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            className={`${
              search ? "rounded-t-lg" : "rounded-full"
            } px-4 py-2 w-full border focus:outline-none bg-white`}
          />
          <button className="absolute right-4" onClick={handleSearchSubmit}>
            <Search size={20} color="gray" />
          </button>
        </div>

        {/* Suggestions Mode */}
        {search && !searchSubmitted && filteredMusicians.length > 0 && (
          <div className="flex flex-col gap-3 bg-white p-4 rounded-b-2xl shadow">
            {filteredMusicians.map((musician) => (
              <div key={musician._id} className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="font-medium">{musician.name}</span>
                <span className="text-gray-600 text-sm">
                  {musician.category} - {musician.city}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Full Result Mode */}
        {searchSubmitted && filteredMusicians.length > 0 && (
          <div className="grid gap-4 p-4 bg-white overflow-y-scroll h-screen">
            {filteredMusicians.map((musician) => (
              <Link
                href={`/musician/${musician._id}`}
                key={musician._id}
                className="bg-white rounded-lg border shadow-lg p-4 flex gap-4"
              >
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-semibold">{musician.name}</h2>
                  <p className="text-gray-600">
                    {musician.category} - {musician.city}
                  </p>
                  <p className="text-sm mt-2">{musician.shortBio}</p>
                  <div className="flex gap-3 flex-wrap  text-blue-500 text-sm">
                    {musician.socials.instagram && (
                      <Link
                        className="hover:text-blue-500"
                        href={musician.socials.instagram}
                      >
                        Instagram
                      </Link>
                    )}
                    {musician.socials.spotify && (
                      <Link
                        className="hover:text-blue-500"
                        href={musician.socials.spotify}
                      >
                        Spotify
                      </Link>
                    )}
                    {musician.socials.soundcloud && (
                      <Link
                        className="hover:text-blue-500"
                        href={musician.socials.soundcloud}
                      >
                        SoundCloud
                      </Link>
                    )}
                    {musician.socials.youtube && (
                      <Link
                        className="hover:text-blue-500"
                        href={musician.socials.youtube}
                      >
                        YouTube
                      </Link>
                    )}
                  </div>
                </div>
                <img
                  src={musician.image.url}
                  alt={musician.name}
                  className="w-24 h-24 object-cover  rounded-lg"
                />
              </Link>
            ))}
          </div>
        )}

        {search && filteredMusicians.length === 0 && (
          <p className="mt-2 text-sm text-gray-600">
            No musicians found for this city.
          </p>
        )}
      </div>

      {/* Right Side - Map */}
      <div className="w-full relative z-0">
        <MapContainer
          center={[31.5497, 74.3436]} // Lahore
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation />

          {filteredMusicians.map((musician) => (
            <Marker key={musician._id} position={[musician.lat, musician.lng]}>
              <Popup>
                <Link href={`/musicians/${musician._id}`}>
                  <img
                    src={musician.image.url || "/images/logo.jpg"}
                    className="w-full"
                    alt={musician.name}
                  />
                  <div className="flex flex-col pt-4">
                    <h1 className="text-2xl text-zinc-800">{musician.name}</h1>
                    <p className="text-zinc-600 text-[14px]">
                      {musician.category} - {musician.city}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-zinc-600">
                    <h2>{musician.shortBio}</h2>

                    {musician.socials.instagram && (
                      <Link href={musician.socials.instagram}>Instagram</Link>
                    )}
                    {musician.socials.spotify && (
                      <Link href={musician.socials.spotify}>Spotify</Link>
                    )}
                    {musician.socials.soundcloud && (
                      <Link href={musician.socials.soundcloud}>SoundCloud</Link>
                    )}
                    {musician.socials.youtube && (
                      <Link href={musician.socials.youtube}>YouTube</Link>
                    )}
                  </div>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
