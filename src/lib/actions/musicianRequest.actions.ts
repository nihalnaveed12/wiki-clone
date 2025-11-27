// @lib/actions/musicianRequest.actions.ts

import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import Rapper from "@/lib/database/model/Rappers";
import User from "../database/model/User";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

interface MusicianRequestParams {
  name: string;
  city: string;
  state?: string;
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
  heroBannerImage?: { id?: string; url?: string };
  heroTags?: string[];
  image: { id: string; url: string };
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
    image?: { id?: string; url?: string };
    externalLink?: string;
  }[];
  deepDiveNarrative?: any;
  alsoKnownAs?: string[];
  born?: string;
  origin?: string;
  primaryAffiliation?: { name?: string; link?: string };
  notableCollaborators?: string[];
  proteges?: string[];
  relatedArtists?: string[];
 
  readMoreLink?: string;
  yearsActive?: { start?: number; end?: number };
  labelCrew?: string;
  labelCrewLink?: string;
  associatedActs?: string[];
  associatedActsLinks?: string[];
  district?: string;
  districtLink?: string;
  frequentProducers?: string[];
  frequentProducersLink?: string[];
  
  breakoutTrack?: { name?: string; url?: string };
  definingProject?: { name?: string; year?: number; link?: string };
  fansOf?: string[];
  fansOfLink?: string[];
  submittedBy?: string;
}

async function checkAdminAccess(): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: Please sign in");

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });
  if (!user || !user.isAdmin())
    throw new Error("Access denied: Admin privileges required");
}

async function getCoordinates(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) throw new Error("OpenCage API key is not configured.");

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    city
  )}&key=${apiKey}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat: Number(lat), lng: Number(lng) };
    }

    throw new Error(`Could not find coordinates for: ${city}`);
  } catch (error) {
    console.error("Geocoding API Error:", error);
    throw new Error(`Failed to fetch coordinates for "${city}".`);
  }
}

// Create a new musician request (public)
export async function createMusicianRequest(params: MusicianRequestParams) {
  try {
    await dbConnect();

    const existingRequest = await MusicianRequest.findOne({
      name: params.name,
      status: "pending",
    });
    if (existingRequest)
      throw new Error(
        "A request for this musician name is already pending approval"
      );

    const existingRapper = await Rapper.findOne({ name: params.name });
    if (existingRapper)
      throw new Error("A musician with this name already exists");

    const request = await MusicianRequest.create({
      ...params,
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
      status: "pending",
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(request)),
      message:
        "Musician request submitted successfully! It will be reviewed by an admin.",
    };
  } catch (error) {
    console.error("Error creating musician request:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to submit musician request",
    };
  }
}

// Get all musician requests (admin)
export async function getAllMusicianRequests() {
  try {
    await checkAdminAccess();
    await dbConnect();

    const requests = await MusicianRequest.find({}).sort({ createdAt: -1 });
    return { success: true, data: JSON.parse(JSON.stringify(requests)) };
  } catch (error) {
    console.error("Error fetching musician requests:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch requests",
    };
  }
}

// Approve musician request (admin)
export async function approveMusicianRequest(_id: string) {
  try {
    await checkAdminAccess();
    await dbConnect();

    const { userId } = await auth();
    const request = await MusicianRequest.findById(_id);
    if (!request) throw new Error("Request not found");
    if (request.status !== "pending")
      throw new Error("Request has already been processed");

    const { lat, lng } = await getCoordinates(request.city);

    const rapper = await Rapper.create({
      ...request.toObject(),
      lat,
      lng,
      status: "active",
      relatedArtists: request.relatedArtists || [],


      videos: request.videos || [],
      definingTracks: request.definingTracks || [],
      deepDiveNarrative: request.deepDiveNarrative || "",
      socials: request.socials || {},
      heroBannerImage: request.heroBannerImage || {},
      heroTags: request.heroTags || [],
      primaryAffiliation: request.primaryAffiliation || {},
      breakoutTrack: request.breakoutTrack || {},
      definingProject: request.definingProject || {},
    });

    await MusicianRequest.findByIdAndUpdate(_id, {
      status: "approved",
      reviewedBy: userId,
      reviewedAt: new Date(),
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(rapper)),
      message: "Musician request approved and added successfully",
    };
  } catch (error) {
    console.error("Error approving musician request:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to approve request",
    };
  }
}

// Reject musician request (admin)
export async function rejectMusicianRequest(
  _id: string,
  rejectionReason?: string
) {
  try {
    await checkAdminAccess();
    await dbConnect();

    const { userId } = await auth();
    const request = await MusicianRequest.findById(_id);
    if (!request) throw new Error("Request not found");
    if (request.status !== "pending")
      throw new Error("Request has already been processed");

    await MusicianRequest.findByIdAndUpdate(_id, {
      status: "rejected",
      reviewedBy: userId,
      reviewedAt: new Date(),
      rejectionReason: rejectionReason || "",
    });

    return { success: true, message: "Musician request rejected" };
  } catch (error) {
    console.error("Error rejecting musician request:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reject request",
    };
  }
}
