// @components/form.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ---------------------------
   Validation schema
   - audio accepts YouTube OR audio file URL
----------------------------*/
const videoSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  embedUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
});

const definingTrackSchema = z.object({
  title: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  externalLink: z.string().optional().or(z.literal("")),
  image: z.any().optional(),
});

const schema = z.object({
  // basic
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional().or(z.literal("")),
  artistStatus: z.string().optional().or(z.literal("")),
  district: z.string().optional().or(z.literal("")),
  districtLink: z.string().optional().or(z.literal("")),
  born: z.string().optional().or(z.literal("")),
  origin: z.string().optional().or(z.literal("")),

  // images
  image: z.any().optional(),
  heroBannerImage: z.any().optional(),

  // bios & narrative
  shortBio: z
    .string()
    .min(1, "Short bio is required")
    .max(500, "Max 500 characters"),
  deepDiveNarrative: z.string().optional().or(z.literal("")),
  videoEmbed: z.string().optional().or(z.literal("")),
  videoWidth: z.string().optional().or(z.literal("")),
  videoHeight: z.string().optional().or(z.literal("")),

  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  // socials
  instagram: z.string().optional().or(z.literal("")),
  youtube: z.string().optional().or(z.literal("")),
  spotify: z.string().optional().or(z.literal("")),
  soundcloud: z.string().optional().or(z.literal("")),
  twitter: z.string().optional().or(z.literal("")),
  appleMusic: z.string().optional().or(z.literal("")),

  // arrays stored via comma-inputs (we'll parse on submit)
  heroTags: z.string().optional().or(z.literal("")),
  notableCollaborators: z.string().optional().or(z.literal("")),
  proteges: z.string().optional().or(z.literal("")),
  relatedArtists: z.string().optional().or(z.literal("")),
  alsoKnownAs: z.string().optional().or(z.literal("")),
  fansOf: z.string().optional().or(z.literal("")),
  fansOfLink: z.string().optional().or(z.literal("")),
  associatedActs: z.string().optional().or(z.literal("")),
  associatedActsLinks: z.string().optional().or(z.literal("")),
  frequentProducers: z.string().optional().or(z.literal("")),
  frequentProducersLink: z.string().optional().or(z.literal("")),

  // primary affiliation (flat inputs)
  primaryAffiliationName: z.string().optional().or(z.literal("")),
  primaryAffiliationLink: z.string().optional().or(z.literal("")),

  // years active
  yearsActiveStart: z
    .string()
    .regex(/^\d{4}$/, "Must be a valid year")
    .optional()
    .or(z.literal("")),
  yearsActiveEnd: z
    .string()
    .regex(/^\d{4}$/, "Must be a valid year")
    .optional()
    .or(z.literal("")),

  // breakout track
  breakoutTrackName: z.string().optional().or(z.literal("")),
  breakoutTrackUrl: z.string().optional().or(z.literal("")),

  // defining project
  definingProjectName: z.string().optional().or(z.literal("")),
  definingProjectYear: z.string().optional().or(z.literal("")),
  definingProjectLink: z.string().optional().or(z.literal("")),

  // audio — accept YouTube or direct audio URL
  audio: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val || val === "") return true;
        try {
          const u = new URL(val);
          const host = u.hostname.replace("www.", "");
          const isYT =
            host.includes("youtube.com") || host.includes("youtu.be");
          const isAudioExt = /\.(mp3|wav|ogg|m4a)$/i.test(val);
          return isYT || isAudioExt;
        } catch {
          return false;
        }
      },
      {
        message: "Must be a YouTube URL or an audio file URL (mp3/wav/ogg/m4a)",
      }
    ),

  // dynamic arrays
  videos: z.array(videoSchema).optional(),
  definingTracks: z.array(definingTrackSchema).optional(),
  readMoreLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  labelCrew: z.string().optional().or(z.literal("")),
  labelCrewLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type FormData = z.infer<typeof schema>;

interface Props {
  submitForm: (data: any) => void | Promise<void>;
}

/* ---------------------------
   URL helpers (keep your old logic)
----------------------------*/
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

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");
    if (hostname.includes("youtu.be")) {
      return u.pathname.slice(1).split("?")[0];
    }
    if (hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const pathParts = u.pathname.split("/");
      if (pathParts.includes("embed") || pathParts.includes("v")) {
        return pathParts[pathParts.length - 1];
      }
    }
    return null;
  } catch {
    return null;
  }
}

function isYouTubeUrl(url?: string | null) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const hostname = u.hostname.replace("www.", "");
    return hostname.includes("youtube.com") || hostname.includes("youtu.be");
  } catch {
    return false;
  }
}

/* ---------------------------
   Component
----------------------------*/
export default function MusicianForm({ submitForm }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [audioType, setAudioType] = useState<"youtube" | "direct" | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      videos: [],
      definingTracks: [],
    } as Partial<FormData>,
  });

  // dynamic arrays
  const videosField = useFieldArray({ control, name: "videos" as any });
  const tracksField = useFieldArray({ control, name: "definingTracks" as any });

  // watchers
  const imageWatch = watch("image" as any);
  const bannerWatch = watch("heroBannerImage" as any);
  const audioWatch = watch("audio");

  // image preview
  useEffect(() => {
    if (imageWatch && (imageWatch as FileList).length > 0) {
      const file = (imageWatch as FileList)[0];
      setImagePreview(URL.createObjectURL(file));
    } else setImagePreview(null);
  }, [imageWatch]);

  // banner preview
  useEffect(() => {
    if (bannerWatch && (bannerWatch as FileList).length > 0) {
      const file = (bannerWatch as FileList)[0];
      setBannerPreview(URL.createObjectURL(file));
    } else setBannerPreview(null);
  }, [bannerWatch]);

  // audio detection
  useEffect(() => {
    if (!audioWatch) {
      setAudioType(null);
      return;
    }
    try {
      const u = new URL(audioWatch);
      const host = u.hostname.replace("www.", "");
      if (host.includes("youtube") || host.includes("youtu.be")) {
        setAudioType("youtube");
      } else if (/\.(mp3|wav|ogg|m4a)$/i.test(audioWatch)) {
        setAudioType("direct");
      } else {
        // unknown but leave as direct for preview attempt
        setAudioType("direct");
      }
    } catch {
      setAudioType(null);
    }
  }, [audioWatch]);

  // resizable youtube preview

  const prepareCommaArray = (val?: string) =>
    (val || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Construct final object mapping to your Musician model
      const prepared = {
        name: data.name,
        city: data.city,
        state: data.state || undefined,

        category: data.category,
        artistStatus: data.artistStatus || undefined,
        website: data.website || undefined,
        socials: {
          instagram: data.instagram || undefined,
          youtube: data.youtube || undefined,
          spotify: data.spotify || undefined,
          soundcloud: data.soundcloud || undefined,
          twitter: data.twitter || undefined,
          appleMusic: data.appleMusic || undefined,
        },
        heroBannerImage: data.heroBannerImage
          ? data.heroBannerImage[0]
          : undefined,
        heroTags: prepareCommaArray(data.heroTags),
        image: data.image ? data.image[0] : undefined,
        shortBio: data.shortBio,
        audio: data.audio || undefined,
        videos: (data.videos || []).map((video) => ({
          ...video,
          embedUrl: toYouTubeEmbed(video.embedUrl),
        })),
        definingTracks: (data.definingTracks || []).map((t: any) => ({
          title: t.title || "",
          year: t.year ? Number(t.year) : undefined,
          externalLink: t.externalLink || "",
          image: t.image ? t.image[0] : undefined,
        })),
        deepDiveNarrative: data.deepDiveNarrative || undefined,
        videoEmbed: data.videoEmbed || undefined,
        videoWidth: data.videoWidth ? Number(data.videoWidth) : undefined,
        videoHeight: data.videoHeight ? Number(data.videoHeight) : undefined,
        alsoKnownAs: prepareCommaArray(data.alsoKnownAs),
        born: data.born || undefined,
        origin: data.origin || undefined,
        primaryAffiliation: {
          name: data.primaryAffiliationName || undefined,
          link: data.primaryAffiliationLink || undefined,
        },
        notableCollaborators: prepareCommaArray(data.notableCollaborators),
        proteges: prepareCommaArray(data.proteges),
        relatedArtists: prepareCommaArray(data.relatedArtists),
        readMoreLink: data.readMoreLink || undefined,
        yearsActiveStart: data.yearsActiveStart,
        yearsActiveEnd: data.yearsActiveEnd,
        labelCrew: data.labelCrew || undefined,
        labelCrewLink: data.labelCrewLink || undefined,
        associatedActs: prepareCommaArray(data.associatedActs),
        associatedActsLinks: prepareCommaArray(data.associatedActsLinks),
        district: data.district || undefined,
        districtLink: data.districtLink || undefined,
        frequentProducers: prepareCommaArray(data.frequentProducers),
        frequentProducersLink: prepareCommaArray(data.frequentProducersLink),
        breakoutTrack: {
          name: data.breakoutTrackName || undefined,
          url: data.breakoutTrackUrl || undefined,
        },
        status: undefined,
        definingProject: {
          name: data.definingProjectName || undefined,
          year: data.definingProjectYear
            ? Number(data.definingProjectYear)
            : undefined,
          link: data.definingProjectLink || undefined,
        },
        fansOf: prepareCommaArray(data.fansOf),
        fansOfLink: prepareCommaArray(data.fansOfLink),
      };

      await submitForm(prepared);
      reset();
      setImagePreview(null);
      setBannerPreview(null);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------
     UI — modern card layout
  ----------------------------*/
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-card-foreground">
        Musician Registration
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card: Basic */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-4 text-card-foreground">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Name *
              </label>
              <input
                {...register("name")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Artist name"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Category *
              </label>
              <input
                {...register("category")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., Hip Hop"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.category?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                City *
              </label>
              <input
                {...register("city")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="City"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.city?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                State
              </label>
              <input
                {...register("state")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Born
              </label>
              <input
                {...register("born")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., January 1, 1990"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Origin
              </label>
              <input
                {...register("origin")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., Bronx, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Status
              </label>
              <select
                {...register("artistStatus")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              >
                <option value="">Select</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Incarcerated">Incarcerated</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                District
              </label>
              <input
                {...register("district")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                District Link
              </label>
              <input
                {...register("districtLink")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="https://..."
              />
              <p className="text-destructive text-xs mt-1">
                {errors.districtLink?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Card: Media */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border space-y-4">
          <h2 className="text-xl font-medium text-card-foreground">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex items-center gap-4">
              <div className="h-28 w-28 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center">
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
                <label className="block text-sm font-medium mb-1 text-card-foreground">
                  Artist Image
                </label>
                <label className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded cursor-pointer hover:bg-primary/90 transition-colors">
                  Upload
                  <input
                    {...register("image")}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Square or portrait image recommended
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-28 w-48 rounded overflow-hidden bg-muted border border-border flex items-center justify-center">
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
                <label className="block text-sm font-medium mb-1 text-card-foreground">
                  Hero Banner Image
                </label>
                <label className="inline-block bg-primary text-primary-foreground px-3 py-2 rounded cursor-pointer hover:bg-primary/90 transition-colors">
                  Upload
                  <input
                    {...register("heroBannerImage" as any)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Wide banner recommended
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card: Bio */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Bio & Narrative
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Short Bio *
              </label>
              <textarea
                {...register("shortBio")}
                rows={4}
                className="w-full p-3 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Short bio (max 500 chars)"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.shortBio?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Deep Dive Narrative
              </label>
              <textarea
                {...register("deepDiveNarrative")}
                rows={5}
                className="w-full p-3 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Longer bio / deep dive"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Video Embed URL
              </label>
              <input
                {...register("videoEmbed")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="YouTube or Vimeo embed URL"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">
                  Video Width
                </label>
                <input
                  {...register("videoWidth")}
                  type="number"
                  className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                  placeholder="16"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">
                  Video Height
                </label>
                <input
                  {...register("videoHeight")}
                  type="number"
                  className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                  placeholder="9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Tags & Arrays (comma inputs) */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Tags & Influences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Tags / Genres
              </label>
              <input
                {...register("heroTags")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., Hip-Hop, Trap"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Also Known As
              </label>
              <input
                {...register("alsoKnownAs")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., Stage Name, Nickname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Notable Collaborators
              </label>
              <input
                {...register("notableCollaborators")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Comma separated"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Proteges
              </label>
              <input
                {...register("proteges")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Related Artists
              </label>
              <input
                {...register("relatedArtists")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Fans Of (Influences)
              </label>
              <input
                {...register("fansOf")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="e.g., Tupac, Nas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Fans Of Links
              </label>
              <input
                {...register("fansOfLink")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Comma-separated URLs"
              />
            </div>
          </div>
        </div>

        {/* Card: Career */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Career & Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Years Active (Start) *
              </label>
              <input
                {...register("yearsActiveStart")}
                type="number"
                placeholder="2021"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.yearsActiveStart?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Years Active (End)
              </label>
              <input
                {...register("yearsActiveEnd")}
                type="number"
                placeholder="Present"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Leave empty if still active
              </p>
              <p className="text-destructive text-xs mt-1">
                {errors.yearsActiveEnd?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Primary Affiliation
              </label>
              <input
                {...register("primaryAffiliationName")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Affiliation name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Primary Affiliation Link
              </label>
              <input
                {...register("primaryAffiliationLink")}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Label / Crew
              </label>
              <input
                {...register("labelCrew" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Label or crew name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Label / Crew Link
              </label>
              <input
                {...register("labelCrewLink" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Defining Project Name
              </label>
              <input
                {...register("definingProjectName" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Defining Project Year
              </label>
              <input
                {...register("definingProjectYear" as any)}
                type="number"
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Defining Project Link
              </label>
              <input
                {...register("definingProjectLink" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Breakout Track Name
              </label>
              <input
                {...register("breakoutTrackName" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Breakout Track URL
              </label>
              <input
                {...register("breakoutTrackUrl" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card: Associated / Producers */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Associated Acts & Producers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Associated Acts
              </label>
              <input
                {...register("associatedActs" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Comma separated names"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Associated Acts Links
              </label>
              <input
                {...register("associatedActsLinks" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Comma separated URLs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Frequent Producers
              </label>
              <input
                {...register("frequentProducers" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Frequent Producers Links
              </label>
              <input
                {...register("frequentProducersLink" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="Comma separated URLs"
              />
            </div>
          </div>
        </div>

        {/* Card: Audio & Links */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Audio & Links
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Audio URL (YouTube or direct audio)
              </label>
              <input
                {...register("audio" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="YouTube link or https://example.com/song.mp3"
              />
              {errors.audio && (
                <p className="text-destructive text-xs mt-1">
                  {(errors.audio as any).message}
                </p>
              )}

              {/* Audio preview */}
              {audioWatch && isYouTubeUrl(audioWatch) && (
                <div className="mt-3 p-3 bg-muted border border-border rounded">
                  <p className="text-sm font-medium mb-2 text-card-foreground">
                    YouTube Audio Preview
                  </p>
                  <iframe
                    src={toYouTubeEmbed(audioWatch)}
                    width="100%"
                    height={160}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="rounded"
                  />
                </div>
              )}

              {audioWatch &&
                !isYouTubeUrl(audioWatch) &&
                /\.(mp3|wav|ogg|m4a)$/i.test(audioWatch) && (
                  <div className="mt-3">
                    <audio controls src={audioWatch} className="w-full" />
                  </div>
                )}

              <p className="text-xs text-muted-foreground mt-2">
                Accepted: YouTube links or direct audio file URLs (.mp3, .wav,
                .ogg, .m4a)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-card-foreground">
                Read More / Deep Dive Link
              </label>
              <input
                {...register("readMoreLink" as any)}
                className="w-full p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Card: Dynamic Videos */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Videos
          </h2>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                videosField.append({
                  title: "",
                  type: "",
                  embedUrl: "",
                  isFeatured: false,
                })
              }
              className="inline-block px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Add Video
            </button>

            <div className="space-y-4 mt-3">
              {videosField.fields.map((f, idx) => (
                <div key={f.id} className="border border-border rounded p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      {...register(`videos.${idx}.title` as const)}
                      placeholder="Title"
                      className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                    />
                    <label htmlFor="">
                      Type:
                      <select
                        {...register(`videos.${idx}.type` as const)}
                        className="ml-2 p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                      >
                        <option value="Music Video">Music Video</option>
                        <option value="Interview">Interview</option>
                        <option value="Vlog Videos">Vlog Videos</option>
                        <option value="Other Videos">Other Videos</option>
                      </select>
                    </label>
                    <input
                      {...register(`videos.${idx}.embedUrl` as const)}
                      placeholder="Embed URL"
                      className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <label className="flex items-center gap-2 text-card-foreground">
                      <input
                        type="checkbox"
                        {...register(`videos.${idx}.isFeatured` as const)}
                      />
                      <span className="text-sm">Featured</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => videosField.remove(idx)}
                      className="ml-auto px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Defining Tracks (dynamic with image) */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Defining Tracks
          </h2>
          <button
            type="button"
            onClick={() =>
              tracksField.append({
                title: "",
                year: "",
                externalLink: "",
                image: null,
              })
            }
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Add Track
          </button>

          <div className="space-y-4 mt-4">
            {tracksField.fields.map((f, idx) => (
              <div key={f.id} className="border border-border rounded p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    {...register(`definingTracks.${idx}.title` as const)}
                    placeholder="Title"
                    className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                  />
                  <input
                    {...register(`definingTracks.${idx}.year` as const)}
                    placeholder="Year"
                    className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                  />
                  <input
                    {...register(`definingTracks.${idx}.externalLink` as const)}
                    placeholder="External link"
                    className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-sm mb-1 text-card-foreground">
                    Track Image
                  </label>
                  <input
                    type="file"
                    {...register(`definingTracks.${idx}.image` as const)}
                    accept="image/*"
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => tracksField.remove(idx)}
                    className="px-2 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card: YouTube Embed Preview (resizable) */}

        {/* Card: Website & Socials */}
        <div className="bg-card shadow-sm rounded-lg p-6 border border-border">
          <h2 className="text-xl font-medium mb-3 text-card-foreground">
            Website & Socials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              {...register("website" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="Website"
            />
            <input
              {...register("instagram" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="Instagram URL"
            />
            <input
              {...register("youtube" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="YouTube channel / URL"
            />
            <input
              {...register("spotify" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="Spotify URL"
            />
            <input
              {...register("soundcloud" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="SoundCloud URL"
            />
            <input
              {...register("twitter" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="Twitter/X URL"
            />
            <input
              {...register("appleMusic" as any)}
              className="p-2 border border-border rounded bg-background text-card-foreground transition-colors"
              placeholder="Apple Music URL"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded shadow hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Register Musician"}
          </button>
        </div>
      </form>
    </div>
  );
}
