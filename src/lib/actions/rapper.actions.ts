// @lib/actions/rapper.actions.ts

import dbConnect from "@/lib/database/mongodb";
import Rapper from "@/lib/database/model/Rappers";
import User from "@/lib/database/model/User";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

interface RapperParams {
  name: string;
  city: string;
  state?: string;
  lat: number;
  lng: number;
  category: string;
  artistStatus?: string;
  website?: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
    twitter?: string;
    appleMusic?: string;
  };
  heroBannerImage?: {
    id?: string;
    url?: string;
  };
  heroTags?: string[];
  image: {
    id: string;
    url: string;
  };
  shortBio: string;
  audio?: string;
  videos?: {
    title?: string;
    type?: string;
    embedUrl?: string;
    isFeatured?: boolean;
  }[];
  definingTracks?: {
    title?: string;
    year?: number;
    image?: {
      id?: string;
      url?: string;
    };
    externalLink?: string;
  }[];
  deepDiveNarrative?: any;
  alsoKnownAs?: string[];
  born?: string;
  origin?: string;
  primaryAffiliation?: {
    name?: string;
    link?: string;
  };
  notableCollaborators?: string[];
  proteges?: string[];
  relatedArtists?: string[];
 
  readMoreLink?: string;
  yearsActive?: {
    start?: number;
    end?: number;
  };
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string[];
  associatedActsLinks?: string[];
  district?: string;
  districtLink?: string;
  frequentProducers?: string[];
  frequentProducersLink?: string[];
  
  breakoutTrack?: {
    name?: string;
    url?: string;
  };
  status?: "active" | "inactive";
  definingProject?: {
    name?: string;
    year?: number;
    link?: string;
  };
  fansOf?: string[];
  fansOfLink?: string[];
  submittedBy?: string;
}

interface UpdateRapperParams extends Omit<RapperParams, "lat" | "lng"> {
  _id: string;
  lat?: number;
  lng?: number;
}

async function checkAdminAccess(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });

  if (!user || !user.isAdmin()) {
    throw new Error("Access denied: Admin privileges required");
  }
}

async function checkAdminOrOwnerAccess(rapperId: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in");
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });
  const rapper = await Rapper.findById(rapperId);

  if (!rapper) {
    throw new Error("Rapper not found");
  }

  if (user?.isAdmin && typeof user.isAdmin === "function" && user.isAdmin()) {
    return;
  }

  if (rapper.submittedBy === userId) {
    return;
  }

  throw new Error("Access denied: You are not allowed to perform this action");
}

async function getCoordinates(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) {
    throw new Error("OpenCage API key is not configured.");
  }

  const query = `${city}`.trim();
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      console.log(`Geocoded location: ${query} -> ${lat}, ${lng}`);
      return { lat: Number(lat), lng: Number(lng) };
    } else {
      const fallbackQuery = `${city}`;
      const fallbackUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        fallbackQuery
      )}&key=${apiKey}&limit=1`;

      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();

      if (fallbackData.results && fallbackData.results.length > 0) {
        const { lat, lng } = fallbackData.results[0].geometry;
        console.log(
          `Fallback geocoded location: ${fallbackQuery} -> ${lat}, ${lng}`
        );
        return { lat: Number(lat), lng: Number(lng) };
      }
    }

    throw new Error(`Could not find coordinates for: ${query}`);
  } catch (error) {
    console.error("Geocoding API Error:", error);
    throw new Error(
      `Failed to fetch coordinates for "${query}". Please verify the address is correct.`
    );
  }
}

export async function createRapper(params: RapperParams) {
  try {
    await checkAdminAccess();
    await dbConnect();

    const existingRapper = await Rapper.findOne({ name: params.name });
    if (existingRapper)
      throw new Error("A rapper with this name already exists");

    const rapper = await Rapper.create({
      name: params.name,
      city: params.city,
      state: params.state || "",
      lat: params.lat,
      lng: params.lng,
      category: params.category,
      artistStatus: params.artistStatus || "",
      website: params.website || "",
      status: params.status || "active",
      socials: {
        instagram: params.socials?.instagram || "",
        youtube: params.socials?.youtube || "",
        spotify: params.socials?.spotify || "",
        soundcloud: params.socials?.soundcloud || "",
        twitter: params.socials?.twitter || "",
        appleMusic: params.socials?.appleMusic || "",
      },
      heroBannerImage: params.heroBannerImage || {},
      heroTags: params.heroTags || [],
      image: params.image,
      shortBio: params.shortBio,
      audio: params.audio || "",
      videos: params.videos || [],
      definingTracks: params.definingTracks || [],
      deepDiveNarrative: params.deepDiveNarrative || "",
      alsoKnownAs: params.alsoKnownAs || [],
      born: params.born || "",
      origin: params.origin || "",
      primaryAffiliation: params.primaryAffiliation || {},
      notableCollaborators: params.notableCollaborators || [],
      proteges: params.proteges || [],
      relatedArtists: params.relatedArtists || [],

      
      readMoreLink: params.readMoreLink || "",
      yearsActive: {
        start: params.yearsActive?.start || null,
        end: params.yearsActive?.end || null,
      },
      labelCrew: params.labelCrew || "",
      labelCrewLink: params.labelCrewLink || "",
      associatedActs: params.associatedActs || [],
      associatedActsLinks: params.associatedActsLinks || [],
      district: params.district || "",
      districtLink: params.districtLink || "",
      frequentProducers: params.frequentProducers || [],
      frequentProducersLink: params.frequentProducersLink || [],
     
      breakoutTrack: params.breakoutTrack || {},
      definingProject: params.definingProject || {},
      fansOf: params.fansOf || [],
      fansOfLink: params.fansOfLink || [],
      submittedBy: params.submittedBy,
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(rapper)),
      message: "Rapper created successfully",
    };
  } catch (error) {
    console.error("Error creating rapper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create rapper",
    };
  }
}

export async function updateRapper(params: UpdateRapperParams) {
  try {
    await checkAdminOrOwnerAccess(params._id);
    await dbConnect();

    const {
      _id,
      relatedArtists,
      socials,
      heroBannerImage,
      heroTags,
      videos,
      definingTracks,
      deepDiveNarrative,
      primaryAffiliation,
      breakoutTrack,
      definingProject,
      ...updateData
    } = params;

    const rapper = await Rapper.findByIdAndUpdate(
      _id,
      {
        ...updateData,
        relatedArtists: relatedArtists || [],
        socials: {
          instagram: socials?.instagram || "",
          youtube: socials?.youtube || "",
          spotify: socials?.spotify || "",
          soundcloud: socials?.soundcloud || "",
          twitter: socials?.twitter || "",
          appleMusic: socials?.appleMusic || "",
        },
        heroBannerImage: heroBannerImage || {},
        heroTags: heroTags || [],
        videos: videos || [],
        definingTracks: definingTracks || [],
        deepDiveNarrative: deepDiveNarrative || "",
        primaryAffiliation: primaryAffiliation || {},
        breakoutTrack: breakoutTrack || {},
        definingProject: definingProject || {},
      },
      { new: true, runValidators: true }
    );

    if (!rapper) throw new Error("Rapper not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(rapper)),
      message: "Rapper updated successfully",
    };
  } catch (error) {
    console.error("Error updating rapper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update rapper",
    };
  }
}

export async function deleteRapper(_id: string) {
  try {
    await checkAdminOrOwnerAccess(_id);
    await dbConnect();

    const rapper = await Rapper.findByIdAndDelete(_id);

    if (!rapper) {
      throw new Error("Rapper not found");
    }

    return {
      success: true,
      message: "Rapper deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting rapper:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete rapper",
    };
  }
}

export async function getRapperById(_id: string) {
  try {
    await dbConnect();

    const rapper = await Rapper.findById(_id);

    if (!rapper) {
      return {
        success: false,
        error: "Rapper not found",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(rapper)),
    };
  } catch (error) {
    console.error("Error fetching rapper:", error);
    return {
      success: false,
      error: "Failed to fetch rapper",
    };
  }
}

export async function getAllRappers() {
  try {
    await dbConnect();
    const rappers = await Rapper.find({}).sort({ createdAt: -1 });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(rappers)),
    };
  } catch (error) {
    console.error("Error fetching rappers:", error);
    return {
      success: false,
      error: "Failed to fetch rappers",
    };
  }
}

export async function getRappersByCity(city: string) {
  try {
    await dbConnect();

    const rappers = await Rapper.find({
      city: new RegExp(city, "i"),
    }).sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(rappers)),
    };
  } catch (error) {
    console.error("Error fetching rappers by city:", error);
    return {
      success: false,
      error: "Failed to fetch rappers",
    };
  }
}
