export async function addMusicianReq(data: FormData) {
    const res = await fetch(`/api/rappers/request`, { method: "POST", body: data });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// New functions for admin operations
export async function getAllMusicianRequestsAPI() {
    const res = await fetch(`/api/rappers/requests`, { method: "GET" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function approveMusicianRequestAPI(_id: string) {
    const res = await fetch(`/api/rappers/requests/${_id}/approve`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function rejectMusicianRequestAPI(_id: string, rejectionReason?: string) {
    const res = await fetch(`/api/rappers/requests/${_id}/reject`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}