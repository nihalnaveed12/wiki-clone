"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchMusicians } from "@/lib/fetchmusicians";
import Link from "next/link";
import { MapPin, Search, X, Sliders, AlertCircle } from "lucide-react";

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

// California bounds
const CALIFORNIA_BOUNDS = {
  north: 42.0095,
  south: 32.5295,
  west: -124.4820,
  east: -114.1312,
};

// Helper function to check if coordinates are in California
const isInCalifornia = (lat: number, lng: number): boolean => {
  return (
    lat >= CALIFORNIA_BOUNDS.south &&
    lat <= CALIFORNIA_BOUNDS.north &&
    lng >= CALIFORNIA_BOUNDS.west &&
    lng <= CALIFORNIA_BOUNDS.east
  );
};

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
  const [locationError, setLocationError] = useState("");
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
        // Filter to only include California musicians
        const californiaMusicians = (data || []).filter((musician) =>
          isInCalifornia(musician.lat, musician.lng)
        );
        setMusicians(californiaMusicians);
      } catch (err) {
        console.error("Error fetching musicians:", err);
      } finally {
        setLoading(false);
      }
    };
    getMusicians();
  }, []);

  // Get unique values for filter dropdowns (California only)
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

    const results = musicians.filter((musician) => {
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

    // Check if search attempted to find non-California locations
    if (hasInteracted && results.length === 0 && search) {
      // Check if search term might be a non-California location
      const searchLower = search.toLowerCase();
      const nonCALocations = [
        "new york",
        "texas",
        "florida",
        "washington",
        "oregon",
        "nevada",
        "arizona",
      ];
      if (nonCALocations.some((loc) => searchLower.includes(loc))) {
        setLocationError("Only California locations are available on this map.");
      } else {
        setLocationError("");
      }
    } else {
      setLocationError("");
    }

    return results;
  }, [musicians, filters, search, hasInteracted]);

  // Map fly-to helper with California bounds restriction
  function FlyToLocation() {
    const map = useMap();
    useEffect(() => {
      if (filteredMusicians.length > 0) {
        const valid = filteredMusicians.filter((m) => m.lat && m.lng);
        if (valid.length > 0) {
          const bounds = L.latLngBounds(valid.map((m) => [m.lat, m.lng]));
          
          // Ensure bounds are within California
          const constrainedBounds = L.latLngBounds(
            [
              Math.max(bounds.getSouth(), CALIFORNIA_BOUNDS.south),
              Math.max(bounds.getWest(), CALIFORNIA_BOUNDS.west)
            ],
            [
              Math.min(bounds.getNorth(), CALIFORNIA_BOUNDS.north),
              Math.min(bounds.getEast(), CALIFORNIA_BOUNDS.east)
            ]
          );
          
          map.fitBounds(constrainedBounds, { padding: [50, 50], maxZoom: 12 });
        }
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
    setLocationError("");
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-card-foreground">
            Loading California musicians...
          </p>
        </div>
      </div>
    );

  if (!musicians.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">
          No musicians found in California.
        </p>
      </div>
    );

  return (
    <div className="text-card-foreground flex h-screen font-sans relative">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md">
        <div className="flex items-center bg-card rounded-full shadow-lg px-4 py-2 border border-border">
          <Search className="text-muted-foreground mr-2" size={18} />
          <input
            type="text"
            placeholder="Search California musicians by name, city or category..."
            value={search}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="flex-1 outline-none text-sm bg-transparent placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2 p-1 rounded-full hover:bg-accent transition-colors"
          >
            <Sliders className="text-muted-foreground" size={18} />
          </button>
        </div>
      </div>

      {/* Location Error Alert */}
      {locationError && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 w-[90%] max-w-md">
          <div className="bg-destructive/10 border border-destructive rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="text-destructive" size={18} />
            <p className="text-sm text-destructive">{locationError}</p>
            <button
              onClick={() => setLocationError("")}
              className="ml-auto text-destructive"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Filter Dropdown */}
      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md bg-card rounded-lg shadow-xl p-4 border border-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-card-foreground">
              Filters (California Only)
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
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
                  className="flex items-center bg-secondary px-3 py-1 rounded-full text-sm"
                >
                  <span className="capitalize text-secondary-foreground">
                    {filter}: {filters[filter as keyof typeof filters]}
                  </span>
                  <button
                    onClick={() =>
                      clearFilter(filter as "city" | "country" | "category")
                    }
                    className="ml-2 text-muted-foreground hover:text-card-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* City Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-card-foreground">
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full p-2 border border-border rounded-lg text-sm bg-background text-card-foreground"
            >
              <option value="">All California Cities</option>
              {uniqueValues.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-card-foreground">
              Country
            </label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full p-2 border border-border rounded-lg text-sm bg-background text-card-foreground"
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
            <label className="block text-sm font-medium mb-1 text-card-foreground">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full p-2 border border-border rounded-lg text-sm bg-background text-card-foreground"
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

      {/* Results Panel */}
      {hasInteracted && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-md bg-card rounded-lg shadow-lg p-4 border border-border">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-card-foreground">
              {filteredMusicians.length}{" "}
              {filteredMusicians.length === 1 ? "result" : "results"} in California
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="overflow-y-auto max-h-[40vh] pr-2">
            {filteredMusicians.length > 0 ? (
              filteredMusicians.map((musician) => (
                <Link
                  href={`/musician/${musician._id}`}
                  key={musician._id}
                  className="block mb-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={musician.image?.url || "/default-avatar.png"}
                      alt={musician.name}
                      className="w-12 h-12 object-cover rounded-lg border border-border"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground">
                        {musician.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {musician.category} • {musician.city}, {musician.country}
                      </p>
                    </div>
                    <MapPin className="text-muted-foreground" size={16} />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                {locationError
                  ? "Try searching for California cities like Los Angeles, San Francisco, or San Diego"
                  : "No musicians match your search/filters in California"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="w-full h-full z-0">
        <MapContainer
          center={[36.7783, -119.4179]} // California center
          zoom={6}
          style={{ height: "100%", width: "100%" }}
          maxBounds={[
            [CALIFORNIA_BOUNDS.south - 0.5, CALIFORNIA_BOUNDS.west - 0.5],
            [CALIFORNIA_BOUNDS.north + 0.5, CALIFORNIA_BOUNDS.east + 0.5],
          ]}
          maxBoundsViscosity={1.0}
          minZoom={6}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation />

          {hasInteracted &&
            filteredMusicians
              .filter((m) => m.lat && m.lng)
              .map((musician) => (
                <Marker
                  key={musician._id}
                  position={[musician.lat, musician.lng]}
                >
                  <Popup className="min-w-[250px]">
                    <Link href={`/musician/${musician._id}`} className="block">
                      <div className="flex gap-3">
                        <img
                          src={musician.image?.url || "/default-avatar.png"}
                          alt={musician.name}
                          className="w-16 h-16 object-cover rounded-lg border border-border"
                        />
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {musician.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            {musician.category} • {musician.city}
                          </p>
                          <p className="text-xs text-card-foreground line-clamp-2">
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