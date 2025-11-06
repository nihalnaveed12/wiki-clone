"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface MusicianFormData {
  name: string;
  city: string;
  category: string;
  shortBio: string;
  artistStatus?: string;
  website: string;
  district?: string;
  districtLink?: string;
  audio?: string;
  tags?: string;
  readMoreLink?: string;
  yearsActiveStart: string;
  yearsActiveEnd?: string;
  status?: "active" | "inactive";
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string;
  associatedActsLinks?: string;
  frequentProducers?: string;
  frequentProducersLink?: string;
  breakoutTrackName: string;
  breakoutTrackUrl?: string;
  definingProjectName: string;
  definingProjectYear?: string;
  definingProjectLink?: string;
  fansOf?: string;
  fansOfLink?: string;
  videoEmbed?: string;
  videoWidth?: string;
  videoHeight?: string;
  image?: FileList | null;
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
    twitter: string;
  };
}

const allCities = [
  "Alameda",
  "Albany",
  "Berkeley",
  "Dublin",
  "Emeryville",
  "Fremont",
  "Hayward",
  "Livermore",
  "Newark",
  "Oakland",
  "Piedmont",
  "Pleasanton",
  "San Leandro",
  "Union City",
  "Antioch",
  "Brentwood",
  "Clayton",
  "Concord",
  "Danville",
  "El Cerrito",
  "Hercules",
  "Lafayette",
  "Martinez",
  "Moraga",
  "Oakley",
  "Orinda",
  "Pinole",
  "Pittsburg",
  "Pleasant Hill",
  "Richmond",
  "San Pablo",
  "San Ramon",
  "Walnut Creek",
  "Marin County",
  "Belvedere",
  "Corte Madera",
  "Fairfax",
  "Larkspur",
  "Mill Valley",
  "Novato",
  "Ross",
  "San Anselmo",
  "San Rafael",
  "Sausalito",
  "Tiburon",
  "Napa County",
  "American Canyon",
  "Calistoga",
  "Napa",
  "St. Helena",
  "Yountville",
  "San Francisco",
  "San Mateo County",
  "Atherton",
  "Belmont",
  "Brisbane",
  "Burlingame",
  "Colma",
  "Daly City",
  "East Palo Alto",
  "Foster City",
  "Half Moon Bay",
  "Hillsborough",
  "Menlo Park",
  "Millbrae",
  "Pacifica",
  "Portola Valley",
  "Redwood City",
  "San Bruno",
  "San Carlos",
  "San Mateo",
  "South San Francisco",
  "Woodside",
  "Campbell",
  "Cupertino",
  "Gilroy",
  "Los Altos",
  "Los Altos Hills",
  "Los Gatos",
  "Milpitas",
  "Monte Sereno",
  "Morgan Hill",
  "Mountain View",
  "Palo Alto",
  "San Jose",
  "Santa Clara",
  "Saratoga",
  "Sunnyvale",
  "Benicia",
  "Dixon",
  "Fairfield",
  "Rio Vista",
  "Suisun City",
  "Vacaville",
  "Vallejo",
  "Cloverdale",
  "Cotati",
  "Healdsburg",
  "Petaluma",
  "Rohnert Park",
  "Santa Rosa",
  "Sebastopol",
  "Sonoma",
  "Windsor",
];

const status = ["Active", "Inactive", "Incarcerated", "Deceased"];

function toYouTubeEmbed(url?: string | null) {
  if (!url) return "";
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");
    if (hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return `https://www.youtube.com/embed/${id}`;
    }
    if (hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      const pathParts = u.pathname.split("/");
      const maybeId = pathParts[pathParts.length - 1];
      if (maybeId) return `https://www.youtube.com/embed/${maybeId}`;
    }
    return url;
  } catch {
    return url || "";
  }
}

function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");
    return hostname.includes("youtube.com") || hostname.includes("youtu.be");
  } catch {
    return false;
  }
}

export default function EditMusicianPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { id } = useParams();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioType, setAudioType] = useState<"youtube" | "direct" | null>(null);
  const [formData, setFormData] = useState<MusicianFormData>({
    name: "",
    city: "",
    category: "",
    shortBio: "",
    website: "",
    artistStatus: "",
    district: "",
    districtLink: "",
    audio: "",
    tags: "",
    readMoreLink: "",
    yearsActiveStart: "",
    yearsActiveEnd: "",
    status: "active",
    labelCrew: "",
    labelCrewLink: "",
    associatedActs: "",
    associatedActsLinks: "",
    frequentProducers: "",
    frequentProducersLink: "",
    breakoutTrackName: "",
    breakoutTrackUrl: "",
    definingProjectName: "",
    definingProjectYear: "",
    definingProjectLink: "",
    fansOf: "",
    fansOfLink: "",
    videoEmbed: "",
    videoWidth: "560",
    videoHeight: "315",
    image: null,
    socials: {
      instagram: "",
      youtube: "",
      spotify: "",
      soundcloud: "",
      twitter: "",
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
          artistStatus: musician.artistStatus || "",
          district: musician.district || "",
          districtLink: musician.districtLink || "",
          audio: musician.audio || "",
          tags: Array.isArray(musician.tags)
            ? musician.tags.join(", ")
            : musician.tags || "",
          readMoreLink: musician.readMoreLink || "",
          yearsActiveStart: musician.yearsActive?.start?.toString() || "",
          yearsActiveEnd: musician.yearsActive?.end?.toString() || "",
          status: musician.status || "active",
          labelCrew: musician.labelCrew || "",
          labelCrewLink: musician.labelCrewLink || "",
          associatedActs: Array.isArray(musician.associatedActs)
            ? musician.associatedActs.join(", ")
            : musician.associatedActs || "",
          associatedActsLinks: musician.associatedActsLinks || "",
          frequentProducers: Array.isArray(musician.frequentProducers)
            ? musician.frequentProducers.join(", ")
            : musician.frequentProducers || "",
          frequentProducersLink: musician.frequentProducersLink || "",
          breakoutTrackName: musician.breakoutTrack?.name || "",
          breakoutTrackUrl: musician.breakoutTrack?.url || "",
          definingProjectName: musician.definingProject?.name || "",
          definingProjectYear: musician.definingProject?.year?.toString() || "",
          definingProjectLink: musician.definingProject?.link || "",
          fansOf: Array.isArray(musician.fansOf)
            ? musician.fansOf.join(", ")
            : musician.fansOf || "",
          fansOfLink: musician.fansOfLink || "",
          videoEmbed: musician.videoEmbed || "",
          videoWidth: musician.videoWidth?.toString() || "560",
          videoHeight: musician.videoHeight?.toString() || "315",
          image: null,
          socials: {
            instagram: musician.socials?.instagram || "",
            youtube: musician.socials?.youtube || "",
            spotify: musician.socials?.spotify || "",
            soundcloud: musician.socials?.soundcloud || "",
            twitter: musician.socials?.twitter || "",
          },
        });

        if (musician.imageUrl) {
          setImagePreview(musician.imageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch musician data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userId, router]);

  useEffect(() => {
    if (formData.audio) {
      if (isYouTubeUrl(formData.audio)) {
        setAudioType("youtube");
      } else {
        setAudioType("direct");
      }
    } else {
      setAudioType(null);
    }
  }, [formData.audio]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: files }));
    }
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
        artistStatus: formData.artistStatus,
        district: formData.district,
        districtLink: formData.districtLink,
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
        labelCrewLink: formData.labelCrewLink,
        associatedActs: formData.associatedActs
          ? formData.associatedActs.split(",").map((act) => act.trim())
          : [],
        associatedActsLinks: formData.associatedActsLinks,
        frequentProducers: formData.frequentProducers
          ? formData.frequentProducers.split(",").map((prod) => prod.trim())
          : [],
        frequentProducersLink: formData.frequentProducersLink,
        breakoutTrack: {
          name: formData.breakoutTrackName,
          url: formData.breakoutTrackUrl,
        },
        definingProject: {
          name: formData.definingProjectName,
          year: formData.definingProjectYear
            ? parseInt(formData.definingProjectYear, 10)
            : null,
          link: formData.definingProjectLink,
        },
        fansOf: formData.fansOf
          ? formData.fansOf.split(",").map((fan) => fan.trim())
          : [],
        fansOfLink: formData.fansOfLink,
        videoEmbed: formData.videoEmbed,
        videoWidth: formData.videoWidth
          ? parseInt(formData.videoWidth, 10)
          : 560,
        videoHeight: formData.videoHeight
          ? parseInt(formData.videoHeight, 10)
          : 315,
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
    <div className="max-w-4xl mx-auto p-8 my-10 bg-card rounded-xl shadow-lg border border-border">
      <h1 className="text-3xl font-bold mb-8 text-card-foreground border-b border-border pb-4">
        Edit Profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="Enter musician name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Hip Hop, R&B, Pop"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
                required
              >
                <option value="">Select a city</option>
                {allCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Status
              </label>
              <select
                name="artistStatus"
                value={formData.artistStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="">Select a Status</option>
                {status.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., The Crest Side"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                District Link
              </label>
              <input
                type="url"
                name="districtLink"
                value={formData.districtLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            Artist Image
          </label>
          <div className="mt-1 flex items-center gap-6">
            <span className="h-24 w-24 rounded-full overflow-hidden bg-muted border border-border">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  className="h-full w-full text-muted-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.993A2 2 0 002 18h20a2 2 0 002 2.007zM12 13a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              )}
            </span>
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-card py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-card-foreground hover:bg-accent transition-colors"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                className="sr-only"
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            Short Bio *
          </label>
          <textarea
            name="shortBio"
            value={formData.shortBio}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
            placeholder="Tell us about the musician (max 500 characters)"
            required
          />
        </div>

        {/* Career Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Career Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
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
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Years Active (End)
              </label>
              <input
                type="number"
                name="yearsActiveEnd"
                value={formData.yearsActiveEnd}
                onChange={handleChange}
                placeholder="Present"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list of URLs for their influences
              </p>
            </div>
          </div>
        </div>

        {/* Audio & Links Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Audio & Links
          </h2>
          <div className="space-y-6">
            {/* Audio URL - Now accepts YouTube or Direct Links */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Audio URL (YouTube or Direct MP3/WAV/OGG)
              </label>
              <input
                type="url"
                name="audio"
                value={formData.audio}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=... or https://example.com/song.mp3"
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-muted-foreground text-xs mt-1">
                {audioType === "youtube"
                  ? "✓ YouTube link detected - will be converted to audio for playback"
                  : audioType === "direct"
                  ? "✓ Direct audio link detected"
                  : "Paste a YouTube URL or direct audio file link (.mp3, .wav, .ogg)"}
              </p>

              {/* Audio Preview */}
              {formData.audio && audioType === "direct" && (
                <div className="mt-3">
                  <audio
                    controls
                    src={formData.audio}
                    className="w-full"
                    style={{ maxHeight: "40px" }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>

            {/* Read More Link */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Deep Dives
              </label>
              <input
                type="url"
                name="readMoreLink"
                value={formData.readMoreLink}
                onChange={handleChange}
                placeholder="https://example.com/bio"
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
            </div>
          </div>
        </div>

        {/* Video Embed Section */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            YouTube Video (optional) — paste watch or embed URL
          </label>
          <input
            type="url"
            name="videoEmbed"
            value={formData.videoEmbed}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
            placeholder="https://youtube.com/watch?v=VIDEO_ID or https://www.youtube.com/embed/VIDEO_ID"
          />

          {/* Live Preview */}
          {formData.videoEmbed && (
            <div className="mt-4">
              <div
                style={{
                  width: `${formData.videoWidth || "560"}px`,
                  height: `${formData.videoHeight || "315"}px`,
                  border: "1px solid rgba(148,163,184,0.35)",
                  borderRadius: 6,
                }}
              >
                <iframe
                  title="video preview"
                  src={toYouTubeEmbed(formData.videoEmbed)}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-card-foreground">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    name="videoWidth"
                    value={formData.videoWidth}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-border rounded mt-1 bg-background text-card-foreground"
                    placeholder="560"
                  />
                </div>

                <div>
                  <label className="text-sm text-card-foreground">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    name="videoHeight"
                    value={formData.videoHeight}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-border rounded mt-1 bg-background text-card-foreground"
                    placeholder="315"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Links & Website */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Social Links & Website (Optional)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.socials.instagram}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={formData.socials.youtube}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://youtube.com/channel/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Spotify
              </label>
              <input
                type="url"
                name="spotify"
                value={formData.socials.spotify}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                SoundCloud
              </label>
              <input
                type="url"
                name="soundcloud"
                value={formData.socials.soundcloud}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://soundcloud.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Twitter/X
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.socials.twitter}
                onChange={handleSocialChange}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
