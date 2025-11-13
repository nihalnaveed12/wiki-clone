
 
 export interface Musicians {
  _id: string;
  name: string;
  city: string;
  state?: string
  category: string;
  shortBio: string;
  website: string;
  artistStatus?: string;
  image: {
    id: string;
    url: string;
  };
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
  createdAt: string;
  submittedBy?: string;
  audio?: string;
  tags?: string;
  readMoreLink?: string;
  yearsActive?: {
    end?: string;
    start?: string;
  };
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string;
  associatedActsLinks?: string;
  district?: string;
  districtLink?: string;
  frequentProducers?: string;
  frequentProducersLink?: string;
  breakoutTrack?: {
    name?: string;
    url?: string;
  };
  definingProject?: {
    name?: string;
    year?: string;
    link?: string;
  };
  fansOf?: string;
  fansOfLink?: string;
  videoEmbed?: string;
  videoWidth?: number;
  videoHeight?: number;
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


