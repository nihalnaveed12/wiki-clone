// lib/fetchMusicians.ts
interface Musician {
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

export async function fetchMusicians(): Promise<Musician[]> {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/api/rappers`);
  const data = await response.json();
  return data.data;
}
