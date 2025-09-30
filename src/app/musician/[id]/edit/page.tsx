"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface MusicianFormData {
  name: string;
  city: string;
  category: string;
  country: string;
  shortBio: string;
  website: string;
  address: string;
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
}

export default function EditMusicianPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState<MusicianFormData>({
    name: "",
    city: "",
    category: "",
    country: "",
    shortBio: "",
    website: "",
    address: "",
    socials: {
      instagram: "",
      youtube: "",
      spotify: "",
      soundcloud: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/rappers/${id}`);
        const data = await res.json();

        if (!res.ok || data.data.submittedBy !== userId) {
          router.push(`/musician/${id}`);
          return;
        }

        setFormData({
          name: data.data.name,
          city: data.data.city,
          category: data.data.category,
          country: data.data.country,
          shortBio: data.data.shortBio,
          website: data.data.website,
          address: data.data.address,
          socials: data.data.socials,
        });
      } catch (error) {
        console.error("Failed to fetch musician data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/rappers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());
      router.push(`/musician/${id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
    }
  };

  if (loading) return <div className="text-center py-8 text-card-foreground">Loading...</div>;

return (
  <div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold mb-6 text-card-foreground">Edit Profile</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-card-foreground mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-card-foreground mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
          />
        </div>
        <div>
          <label className="block text-card-foreground mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
          />
        </div>
        <div>
          <label className="block text-card-foreground mb-1">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-card-foreground mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
        />
      </div>

      <div>
        <label className="block text-card-foreground mb-1">Bio</label>
        <textarea
          name="shortBio"
          value={formData.shortBio}
          onChange={handleChange}
          className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-card-foreground mb-1">Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2 text-card-foreground">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-card-foreground mb-1">Instagram</label>
            <input
              type="url"
              name="instagram"
              value={formData.socials.instagram}
              onChange={handleSocialChange}
              className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-card-foreground mb-1">YouTube</label>
            <input
              type="url"
              name="youtube"
              value={formData.socials.youtube}
              onChange={handleSocialChange}
              className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-card-foreground mb-1">Spotify</label>
            <input
              type="url"
              name="spotify"
              value={formData.socials.spotify}
              onChange={handleSocialChange}
              className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            />
          </div>
          <div>
            <label className="block text-card-foreground mb-1">SoundCloud</label>
            <input
              type="url"
              name="soundcloud"
              value={formData.socials.soundcloud}
              onChange={handleSocialChange}
              className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors mt-6"
      >
        Save Changes
      </button>
    </form>
  </div>
);
}
