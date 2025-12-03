// app/api/rappers/requests/route.ts

import { NextResponse, NextRequest } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createMusicianRequest } from "@/lib/actions/musicianRequest.actions";
import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import User from "@/lib/database/model/User";
import { auth } from "@clerk/nextjs/server";

// --------------------------------------------------
// ADMIN CHECK
// --------------------------------------------------
async function checkAdminAccess(): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: Please sign in");

  await dbConnect();
  const user = await User.findOne({ clerkId: userId });

  if (!user || !user.isAdmin()) {
    throw new Error("Access denied: Admin privileges required");
  }
}

// --------------------------------------------------
// SAFE ARRAY PARSER
// --------------------------------------------------
function parseArrayField(fieldString: string | File | null): string[] {
  if (!fieldString || typeof fieldString !== "string") return [];
  try {
    return JSON.parse(fieldString);
  } catch {
    return fieldString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

// --------------------------------------------------
// GET (ALL REQUESTS)
// --------------------------------------------------
export async function GET() {
  try {
    await checkAdminAccess();
    await dbConnect();

    const requests = await MusicianRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    const status =
      error instanceof Error &&
      (error.message.includes("Admin") || error.message.includes("privileges"))
        ? 403
        : 500;

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed",
      },
      { status }
    );
  }
}

// --------------------------------------------------
// POST: CREATE MUSICIAN REQUEST
// --------------------------------------------------
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: Please sign in");

  try {
    const formData = await request.formData();

    // BASIC FIELDS
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const category = formData.get("category") as string;
    const artistStatus = formData.get("artistStatus") as string;
    const shortBio = formData.get("shortBio") as string;
    const website = formData.get("website") as string;

    const imageFile = formData.get("image") as File;
    const heroBannerFile = formData.get("heroBannerImage") as File;

    // SOCIALS
    const instagram = formData.get("instagram") as string;
    const youtube = formData.get("youtube") as string;
    const spotify = formData.get("spotify") as string;
    const soundcloud = formData.get("soundcloud") as string;
    const twitter = formData.get("twitter") as string;
    const appleMusic = formData.get("appleMusic") as string;

    // NEW FIELDS
    const deepDiveNarrative = formData.get("deepDiveNarrative") as string;
    const videoEmbed = formData.get("videoEmbed") as string;
    const videoWidth = formData.get("videoWidth") as string;
    const videoHeight = formData.get("videoHeight") as string;
    const born = formData.get("born") as string;
    const origin = formData.get("origin") as string;

    const primaryAffiliationName = formData.get(
      "primaryAffiliationName"
    ) as string;
    const primaryAffiliationLink = formData.get(
      "primaryAffiliationLink"
    ) as string;

    const heroTags = parseArrayField(formData.get("heroTags") as string);
    const alsoKnownAs = parseArrayField(formData.get("alsoKnownAs") as string);
    const notableCollaborators = parseArrayField(
      formData.get("notableCollaborators") as string
    );
    const proteges = parseArrayField(formData.get("proteges") as string);
    const relatedArtists = parseArrayField(
      formData.get("relatedArtists") as string
    );

    // OLD FIELDS (still required)
    const audio = formData.get("audio") as string;
    const readMoreLink = formData.get("readMoreLink") as string;

    const yearsActiveStart = formData.get("yearsActiveStart") as string;
    const yearsActiveEnd = formData.get("yearsActiveEnd") as string;

    const labelCrew = formData.get("labelCrew") as string;
    const labelCrewLink = formData.get("labelCrewLink") as string;

    const associatedActs = parseArrayField(
      formData.get("associatedActs") as string
    );
    const associatedActsLinks = parseArrayField(
      formData.get("associatedActsLinks") as string
    );

    const district = formData.get("district") as string;
    const districtLink = formData.get("districtLink") as string;

    const frequentProducers = parseArrayField(
      formData.get("frequentProducers") as string
    );
    const frequentProducersLink = parseArrayField(
      formData.get("frequentProducersLink") as string
    );

    const fansOf = parseArrayField(formData.get("fansOf") as string);
    const fansOfLink = parseArrayField(formData.get("fansOfLink") as string);

    // BREAKOUT TRACK
    const breakoutTrackName = formData.get("breakoutTrackName") as string;
    const breakoutTrackUrl = formData.get("breakoutTrackUrl") as string;

    // DEFINING PROJECT
    const definingProjectName = formData.get("definingProjectName") as string;
    const definingProjectLink = formData.get("definingProjectLink") as string;
    const definingProjectYear = formData.get("definingProjectYear") as string;

    // VIDEOS
    let videos = [];
    const videosString = formData.get("videos") as string;
    if (videosString) {
      try {
        videos = JSON.parse(videosString);
      } catch {
        videos = [];
      }
    }

    // DEFINING TRACKS
    const definingTracksString = formData.get("definingTracks") as string;
    const parsedDefiningTracks: {
      title?: string;
      year?: string;
      image?: File;
      externalLink?: string;
    }[] = definingTracksString ? JSON.parse(definingTracksString) : [];

    const processedDefiningTracks = await Promise.all(
      parsedDefiningTracks.map(async (track, index) => {
        let trackImageData = { id: "", url: "" };
        const trackImageFile = formData.get(`definingTracks[${index}].image`) as File;
        if (trackImageFile?.size && trackImageFile.name !== "undefined") {
          trackImageData = await uploadToCloudinary(trackImageFile);
        }
        return {
          title: track.title,
          year: track.year ? parseInt(track.year, 10) : undefined,
          externalLink: track.externalLink,
          image: trackImageData,
        };
      })
    );

    // IMAGE UPLOADS
    // IMAGE UPLOADS
    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Artist image is required" },
        { status: 400 }
      );
    }

    let image;
    try {
      image = await uploadToCloudinary(imageFile);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return NextResponse.json(
        { error: "Image upload failed. Try again." },
        { status: 500 }
      );
    }

    if (!image || !image.url) {
      return NextResponse.json(
        { error: "Invalid image response from Cloudinary" },
        { status: 500 }
      );
    }

    let heroBannerImage: { id?: string; url?: string } | undefined;
    if (heroBannerFile && heroBannerFile.size > 0) {
      heroBannerImage = await uploadToCloudinary(heroBannerFile);
    }

    // SUBMIT REQUEST
    const result = await createMusicianRequest({
      name,
      city,
      state,
      category,
      artistStatus,
      website,
      shortBio,
      image,
      heroBannerImage,
      socials: {
        instagram,
        youtube,
        spotify,
        soundcloud,
        twitter,
        appleMusic,
      },
      heroTags,
      alsoKnownAs,
      born,
      origin,
      primaryAffiliation: {
        name: primaryAffiliationName,
        link: primaryAffiliationLink,
      },
      notableCollaborators,
      proteges,
      relatedArtists,
      audio,
      videos,
      definingTracks: processedDefiningTracks,
      deepDiveNarrative,
      videoEmbed,
      videoWidth: videoWidth ? Number(videoWidth) : undefined,
      videoHeight: videoHeight ? Number(videoHeight) : undefined,
      readMoreLink,
      yearsActive: {
        start: yearsActiveStart ? Number(yearsActiveStart) : undefined,
        end: yearsActiveEnd ? Number(yearsActiveEnd) : undefined,
      },
      labelCrew,
      labelCrewLink,
      associatedActs,
      associatedActsLinks,
      district,
      districtLink,
      frequentProducers,
      frequentProducersLink,
      breakoutTrack: {
        name: breakoutTrackName,
        url: breakoutTrackUrl,
      },
      definingProject: {
        name: definingProjectName,
        link: definingProjectLink,
        year: definingProjectYear ? Number(definingProjectYear) : undefined,
      },
      fansOf,
      fansOfLink,
      submittedBy: userId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, data: result.data, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /rappers/requests error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
