'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any).getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const musicians = [
  {
    name: "Ali Khan",
    city: "Los Angeles",
    lat: 34.0522,
    lng: -118.2437,
    category: "Guitarist",
    socials: {
      instagram: "https://instagram.com/alikhan"
    }
  },
  {
    name: "Sara",
    city: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    category: "Singer",
    socials: {
      instagram: "https://instagram.com/saramalik"
    }
  },
  {
    name: "Naveed",
    city: "Lahore",
    lat: 31.5497,
    lng: 74.3436,
    category: "Singer",
    socials: {
      instagram: "https://instagram.com/naveed"
    }
  },
  {
    name: "Ayaan",
    city: "Lahore",
    lat: 31.5497,
    lng: 74.3436,
    category: "Singer",
    socials: {
      instagram: "https://instagram.com/ayaan"
    }
  },
  {
    name: "Nara",
    city: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    category: "Singer",
    socials: {
      instagram: "https://instagram.com/nara"
    }
  },
  {
    name: "John Doe",
    city: "New York",
    lat: 40.7128,
    lng: -74.0060,
    category: "Violinist",
    socials: {
      instagram: "https://instagram.com/johndoe"
    }
  },
  {
    name: "Zara Khan",
    city: "San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    category: "Drummer",
    socials: {
      instagram: "https://instagram.com/zarakhan"
    }
  },
  {
    name: "Alex",
    city: "Toronto",
    lat: 43.65107,
    lng: -79.347015,
    category: "Pianist",
    socials: {
      instagram: "https://instagram.com/alex"
    }
  }
];


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

  const filteredMusicians = musicians.filter((m) => 
    m.city.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className='text-black flex h-screen'>
      
      <div className='absolute top-20 left-20 z-10'>
      
        <input
          type="text"
          placeholder="Enter city name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
         
          className='px-4 py-2 w-full rounded-full focus:outline-none bg-white z-10 shadow-lg'
        />
        {filteredMusicians.length === 0 && <p>No musicians found.</p>}
       
       {search && filteredMusicians.length > 0 && (

        <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-lg">

        {search && filteredMusicians.map((musician, idx) => (
          <div key={idx} className=''>
            <strong>{musician.name}</strong><br />
            {musician.city} - {musician.category}<br />
            <a href={musician.socials.instagram} target="_blank">Instagram</a>
          </div>
        ))}
        </div>
       )}
      </div>

      {/* Right Side: Map */}
      <div className='w-full relative z-0'>
        <MapContainer
          center={[31.5497, 74.3436]} // Initial: Lahore
          zoom={5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredMusicians.length > 0 && (
            <FlyToLocation position={[filteredMusicians[0].lat, filteredMusicians[0].lng]} />
          )}

          {filteredMusicians.map((musician, index) => (
            <Marker key={index} position={[musician.lat, musician.lng]}>
              <Popup>
                <strong>{musician.name}</strong><br />
                {musician.category}<br />
                <a href={musician.socials.instagram} target="_blank">Instagram</a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}