// components/MusicianDeleteButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MusicianDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    
    if (!confirm("Are you sure you want to delete your profile?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/rappers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        alert(`${error.error} warninig` || "Failed to delete profile");
        return;
      }

      alert("Profile deleted successfully");
      router.push("/"); // redirect to home after delete
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
   <button
  onClick={handleDelete}
  disabled={loading}
  className="px-4 py-1 rounded-[6px] text-white cursor-pointer bg-destructive hover:bg-destructive/90 disabled:opacity-50 transition-colors"
>
  {loading ? "Deleting..." : "Delete"}
</button>
  );
}
