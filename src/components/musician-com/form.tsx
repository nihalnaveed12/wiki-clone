"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  image: z.any().optional(),
  address: z.string().min(1, "Address is required"),
  bio: z.string().max(200, "Bio must be under 200 characters"),
  website: z.string().url().optional(),
  category: z.string().min(1, "Category is required"),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  spotify: z.string().url().optional(),
  soundcloud: z.string().url().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  submitForm: (data: FormData) => void;
}

export default function MusicianForm({ submitForm }: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const countryWatch = watch("country");

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const json = await res.json();
      setCountries(json.data.map((c: any) => c.country));
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (!countryWatch) return;
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryWatch }),
        }
      );
      const json = await res.json();
      setCities(json.data || []);
    };
    fetchCities();
  }, [countryWatch]);

  const onSubmit = (data: FormData) => {
    submitForm(data)
    
    reset()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Musician Registration Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <input {...register("name")} className="w-full border p-2 rounded" />
          <p className="text-red-500">{errors.name?.message}</p>
        </div>

        <div>
          <label>Country</label>
          <select
            {...register("country")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a country</option>
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
          <p className="text-red-500">{errors.country?.message}</p>
        </div>

        <div>
          <label>City</label>
          <select {...register("city")} className="w-full border p-2 rounded">
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
          <p className="text-red-500">{errors.city?.message}</p>
        </div>

        <div className="">
          <label htmlFor="image">Image</label>
          <input type="file" {...register("image")} />
        </div>

        <div>
          <label>Address</label>
          <input
            {...register("address")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.address?.message}</p>
        </div>

        <div>
          <label>Short Bio</label>
          <textarea
            {...register("bio")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.bio?.message}</p>
        </div>

        <div>
          <label>Website</label>
          <input
            {...register("website")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.website?.message}</p>
        </div>

        <div>
          <label>Category</label>
          <input
            {...register("category")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.category?.message}</p>
        </div>

        <div>
          <label>Instagram</label>
          <input
            {...register("instagram")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.instagram?.message}</p>
        </div>

        <div>
          <label>YouTube</label>
          <input
            {...register("youtube")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.youtube?.message}</p>
        </div>

        <div>
          <label>Spotify</label>
          <input
            {...register("spotify")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.spotify?.message}</p>
        </div>

        <div>
          <label>SoundCloud</label>
          <input
            {...register("soundcloud")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500">{errors.soundcloud?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register Musician
        </button>
      </form>
    </div>
  );
}
