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
export async function fetchMusicians(baseUrl: string):Promise<Musicians[]>  {
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
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export async function deleteMusicians(id: string) {
  const res = await fetch(`${baseUrl}/api/rappers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function getMusicianByIdAPI(id:string) {
  const res = await fetch(`${baseUrl}/api/rappers/${id}`)
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json()
  return data
}


