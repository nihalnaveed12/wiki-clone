"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchMusicians } from "@/lib/fetchmusicians";

delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});


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


function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 10);
    }
  }, [position, map]);

  return null;
}

export default function MapClient() {
  const [search, setSearch] = useState("");
  const [musicians, setMusicians] = useState<Musicians[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMusicians = async () => {
      const data = await fetchMusicians();
      setMusicians(data);
      setLoading(false);
    };

    getMusicians();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!musicians || musicians.length === 0) {
    return <p>No musicians found.</p>;
  }

  const filteredMusicians: Musicians[] = musicians.filter((m: Musicians) =>
    m.city.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="text-black flex h-screen">
      <div className="absolute top-20 left-20 z-10">
        <input
          type="text"
          placeholder="Enter city name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full rounded-full focus:outline-none bg-white z-10 shadow-lg"
        />
        {filteredMusicians.length === 0 && <p>No musicians found.</p>}

        {search && filteredMusicians.length > 0 && (
          <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-lg">
            {search &&
              filteredMusicians.map((musician, idx) => (
                <div key={idx} className="">
                  <strong>{musician.name}</strong>
                  <br />
                  {musician.city} - {musician.category}
                  <br />
                  <a href={musician.socials.instagram} target="_blank">
                    Instagram
                  </a>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Right Side: Map */}
      <div className="w-full relative z-0">
        <MapContainer
          center={[31.5497, 74.3436]} // Initial: Lahore
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredMusicians.length > 0 && (
            <FlyToLocation
              position={[filteredMusicians[0].lat, filteredMusicians[0].lng]}
            />
          )}

          {filteredMusicians.map((musician, index) => (
            <Marker key={index} position={[musician.lat, musician.lng]}>
              <Popup>
                <strong>{musician.name}</strong>
                <br />
                {musician.category}
                <br />
                <a href={musician.socials.instagram} target="_blank">
                  Instagram
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
