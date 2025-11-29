import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import Rapper from "@/lib/database/model/Rappers";
import User from "@/lib/database/model/User";

async function checkAdminAccess(): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: Please sign in");

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });

  if (!user || !user.isAdmin()) {
    throw new Error("Access denied: Admin privileges required");
  }
}

async function getCoordinates(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
  if (!apiKey) throw new Error("OpenCage API key is not configured.");

  const query = city.trim();
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    query
  )}&key=${apiKey}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (data.results?.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat: Number(lat), lng: Number(lng) };
    }

    throw new Error(`Could not find coordinates for: ${query}`);
  } catch (error) {
    console.error("Geocoding API Error:", error);
    throw new Error(
      `Failed to fetch coordinates for "${query}". Please verify the address is correct.`
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdminAccess();
    await dbConnect();

    const { userId } = await auth();
    const { id: requestId } = await params;

    const musicianRequest = await MusicianRequest.findById(requestId);
    if (!musicianRequest) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    if (musicianRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Request has already been processed" },
        { status: 400 }
      );
    }

    const { lat, lng } = await getCoordinates(musicianRequest.city);

    // Create rapper with new fields
    const rapper = await Rapper.create({
      name: musicianRequest.name,
      city: musicianRequest.city,
      state: musicianRequest.state,
      lat,
      lng,
      category: musicianRequest.category,
      website: musicianRequest.website || "",
      artistStatus: musicianRequest.artistStatus || "",
      socials: {
        instagram: musicianRequest.socials.instagram || "",
        youtube: musicianRequest.socials.youtube || "",
        spotify: musicianRequest.socials.spotify || "",
        soundcloud: musicianRequest.socials.soundcloud || "",
        twitter: musicianRequest.socials.twitter || "",
        appleMusic: musicianRequest.socials.appleMusic || "",
      },
      image: musicianRequest.image || { id: "", url: "" },
      heroBannerImage: musicianRequest.heroBannerImage || { id: "", url: "" },
      heroTags: musicianRequest.heroTags || [],
      shortBio: musicianRequest.shortBio,
      audio: musicianRequest.audio || "",
      readMoreLink: musicianRequest.readMoreLink || "",
      yearsActive: {
        start: musicianRequest.yearsActive.start || null,
        end: musicianRequest.yearsActive.end || null,
      },
      status: "active",
      labelCrew: musicianRequest.labelCrew || "",
      labelCrewLink: musicianRequest.labelCrewLink || "",
      associatedActs: musicianRequest.associatedActs || [],
      associatedActsLinks: musicianRequest.associatedActsLinks || [],
      district: musicianRequest.district || "",
      districtLink: musicianRequest.districtLink || "",
      frequentProducers: musicianRequest.frequentProducers || [],
      frequentProducersLink: musicianRequest.frequentProducersLink || [],
      breakoutTrack: {
        name: musicianRequest.breakoutTrack.name || "",
        url: musicianRequest.breakoutTrack.url || "",
      },
      definingProject: {
        name: musicianRequest.definingProject.name || "",
        link: musicianRequest.definingProject.link || "",
        year: musicianRequest.definingProject.year || null,
      },
      definingTracks: musicianRequest.definingTracks || [],
      deepDiveNarrative: musicianRequest.deepDiveNarrative || "",
      videoEmbed: musicianRequest.videoEmbed || "",
      videoWidth: musicianRequest.videoWidth || 16,
      videoHeight: musicianRequest.videoHeight || 9,
      alsoKnownAs: musicianRequest.alsoKnownAs || "",
      born: musicianRequest.born || "",
      origin: musicianRequest.origin || "",
      primaryAffiliation: musicianRequest.primaryAffiliation || { name: "", link: "" },
      notableCollaborators: musicianRequest.notableCollaborators || [],
      proteges: musicianRequest.proteges || [],
      relatedArtists: musicianRequest.relatedArtists || [],
      videos: musicianRequest.videos || [],
      fansOf: musicianRequest.fansOf || [],
      fansOfLink: musicianRequest.fansOfLink || [],
      submittedBy: musicianRequest.submittedBy,
    });

    await MusicianRequest.findByIdAndUpdate(requestId, {
      status: "approved",
      reviewedBy: userId,
      reviewedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: rapper,
      message: "Musician request approved and added successfully",
    });
  } catch (error) {
    console.error("Error approving musician request:", error);
    const statusCode =
      error instanceof Error &&
      (error.message.includes("privileges") || error.message.includes("Admin"))
        ? 403
        : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to approve request",
      },
      { status: statusCode }
    );
  }
}
