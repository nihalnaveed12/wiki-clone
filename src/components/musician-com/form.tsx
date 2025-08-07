"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
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
});

// EXPORT this type so other files can use it as the single source of truth
export type FormData = z.infer<typeof schema>;

interface Props {
  // Update the function signature to be more flexible with async functions
  submitForm: (data: FormData) => void | Promise<void>;
}

export default function MusicianForm({ submitForm }: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const countryWatch = watch("country");
  const imageWatch = watch("image");

  interface CountryData {
    country: string;
    cities: string[];
  }

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const json = await res.json();
        if (json.data) {
          setCountries(json.data.map((c: CountryData) => c.country).sort());
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!countryWatch) {
        setCities([]);
        return;
      }
      // When country changes, reset the city field
      setValue("city", "");

      try {
        const res = await fetch(
          "https://countriesnow.space/api/v0.1/countries/cities",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: countryWatch }),
          }
        );
        const json = await res.json();
        if (json.data) {
          setCities(json.data.sort());
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };
    fetchCities();
  }, [countryWatch, setValue]);

  // Create a preview URL when image changes
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
      reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
        Musician Registration
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter musician name"
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              {...register("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Hip Hop, R&B, Pop"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.category?.message}
            </p>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">
              {errors.country?.message}
            </p>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              {...register("city")}
              disabled={!countryWatch || cities.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <p className="text-red-500 text-xs mt-1">{errors.city?.message}</p>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Address *
          </label>
          <input
            {...register("address")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter complete address for accurate location"
          />
          <p className="text-red-500 text-xs mt-1">{errors.address?.message}</p>
          <p className="text-gray-500 text-xs mt-1">
            This will be used to pinpoint the exact location on the map
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artist Image
          </label>
          <div className="mt-1 flex items-center gap-6">
            <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
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
                  className="h-full w-full text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.993A2 2 0 002 18h20a2 2 0 002 2.007zM12 13a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              )}
            </span>
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Short Bio *
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Tell us about the musician (max 500 characters)"
          />
          <p className="text-red-500 text-xs mt-1">{errors.bio?.message}</p>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            Social Links & Website (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                {...register("website")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://example.com"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.website?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                {...register("instagram")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://instagram.com/username"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.instagram?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube
              </label>
              <input
                {...register("youtube")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://youtube.com/channel/..."
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.youtube?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spotify
              </label>
              <input
                {...register("spotify")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://open.spotify.com/artist/..."
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.spotify?.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SoundCloud
              </label>
              <input
                {...register("soundcloud")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://soundcloud.com/username"
              />
              <p className="text-red-500 text-xs mt-1">
                {errors.soundcloud?.message}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Registering Musician..." : "Register Musician"}
          </button>
        </div>
      </form>
    </div>
  );
}
