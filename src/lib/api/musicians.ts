export async function fetchMusicians(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/rappers`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addMusician(data: FormData, baseUrl:string) {
  const res = await fetch(`${baseUrl}/api/rappers`, { method: "POST", body: data });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
