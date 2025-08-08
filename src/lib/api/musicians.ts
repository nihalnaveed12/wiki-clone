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
export async function fetchMusicians(baseUrl: string):Promise<Musician[]>  {
  const res = await fetch(`${baseUrl}/api/rappers`);
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json()
  return data.data
  
}

export async function addMusician(data: FormData, baseUrl:string) {
  const res = await fetch(`${baseUrl}/api/rappers`, { method: "POST", body: data });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
