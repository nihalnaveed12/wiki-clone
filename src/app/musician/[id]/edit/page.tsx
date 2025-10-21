"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface MusicianFormData {
  name: string;
  city: string;
  category: string;
  
  shortBio: string;
  website: string;
  
  district?: string;
  audio?: string;
  tags?: string;
  readMoreLink?: string;
  yearsActiveStart: string;
  yearsActiveEnd?: string;
  status?: "active" | "inactive";
  labelCrew?: string;
  associatedActs?: string;
  frequentProducers?: string;
  breakoutTrackName: string;
  breakoutTrackUrl?: string;
  definingProjectName: string;
  definingProjectYear?: string;
  fansOf?: string;
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
    
    shortBio: "",
    website: "",
    
    district: "",
    audio: "",
    tags: "",
    readMoreLink: "",
    yearsActiveStart: "",
    yearsActiveEnd: "",
    status: "active",
    labelCrew: "",
    associatedActs: "",
    frequentProducers: "",
    breakoutTrackName: "",
    breakoutTrackUrl: "",
    definingProjectName: "",
    definingProjectYear: "",
    fansOf: "",
    socials: {
      instagram: "",
      youtube: "",
      spotify: "",
      soundcloud: "",
      
    },
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rappers/${id}`);
        const data = await res.json();

        if (!res.ok || data.data.submittedBy !== userId) {
          router.push(`/musician/${id}`);
          return;
        }

        const musician = data.data;
        setFormData({
          name: musician.name || "",
          city: musician.city || "",
          category: musician.category || "",
         
          shortBio: musician.shortBio || "",
          website: musician.website || "",
        
          district: musician.district || "",
          audio: musician.audio || "",
          tags: Array.isArray(musician.tags)
            ? musician.tags.join(", ")
            : musician.tags || "",
          readMoreLink: musician.readMoreLink || "",
          yearsActiveStart: musician.yearsActive?.start?.toString() || "",
          yearsActiveEnd: musician.yearsActive?.end?.toString() || "",
          status: musician.status || "active",
          labelCrew: musician.labelCrew || "",
          associatedActs: Array.isArray(musician.associatedActs)
            ? musician.associatedActs.join(", ")
            : musician.associatedActs || "",
          frequentProducers: Array.isArray(musician.frequentProducers)
            ? musician.frequentProducers.join(", ")
            : musician.frequentProducers || "",
          breakoutTrackName: musician.breakoutTrack?.name || "",
          breakoutTrackUrl: musician.breakoutTrack?.url || "",
          definingProjectName: musician.definingProject?.name || "",
          definingProjectYear: musician.definingProject?.year?.toString() || "",
          fansOf: Array.isArray(musician.fansOf)
            ? musician.fansOf.join(", ")
            : musician.fansOf || "",
          socials: {
            instagram: musician.socials?.instagram || "",
            youtube: musician.socials?.youtube || "",
            spotify: musician.socials?.spotify || "",
            soundcloud: musician.socials?.soundcloud || "",
           
          },
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    setIsSubmitting(true);
    try {
      const submitData = {
        name: formData.name,
        city: formData.city,
        category: formData.category,
        shortBio: formData.shortBio,
        website: formData.website,
        district: formData.district,
        audio: formData.audio,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        readMoreLink: formData.readMoreLink,
        yearsActive: {
          start: parseInt(formData.yearsActiveStart, 10),
          end: formData.yearsActiveEnd
            ? parseInt(formData.yearsActiveEnd, 10)
            : null,
        },
        status: formData.status,
        labelCrew: formData.labelCrew,
        associatedActs: formData.associatedActs
          ? formData.associatedActs.split(",").map((act) => act.trim())
          : [],
        frequentProducers: formData.frequentProducers
          ? formData.frequentProducers.split(",").map((prod) => prod.trim())
          : [],
        breakoutTrack: {
          name: formData.breakoutTrackName,
          url: formData.breakoutTrackUrl,
        },
        definingProject: {
          name: formData.definingProjectName,
          year: formData.definingProjectYear
            ? parseInt(formData.definingProjectYear, 10)
            : null,
        },
        fansOf: formData.fansOf
          ? formData.fansOf.split(",").map((fan) => fan.trim())
          : [],
        socials: formData.socials,
      };

      const res = await fetch(`/api/rappers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }

      alert("Profile updated successfully!");
      router.push(`/musician/${id}`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-card-foreground">Loading...</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mb-10">
      <h1 className="text-3xl font-bold mb-8 text-card-foreground border-b border-border pb-4">
        Edit Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Name *
              </label>
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
              <label className="block text-card-foreground mb-1 font-medium">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g., The Crest Side"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        

        {/* Bio */}
        <div>
          <label className="block text-card-foreground mb-1 font-medium">
            Short Bio
          </label>
          <textarea
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
            rows={4}
          />
        </div>

        {/* Career Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Career Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Years Active (Start) *
              </label>
              <input
                type="number"
                name="yearsActiveStart"
                value={formData.yearsActiveStart}
                onChange={handleChange}
                placeholder="2021"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Years Active (End)
              </label>
              <input
                type="number"
                name="yearsActiveEnd"
                value={formData.yearsActiveEnd}
                onChange={handleChange}
                placeholder="Leave empty if still active"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Label/Crew
              </label>
              <input
                type="text"
                name="labelCrew"
                value={formData.labelCrew}
                onChange={handleChange}
                placeholder="e.g., Independent / King Cutz"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Breakout Track Name *
              </label>
              <input
                type="text"
                name="breakoutTrackName"
                value={formData.breakoutTrackName}
                onChange={handleChange}
                placeholder="e.g., First Day Out"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Breakout Track URL
              </label>
              <input
                type="url"
                name="breakoutTrackUrl"
                value={formData.breakoutTrackUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Defining Project Name *
              </label>
              <input
                type="text"
                name="definingProjectName"
                value={formData.definingProjectName}
                onChange={handleChange}
                placeholder="e.g., Crest Story Deluxe"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Defining Project Year
              </label>
              <input
                type="number"
                name="definingProjectYear"
                value={formData.definingProjectYear}
                onChange={handleChange}
                placeholder="2022"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Music & Influences */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Music & Influences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Tags/Genres
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., Hip-Hop, Trap, West Coast"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list
              </p>
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Associated Acts
              </label>
              <input
                type="text"
                name="associatedActs"
                value={formData.associatedActs}
                onChange={handleChange}
                placeholder="e.g., Artist One, Artist Two"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list
              </p>
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Frequent Producers
              </label>
              <input
                type="text"
                name="frequentProducers"
                value={formData.frequentProducers}
                onChange={handleChange}
                placeholder="e.g., L-Phaze, Producer Name"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list
              </p>
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Fans Of (Influences)
              </label>
              <input
                type="text"
                name="fansOf"
                value={formData.fansOf}
                onChange={handleChange}
                placeholder="e.g., Tupac, Nas, Jay-Z"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Audio & Links
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Audio URL
              </label>
              <input
                type="url"
                name="audio"
                value={formData.audio}
                onChange={handleChange}
                placeholder="https://example.com/song.mp3"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Read More Link
              </label>
              <input
                type="url"
                name="readMoreLink"
                value={formData.readMoreLink}
                onChange={handleChange}
                placeholder="https://example.com/bio"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Social Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.socials.instagram}
                onChange={handleSocialChange}
                placeholder="https://instagram.com/username"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={formData.socials.youtube}
                onChange={handleSocialChange}
                placeholder="https://youtube.com/channel/..."
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                Spotify
              </label>
              <input
                type="url"
                name="spotify"
                value={formData.socials.spotify}
                onChange={handleSocialChange}
                placeholder="https://open.spotify.com/artist/..."
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-card-foreground mb-1 font-medium">
                SoundCloud
              </label>
              <input
                type="url"
                name="soundcloud"
                value={formData.socials.soundcloud}
                onChange={handleSocialChange}
                placeholder="https://soundcloud.com/username"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
        
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors mt-6 font-medium disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}