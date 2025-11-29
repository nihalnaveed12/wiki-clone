"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Musician } from "@/components/musician-com/deepDivesClient";

interface Video {
  title?: string;
  type?: string;
  embedUrl?: string;
  isFeatured?: boolean;
}

interface DefiningTrack {
  title?: string;
  year?: string;
  externalLink?: string;
  image?: File | null;
  existingImageUrl?: string;
}

interface MusicianFormData {
  name: string;
  city: string;
  state?: string;
  category: string;
  shortBio: string;
  deepDiveNarrative?: string;
  videoEmbed?: string;
  videoWidth?: string;
  videoHeight?: string;
  artistStatus?: string;
  website: string;
  district?: string;
  districtLink?: string;
  audio?: string;
  heroTags?: string;
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
  image?: FileList | null;
  heroBannerImage?: FileList | null;
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
    twitter: string;
    appleMusic: string;
  };
  born?: string;
  origin?: string;
  primaryAffiliationName?: string;
  primaryAffiliationLink?: string;
  notableCollaborators?: string;
  proteges?: string;
  relatedArtists?: string;
  alsoKnownAs?: string;
  videos: Video[];
  definingTracks: DefiningTrack[];
}

const statusOptions = ["Active", "Inactive", "Incarcerated", "Deceased"];

export default function EditMusicianPage() {
  const { userId } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState<MusicianFormData>({
    name: "",
    city: "",
    state: "",
    category: "",
    shortBio: "",
    deepDiveNarrative: "",
    videoEmbed: "",
    videoWidth: "",
    videoHeight: "",
    website: "",
    artistStatus: "",
    district: "",
    districtLink: "",
    audio: "",
    heroTags: "",
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
    image: null,
    heroBannerImage: null,
    socials: {
      instagram: "",
      youtube: "",
      spotify: "",
      soundcloud: "",
      twitter: "",
      appleMusic: "",
    },
    born: "",
    origin: "",
    primaryAffiliationName: "",
    primaryAffiliationLink: "",
    notableCollaborators: "",
    proteges: "",
    relatedArtists: "",
    alsoKnownAs: "",
    videos: [],
    definingTracks: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/rappers/${id}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch data");
        }

        const musician = result.data;

        // Basic check for authorization, could be improved
        // if (musician.submittedBy !== userId) {
        //   router.push(`/musician/${id}`);
        //   return;
        // }

        setFormData({
          name: musician.name || "",
          city: musician.city || "",
          state: musician.state || "",
          category: musician.category || "",
          shortBio: musician.shortBio || "",
          deepDiveNarrative: musician.deepDiveNarrative || "",
          videoEmbed: musician.videoEmbed || "",
          videoWidth: musician.videoWidth?.toString() || "",
          videoHeight: musician.videoHeight?.toString() || "",
          website: musician.website || "",
          artistStatus: musician.artistStatus || "",
          district: musician.district || "",
          districtLink: musician.districtLink || "",
          audio: musician.audio || "",
          heroTags: (musician.heroTags || []).join(", "),
          readMoreLink: musician.readMoreLink || "",
          yearsActiveStart: musician.yearsActiveStart?.toString() || "",
          yearsActiveEnd: musician.yearsActiveEnd?.toString() || "",
          status: musician.status || "active",
          labelCrew: musician.labelCrew || "",
          labelCrewLink: musician.labelCrewLink || "",
          associatedActs: (musician.associatedActs || []).join(", "),
          associatedActsLinks: (musician.associatedActsLinks || []).join(", "),
          frequentProducers: (musician.frequentProducers || []).join(", "),
          frequentProducersLink: (musician.frequentProducersLink || []).join(
            ", "
          ),
          breakoutTrackName: musician.breakoutTrack?.name || "",
          breakoutTrackUrl: musician.breakoutTrack?.url || "",
          definingProjectName: musician.definingProject?.name || "",
          definingProjectYear: musician.definingProject?.year?.toString() || "",
          definingProjectLink: musician.definingProject?.link || "",
          fansOf: (musician.fansOf || []).join(", "),
          fansOfLink: (musician.fansOfLink || []).join(", "),
          socials: {
            instagram: musician.socials?.instagram || "",
            youtube: musician.socials?.youtube || "",
            spotify: musician.socials?.spotify || "",
            soundcloud: musician.socials?.soundcloud || "",
            twitter: musician.socials?.twitter || "",
            appleMusic: musician.socials?.appleMusic || "",
          },
          born: musician.born || "",
          origin: musician.origin || "",
          primaryAffiliationName: musician.primaryAffiliation?.name || "",
          primaryAffiliationLink: musician.primaryAffiliation?.link || "",
          notableCollaborators: (musician.notableCollaborators || []).join(
            ", "
          ),
          proteges: (musician.proteges || []).join(", "),
          relatedArtists: (musician.relatedArtists || []).join(", "),
          alsoKnownAs: (musician.alsoKnownAs || []).join(", "),
          videos: musician.videos || [],
          definingTracks: (musician.definingTracks || []).map((t: any) => ({
            ...t,
            year: t.year?.toString(),
          })),
          image: null,
          heroBannerImage: null,
        });

        if (musician.image?.url) setImagePreview(musician.image.url);
        if (musician.heroBannerImage?.url)
          setBannerPreview(musician.heroBannerImage.url);
      } catch (error) {
        console.error("Failed to fetch musician data:", error);
        alert(
          "Failed to load musician data. You may not have permission to edit this profile."
        );
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    if (id && userId) {
      fetchData();
    }
  }, [id, userId, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === "image") {
        setImagePreview(previewUrl);
      } else if (name === "heroBannerImage") {
        setBannerPreview(previewUrl);
      }

      setFormData((prev) => ({ ...prev, [name]: files }));
    }
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socials: { ...prev.socials, [name]: value },
    }));
  };

  // --- Videos Handlers ---
  const addVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        { title: "", type: "Music Video", embedUrl: "", isFeatured: false },
      ],
    }));
  };

  const removeVideo = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const handleVideoChange = (
    index: number,
    field: keyof Video,
    value: string | boolean
  ) => {
    setFormData((prev) => {
      const newVideos = [...prev.videos];
      (newVideos[index] as any)[field] = value;
      return { ...prev, videos: newVideos };
    });
  };

  // --- Defining Tracks Handlers ---
  const addDefiningTrack = () => {
    setFormData((prev) => ({
      ...prev,
      definingTracks: [
        ...prev.definingTracks,
        { title: "", year: "", externalLink: "" },
      ],
    }));
  };

  const removeDefiningTrack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      definingTracks: prev.definingTracks.filter((_, i) => i !== index),
    }));
  };

  const handleDefiningTrackChange = (
    index: number,
    field: keyof DefiningTrack,
    value: string | File
  ) => {
    setFormData((prev) => {
      const newTracks = [...prev.definingTracks];
      (newTracks[index] as any)[field] = value;
      return { ...prev, definingTracks: newTracks };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submission = new FormData();

    // Helper to append if value is not null/undefined
    const appendField = (key: string, value: any) => {
      if (value !== null && value !== undefined) {
        submission.append(key, value);
      }
    };

    // Append all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key === "image" ||
        key === "heroBannerImage" ||
        key === "definingTracks"
      ) {
        // Handled separately below
        return;
      }

      if (key === "socials" || key === "videos") {
        appendField(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        submission.append(key, String(value));
      }
    });

    if (formData.image && formData.image.length > 0) {
      submission.append("image", formData.image[0]);
    }
    if (formData.heroBannerImage && formData.heroBannerImage.length > 0) {
      submission.append("heroBannerImage", formData.heroBannerImage[0]);
    }

    // Handle defining tracks with potential file uploads
    const definingTracksData = formData.definingTracks.map((track) => {
      const trackData: any = { ...track };
      delete trackData.image; // remove file object before stringifying
      return trackData;
    });

    submission.append("definingTracks", JSON.stringify(definingTracksData));

    formData.definingTracks.forEach((track, index) => {
      if (track.image instanceof File) {
        submission.append(`definingTrackImage_${index}`, track.image);
      }
    });

    try {
      const res = await fetch(`/api/rappers/${id}`, {
        method: "PUT",
        body: submission,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }

      alert("Profile updated successfully!");
      router.push(`/musician/${id}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during update."
      );
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
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Basic Information --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4 text-card-foreground">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Born</label>
              <input
                name="born"
                value={formData.born}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Origin</label>
              <input
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="artistStatus"
                value={formData.artistStatus}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-background"
              >
                <option value="">Select a Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">District</label>
              <input
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                District Link
              </label>
              <input
                name="districtLink"
                type="url"
                value={formData.districtLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* --- Media --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium text-card-foreground">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
            {/* Artist Image */}
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 rounded-full overflow-hidden bg-muted border flex items-center justify-center">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="artist"
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No Image</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Artist Image
                </label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
              </div>
            </div>
            {/* Hero Banner Image */}
            <div className="flex items-center gap-4">
              <div className="h-28 w-48 rounded overflow-hidden bg-muted border flex items-center justify-center">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                    alt="banner"
                    width={192}
                    height={112}
                    className="object-cover"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground">No Banner</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hero Banner Image
                </label>
                <input
                  name="heroBannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Bio & Narrative --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">Bio & Narrative</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Short Bio *
              </label>
              <textarea
                name="shortBio"
                value={formData.shortBio}
                onChange={handleChange}
                rows={4}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Deep Dive Narrative
              </label>
              <textarea
                name="deepDiveNarrative"
                value={formData.deepDiveNarrative}
                onChange={handleChange}
                rows={8}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Video Embed URL
              </label>
              <input
                name="videoEmbed"
                value={formData.videoEmbed}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Width
                </label>
                <input
                  name="videoWidth"
                  type="number"
                  value={formData.videoWidth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Height
                </label>
                <input
                  name="videoHeight"
                  type="number"
                  value={formData.videoHeight}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Career & Projects --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">Career & Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Years Active (Start) *
              </label>
              <input
                name="yearsActiveStart"
                type="number"
                value={formData.yearsActiveStart}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Years Active (End)
              </label>
              <input
                name="yearsActiveEnd"
                placeholder="Leave Empty If Still Active"
                value={formData.yearsActiveEnd}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Affiliation
              </label>
              <input
                name="primaryAffiliationName"
                value={formData.primaryAffiliationName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Primary Affiliation Link
              </label>
              <input
                name="primaryAffiliationLink"
                type="url"
                value={formData.primaryAffiliationLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Label/Crew
              </label>
              <input
                name="labelCrew"
                value={formData.labelCrew}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Label/Crew Link
              </label>
              <input
                name="labelCrewLink"
                type="url"
                value={formData.labelCrewLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Breakout Track Name
              </label>
              <input
                name="breakoutTrackName"
                value={formData.breakoutTrackName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Breakout Track URL
              </label>
              <input
                name="breakoutTrackUrl"
                type="url"
                value={formData.breakoutTrackUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Defining Project Name
              </label>
              <input
                name="definingProjectName"
                value={formData.definingProjectName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Defining Project Year
              </label>
              <input
                name="definingProjectYear"
                type="number"
                value={formData.definingProjectYear}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Defining Project Link
              </label>
              <input
                name="definingProjectLink"
                type="url"
                value={formData.definingProjectLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* --- Tags & Influences --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">Tags & Influences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags/Genres
              </label>
              <input
                name="heroTags"
                value={formData.heroTags}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Also Known As
              </label>
              <input
                name="alsoKnownAs"
                value={formData.alsoKnownAs}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Notable Collaborators
              </label>
              <input
                name="notableCollaborators"
                value={formData.notableCollaborators}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proteges</label>
              <input
                name="proteges"
                value={formData.proteges}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Related Artists
              </label>
              <input
                name="relatedArtists"
                value={formData.relatedArtists}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fans Of (Influences)
              </label>
              <input
                name="fansOf"
                value={formData.fansOf}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fans Of Links
              </label>
              <input
                name="fansOfLink"
                value={formData.fansOfLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated URLs"
              />
            </div>
          </div>
        </div>

        {/* --- Associated Acts & Producers --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">
            Associated Acts & Producers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Associated Acts
              </label>
              <input
                name="associatedActs"
                value={formData.associatedActs}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Associated Acts Links
              </label>
              <input
                name="associatedActsLinks"
                value={formData.associatedActsLinks}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated URLs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Frequent Producers
              </label>
              <input
                name="frequentProducers"
                value={formData.frequentProducers}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Frequent Producers Links
              </label>
              <input
                name="frequentProducersLink"
                value={formData.frequentProducersLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated URLs"
              />
            </div>
          </div>
        </div>

        {/* --- Audio & Links --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">Audio & Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Audio URL (YouTube or direct audio)
              </label>
              <input
                name="audio"
                value={formData.audio}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="YouTube link or https://example.com/song.mp3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Read More / Deep Dive Link
              </label>
              <input
                name="readMoreLink"
                type="url"
                value={formData.readMoreLink}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* --- DYNAMIC VIDEOS --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-3">Videos</h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={addVideo}
              className="inline-block px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Add Video
            </button>
            <div className="space-y-4 mt-3">
              {formData.videos.map((video, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <input
                    value={video.title}
                    onChange={(e) =>
                      handleVideoChange(idx, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="p-2 border rounded"
                  />
                  <select
                    value={video.type}
                    onChange={(e) =>
                      handleVideoChange(idx, "type", e.target.value)
                    }
                    className="p-2 border rounded bg-background"
                  >
                    <option>Music Video</option>
                    <option>Interview</option>
                    <option>Vlog Videos</option>
                    <option>Other Videos</option>
                  </select>
                  <input
                    value={video.embedUrl}
                    onChange={(e) =>
                      handleVideoChange(idx, "embedUrl", e.target.value)
                    }
                    placeholder="Embed URL"
                    className="p-2 border rounded"
                  />
                  <div className="flex items-center gap-3 mt-2 md:col-span-3">
                    <input
                      type="checkbox"
                      checked={video.isFeatured}
                      onChange={(e) =>
                        handleVideoChange(idx, "isFeatured", e.target.checked)
                      }
                    />
                    <span className="text-sm">Featured</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="ml-auto px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- DYNAMIC DEFINING TRACKS --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-3">Defining Tracks</h2>
          <button
            type="button"
            onClick={addDefiningTrack}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Add Track
          </button>
          <div className="space-y-4 mt-4">
            {formData.definingTracks.map((track, idx) => (
              <div key={idx} className="border rounded p-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={track.title}
                    onChange={(e) =>
                      handleDefiningTrackChange(idx, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="p-2 border rounded"
                  />
                  <input
                    value={track.year}
                    onChange={(e) =>
                      handleDefiningTrackChange(idx, "year", e.target.value)
                    }
                    placeholder="Year"
                    className="p-2 border rounded"
                  />
                  <input
                    value={track.externalLink}
                    onChange={(e) =>
                      handleDefiningTrackChange(
                        idx,
                        "externalLink",
                        e.target.value
                      )
                    }
                    placeholder="External link"
                    className="p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-4">
                  {track.existingImageUrl && !track.image && (
                    <Image
                      src={track.existingImageUrl}
                      alt="track image"
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <label className="text-sm">
                    Track Image{" "}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleDefiningTrackChange(
                          idx,
                          "image",
                          e.target.files ? e.target.files[0] : null!
                        )
                      }
                    />
                  </label>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => removeDefiningTrack(idx)}
                    className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Socials --- */}
        <div className="p-6 bg-card shadow-sm rounded-lg border border-border">
          <h2 className="text-xl font-medium mb-4">Social Links & Website</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Instagram
              </label>
              <input
                name="instagram"
                type="url"
                value={formData.socials.instagram}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube</label>
              <input
                name="youtube"
                type="url"
                value={formData.socials.youtube}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Spotify</label>
              <input
                name="spotify"
                type="url"
                value={formData.socials.spotify}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                SoundCloud
              </label>
              <input
                name="soundcloud"
                type="url"
                value={formData.socials.soundcloud}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Twitter/X
              </label>
              <input
                name="twitter"
                type="url"
                value={formData.socials.twitter}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apple Music
              </label>
              <input
                name="appleMusic"
                type="url"
                value={formData.socials.appleMusic}
                onChange={handleSocialChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
