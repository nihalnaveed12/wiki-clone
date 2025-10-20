// @components/form.tsx

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().optional(),
  city: z.string().min(1, "City is required"),
  image: z.any().optional(),
  address: z.string().min(1, "Address is required"),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(500, "Bio must be under 500 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),
  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),
  spotify: z.string().url("Invalid Spotify URL").optional().or(z.literal("")),
  soundcloud: z
    .string()
    .url("Invalid SoundCloud URL")
    .optional()
    .or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  audio: z
    .string()
    .url("Invalid audio URL")
    .refine(
      (url) =>
        url.endsWith(".mp3") || url.endsWith(".wav") || url.endsWith(".ogg"),
      {
        message: "Only .mp3, .wav, or .ogg files are allowed",
      }
    )
    .optional()
    .or(z.literal("")),

  // New Fields
  tags: z.string().optional().or(z.literal("")), // comma-separated
  readMoreLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  yearsActiveStart: z
    .string()
    .min(1, "Years active start is required")
    .regex(/^\d{4}$/, "Must be a valid year"),
  yearsActiveEnd: z
    .string()
    .regex(/^\d{4}$/, "Must be a valid year")
    .optional()
    .or(z.literal("")),
  labelCrew: z.string().optional().or(z.literal("")),
  associatedActs: z.string().optional().or(z.literal("")), // comma-separated
  district: z.string().optional().or(z.literal("")),
  frequentProducers: z.string().optional().or(z.literal("")), // comma-separated
  breakoutTrackName: z.string().min(1, "Breakout track name is required"),
  breakoutTrackUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  definingProjectName: z.string().min(1, "Defining project name is required"),
  definingProjectYear: z
    .string()
    .regex(/^\d{4}$/, "Must be a valid year")
    .optional()
    .or(z.literal("")),
  fansOf: z.string().optional().or(z.literal("")), // comma-separated
});

export type FormData = z.infer<typeof schema>;

interface Props {
  submitForm: (data: FormData) => void | Promise<void>;
}

const allCountries = ["USA", "Pak", "India", "UK"];

const allCities = [
  "New York City, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
  "Austin, TX",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "San Francisco, CA",
];

export default function MusicianForm({ submitForm }: Props) {
  const [cities, setCities] = useState<string[]>(allCities);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const imageWatch = watch("image");

  useEffect(() => {
    if (imageWatch && imageWatch.length > 0) {
      const file = imageWatch[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }, [imageWatch]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await submitForm(data);
      console.log("Form submitted:", data);
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-10 bg-card rounded-xl shadow-lg border border-border">
      <h1 className="text-3xl font-bold mb-8 text-card-foreground border-b border-border pb-4">
        Musician Registration
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Name *
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="Enter musician name"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.name?.message}
              </p>
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Category *
              </label>
              <input
                {...register("category")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Hip Hop, R&B, Pop"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.category?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Country *
              </label>
              <select
                {...register("country")}
                disabled={!allCountries.length}
                className="w-full px-3 py-2 border rounded-lg bg-background disabled:bg-muted"
              >
                <option value="">Select a city</option>
                {allCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <p className="text-destructive text-xs mt-1">
                {errors.city?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                City *
              </label>
              <select
                {...register("city")}
                disabled={!cities.length}
                className="w-full px-3 py-2 border rounded-lg bg-background disabled:bg-muted"
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <p className="text-destructive text-xs mt-1">
                {errors.city?.message}
              </p>
            </div>
            {/* District */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                District
              </label>
              <input
                {...register("district")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., The Crest Side"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.district?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            Full Address *
          </label>
          <input
            {...register("address")}
            className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
            placeholder="Enter complete address for accurate location"
          />
          <p className="text-destructive text-xs mt-1">
            {errors.address?.message}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            This will be used to pinpoint the exact location on the map
          </p>
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
                {...register("image")}
                type="file"
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
            {...register("bio")}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
            placeholder="Tell us about the musician (max 500 characters)"
          />
          <p className="text-destructive text-xs mt-1">{errors.bio?.message}</p>
        </div>

        {/* Career Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Career Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Years Active Start */}
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

            {/* Years Active End */}
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

            {/* Label/Crew */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Label/Crew
              </label>
              <input
                {...register("labelCrew")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Independent / King Cutz"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.labelCrew?.message}
              </p>
            </div>

            {/* Breakout Track Name */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Breakout Track Name *
              </label>
              <input
                {...register("breakoutTrackName")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., First Day Out"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.breakoutTrackName?.message}
              </p>
            </div>

            {/* Breakout Track URL */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Breakout Track URL
              </label>
              <input
                {...register("breakoutTrackUrl")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://..."
              />
              <p className="text-destructive text-xs mt-1">
                {errors.breakoutTrackUrl?.message}
              </p>
            </div>

            {/* Defining Project Name */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Defining Project Name *
              </label>
              <input
                {...register("definingProjectName")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Crest Story Deluxe"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.definingProjectName?.message}
              </p>
            </div>

            {/* Defining Project Year */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Defining Project Year
              </label>
              <input
                {...register("definingProjectYear")}
                type="number"
                placeholder="2022"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.definingProjectYear?.message}
              </p>
            </div>
          </div>
        </div>

        {/* Tags and Lists Section */}
        <div>
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Music & Influences
          </h2>
          <div className="space-y-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Tags/Genres
              </label>
              <input
                {...register("tags")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Hip-Hop, Trap, West Coast"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list of genres/tags
              </p>
              <p className="text-destructive text-xs mt-1">
                {errors.tags?.message}
              </p>
            </div>

            {/* Associated Acts */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Associated Acts
              </label>
              <input
                {...register("associatedActs")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Bandlez Giddy, Artist Name"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list of collaborators/associated artists
              </p>
              <p className="text-destructive text-xs mt-1">
                {errors.associatedActs?.message}
              </p>
            </div>

            {/* Frequent Producers */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Frequent Producers
              </label>
              <input
                {...register("frequentProducers")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., L-Phaze, Producer Name"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list of producers they work with
              </p>
              <p className="text-destructive text-xs mt-1">
                {errors.frequentProducers?.message}
              </p>
            </div>

            {/* Fans Of */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Fans Of (Influences)
              </label>
              <input
                {...register("fansOf")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="e.g., Tupac, Nas, Jay-Z"
              />
              <p className="text-muted-foreground text-xs mt-1">
                Comma-separated list of their musical influences
              </p>
              <p className="text-destructive text-xs mt-1">
                {errors.fansOf?.message}
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
            {/* Audio URL */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Audio URL (only .mp3, .wav, .ogg)
              </label>
              <input
                {...register("audio")}
                placeholder="https://example.com/song.mp3"
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.audio?.message}
              </p>
            </div>

            {/* Read More Link */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Read More Link
              </label>
              <input
                {...register("readMoreLink")}
                placeholder="https://example.com/bio"
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.readMoreLink?.message}
              </p>
            </div>
          </div>
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
                {...register("website")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://example.com"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.website?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Instagram
              </label>
              <input
                {...register("instagram")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://instagram.com/username"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.instagram?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                YouTube
              </label>
              <input
                {...register("youtube")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://youtube.com/channel/..."
              />
              <p className="text-destructive text-xs mt-1">
                {errors.youtube?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Spotify
              </label>
              <input
                {...register("spotify")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://open.spotify.com/artist/..."
              />
              <p className="text-destructive text-xs mt-1">
                {errors.spotify?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                SoundCloud
              </label>
              <input
                {...register("soundcloud")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://soundcloud.com/username"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.soundcloud?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Twitter/X
              </label>
              <input
                {...register("twitter")}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:border-primary focus:ring-primary bg-background text-card-foreground"
                placeholder="https://twitter.com/username"
              />
              <p className="text-destructive text-xs mt-1">
                {errors.twitter?.message}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Registering Musician..." : "Register Musician"}
          </button>
        </div>
      </form>
    </div>
  );
}

const Select = ({ label, options, error, ...props }: any) => (
  <div>
    {" "}
    <label className="block text-sm font-medium text-card-foreground mb-1">
      {label}
    </label>{" "}
    <select
      {...props}
      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-card-foreground focus:border-primary"
    >
      {" "}
      <option value="">Select...</option>{" "}
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {" "}
          {opt}{" "}
        </option>
      ))}{" "}
    </select>{" "}
    {error && <p className="text-destructive text-xs mt-1">{error}</p>}{" "}
  </div>
);
