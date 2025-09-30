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
  country: string
  shortBio: string;
  website: string
  createdAt: string;
  address: string;
  audio:string;
  updatedAt: string;
  __v: number;
}
export async function fetchMusicians(): Promise<Musicians[]> {
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/api/rappers`);
  const data = await response.json();
  return data.data;
}
