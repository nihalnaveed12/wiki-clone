"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchMusicians } from "@/lib/fetchmusicians";
import Link from "next/link";
import { MapPin, Search, X, Filter, Sliders } from "lucide-react";

// Fix Leaflet icons
delete (L.Icon.Default.prototype as { getIconUrl?: () => string }).getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

interface Musician {
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
  image: {
    id: string;
    url: string;
  };
  _id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  category: string;
  country: string;
  shortBio: string;
  website: string;
  createdAt: string;
  address: string;
  updatedAt: string;
  __v: number;
}

export default function MapClient() {
  const [search, setSearch] = useState("");
  const [musicians, setMusicians] = useState<Musician[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    country: "",
    category: "",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getMusicians = async () => {
      try {
        const data = await fetchMusicians();
        setMusicians(data || []);
      } catch (err) {
        console.error("Error fetching musicians:", err);
      } finally {
        setLoading(false);
      }
    };
    getMusicians();
  }, []);

  // Get unique values for filter dropdowns
  const uniqueValues = useMemo(() => {
    const cities = new Set<string>();
    const countries = new Set<string>();
    const categories = new Set<string>();

    musicians.forEach((musician) => {
      if (musician.city) cities.add(musician.city);
      if (musician.country) countries.add(musician.country);
      if (musician.category) categories.add(musician.category);
    });

    return {
      cities: Array.from(cities).sort(),
      countries: Array.from(countries).sort(),
      categories: Array.from(categories).sort(),
    };
  }, [musicians]);

  // Filter musicians based on active filters
  const filteredMusicians = useMemo(() => {
    if (!hasInteracted) return [];

    return musicians.filter((musician) => {
      const matchesCity =
        !filters.city ||
        musician.city?.toLowerCase().includes(filters.city.toLowerCase());
      const matchesCountry =
        !filters.country ||
        musician.country?.toLowerCase().includes(filters.country.toLowerCase());
      const matchesCategory =
        !filters.category ||
        musician.category
          ?.toLowerCase()
          .includes(filters.category.toLowerCase());
      const matchesSearch =
        !search ||
        musician.name?.toLowerCase().includes(search.toLowerCase()) ||
        musician.city?.toLowerCase().includes(search.toLowerCase()) ||
        musician.category?.toLowerCase().includes(search.toLowerCase());

      return matchesCity && matchesCountry && matchesCategory && matchesSearch;
    });
  }, [musicians, filters, search, hasInteracted]);

  // Map fly-to helper
  function FlyToLocation() {
    const map = useMap();
    useEffect(() => {
      if (filteredMusicians.length > 0) {
        const bounds = L.latLngBounds(
          filteredMusicians.map((m) => [m.lat, m.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [filteredMusicians, map]);
    return null;
  }

  const handleFilterChange = (
    type: "city" | "country" | "category",
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));

    if (value && !activeFilters.includes(type)) {
      setActiveFilters((prev) => [...prev, type]);
    } else if (!value) {
      setActiveFilters((prev) => prev.filter((f) => f !== type));
    }

    if (!hasInteracted) setHasInteracted(true);
  };

  const clearFilter = (type: "city" | "country" | "category") => {
    setFilters((prev) => ({
      ...prev,
      [type]: "",
    }));
    setActiveFilters((prev) => prev.filter((f) => f !== type));
  };

  const clearAllFilters = () => {
    setFilters({
      city: "",
      country: "",
      category: "",
    });
    setActiveFilters([]);
    setSearch("");
    setHasInteracted(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value && !hasInteracted) setHasInteracted(true);
  };

  const handleSearchSubmit = () => {
    if (search && !hasInteracted) setHasInteracted(true);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading musicians...</p>
        </div>
      </div>
    );

  if (!musicians.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">
          No musicians found in the database.
        </p>
      </div>
    );

  return (
    <div className="text-black flex h-screen font-sans relative">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md">
        <div className="flex items-center bg-white rounded-full shadow-lg px-4 py-2">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search musicians by name, city or category..."
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="flex-1 outline-none text-sm"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Sliders className="text-gray-600" size={18} />
          </button>
        </div>
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md bg-white rounded-lg shadow-xl p-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filters</h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>

          {/* Active filters chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                >
                  <span className="capitalize">
                    {filter}: {filters[filter as keyof typeof filters]}
                  </span>
                  <button
                    onClick={() =>
                      clearFilter(filter as "city" | "country" | "category")
                    }
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* City Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Cities</option>
              {uniqueValues.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Countries</option>
              {uniqueValues.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="">All Categories</option>
              {uniqueValues.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Results Panel - Only shows after interaction */}
      {hasInteracted && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              {filteredMusicians.length}{" "}
              {filteredMusicians.length === 1 ? "result" : "results"}
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Reset
            </button>
          </div>

          <div className="overflow-y-auto max-h-[40vh] pr-2">
            {filteredMusicians.length > 0 ? (
              filteredMusicians.map((musician) => (
                <Link
                  href={`/musicians/${musician._id}`}
                  key={musician._id}
                  className="block mb-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={musician.image.url}
                      alt={musician.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{musician.name}</h3>
                      <p className="text-xs text-gray-600">
                        {musician.category} • {musician.city},{" "}
                        {musician.country}
                      </p>
                    </div>
                    <MapPin className="text-gray-400" size={16} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No musicians match your search/filters
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="w-full h-full z-0">
        <MapContainer
          center={[31.5497, 74.3436]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation />

          {hasInteracted &&
            filteredMusicians.map((musician) => (
              <Marker
                key={musician._id}
                position={[musician.lat, musician.lng]}
              >
                <Popup className="min-w-[250px]">
                  <Link href={`/musicians/${musician._id}`} className="block">
                    <div className="flex gap-3">
                      <img
                        src={musician.image.url}
                        alt={musician.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{musician.name}</h3>
                        <p className="text-xs text-gray-600 mb-1">
                          {musician.category} • {musician.city}
                        </p>
                        <p className="text-xs line-clamp-2">
                          {musician.shortBio}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}
