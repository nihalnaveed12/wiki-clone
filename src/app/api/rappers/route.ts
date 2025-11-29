// app/api/rappers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createRapper, getAllRappers } from "@/lib/actions/rapper.actions";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";
import { de } from "zod/v4/locales";

export async function GET() {
  try {
    const result = await getAllRappers();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("API Error - GET /rappers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    // Basic Fields
    const name = (formData.get("name") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const state = (formData.get("state") as string)?.trim();
    const shortBio = (formData.get("bio") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const website = (formData.get("website") as string)?.trim();
    const artistStatus = (formData.get("artistStatus") as string)?.trim();

    // Socials
    const instagram = (formData.get("instagram") as string)?.trim();
    const youtube = (formData.get("youtube") as string)?.trim();
    const spotify = (formData.get("spotify") as string)?.trim();
    const soundcloud = (formData.get("soundcloud") as string)?.trim();
    const twitter = (formData.get("twitter") as string)?.trim();
    const appleMusic = (formData.get("appleMusic") as string)?.trim();

    // Hero Section
    const heroBannerImageFile = formData.get("heroBannerImage") as File;
    const heroTagsString = formData.get("heroTags") as string;

    // Media Hub
    const videosString = formData.get("videos") as string;

    // Defining Tracks
    const definingTracksString = formData.get("definingTracks") as string;

    // Deep Dive
    const deepDiveNarrative = (
      formData.get("deepDiveNarrative") as string
    )?.trim();
    const videoEmbed = (formData.get("videoEmbed") as string)?.trim();
    const videoWidth = formData.get("videoWidth") as string;
    const videoHeight = formData.get("videoHeight") as string;

    // At-a-Glance
    const alsoKnownAsString = formData.get("alsoKnownAs") as string;
    const born = (formData.get("born") as string)?.trim();
    const origin = (formData.get("origin") as string)?.trim();
    const primaryAffiliationName = (
      formData.get("primaryAffiliationName") as string
    )?.trim();
    const primaryAffiliationLink = (
      formData.get("primaryAffiliationLink") as string
    )?.trim();
    const notableCollaboratorsString = formData.get(
      "notableCollaborators"
    ) as string;
    const protegesString = formData.get("proteges") as string;
    const relatedArtistsString = formData.get("relatedArtists") as string;

    // Label & Acts
    const labelCrew = (formData.get("labelCrew") as string)?.trim();
    const labelCrewLink = (formData.get("labelCrewLink") as string)?.trim();
    const associatedActsString = formData.get("associatedActs") as string;
    const associatedActsLinksString = formData.get(
      "associatedActsLinks"
    ) as string;

    // Location & Producers
    const district = (formData.get("district") as string)?.trim();
    const districtLink = (formData.get("districtLink") as string)?.trim();
    const frequentProducersString = formData.get("frequentProducers") as string;
    const frequentProducersLinkString = formData.get(
      "frequentProducersLink"
    ) as string;

    // Breakout Track & Defining Project
    const breakoutTrackName = (
      formData.get("breakoutTrackName") as string
    )?.trim();
    const breakoutTrackUrl = (
      formData.get("breakoutTrackUrl") as string
    )?.trim();
    const definingProjectName = (
      formData.get("definingProjectName") as string
    )?.trim();
    const definingProjectYear = formData.get("definingProjectYear") as string;
    const definingProjectLink = (
      formData.get("definingProjectLink") as string
    )?.trim();

    // Fans
    const fansOfString = formData.get("fansOf") as string;
    const fansOfLinkString = formData.get("fansOfLink") as string;

    // Years Active
    const yearsActiveStart = formData.get("yearsActiveStart") as string;
    const yearsActiveEnd = formData.get("yearsActiveEnd") as string;

    // Status
    const status = (formData.get("status") as string)?.trim() || "active";

    // Image Upload
    let imageData = { id: "", url: "" };
    const imageFile = formData.get("image") as File;
    if (imageFile?.size && imageFile.name !== "undefined") {
      imageData = await uploadToCloudinary(imageFile);
    }

    let heroBannerImageData = { id: "", url: "" };
    if (heroBannerImageFile?.size && heroBannerImageFile.name !== "undefined") {
      heroBannerImageData = await uploadToCloudinary(heroBannerImageFile);
    }

    // Helper to parse arrays from JSON or comma string
    const parseArray = (input: string | null): string[] => {
      if (!input) return [];
      try {
        return JSON.parse(input);
      } catch {
        return input
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    };

    // Parse all array fields
    const heroTags = parseArray(heroTagsString);
    const videos: {
      title?: string;
      type?: string;
      embedUrl?: string;
      isFeatured?: boolean;
    }[] = videosString ? JSON.parse(videosString) : [];

    let definingtracksImage = { id: "", url: "" };
    if (
      formData.get("definingTracksImage") &&
      (formData.get("definingTracksImage") as File).size &&
      (formData.get("definingTracksImage") as File).name !== "undefined"
    ) {
      definingtracksImage = await uploadToCloudinary(
        formData.get("definingTracksImage") as File
      );
    }

    const definingTracks: {
      title?: string;
      year?: number;
      image?: { id?: string; url?: string };
      externalLink?: string;
    }[] = definingTracksString ? JSON.parse(definingTracksString) : [];

    const alsoKnownAs = parseArray(alsoKnownAsString);
    const notableCollaborators = parseArray(notableCollaboratorsString);
    const proteges = parseArray(protegesString);
    const relatedArtists = parseArray(relatedArtistsString);
    const associatedActs = parseArray(associatedActsString);
    const associatedActsLinks = parseArray(associatedActsLinksString);
    const frequentProducers = parseArray(frequentProducersString);
    const frequentProducersLink = parseArray(frequentProducersLinkString);
    const fansOf = parseArray(fansOfString);
    const fansOfLink = parseArray(fansOfLinkString);

    // Get coordinates
    const getCoordinates = async (city: string) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
      if (!apiKey) throw new Error("OpenCage API key not configured");
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city
      )}&key=${apiKey}&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results?.length > 0) {
        return {
          lat: Number(data.results[0].geometry.lat),
          lng: Number(data.results[0].geometry.lng),
        };
      }
      throw new Error(`Could not find coordinates for: ${city}`);
    };
    const { lat, lng } = await getCoordinates(city);

    // Create rapper
    const result = await createRapper({
      name,
      city,
      state: state || undefined,
      lat,
      lng,
      category,
      artistStatus: artistStatus || undefined,
      website: website || undefined,
      socials: { instagram, youtube, spotify, soundcloud, twitter, appleMusic },
      image: imageData,
      shortBio,
      heroBannerImage: heroBannerImageData,
      heroTags,
      videos,
      definingTracks: definingTracks.map((track) => ({
        ...track,
        year: track.year ? parseInt(track.year.toString(), 10) : undefined,
        image: definingtracksImage,
      })),
      deepDiveNarrative: deepDiveNarrative || "",
      videoEmbed: videoEmbed || undefined,
      videoWidth: videoWidth ? parseInt(videoWidth, 10) : undefined,
      videoHeight: videoHeight ? parseInt(videoHeight, 10) : undefined,
      alsoKnownAs,
      born: born || "",
      origin: origin || "",
      primaryAffiliation: {
        name: primaryAffiliationName || "",
        link: primaryAffiliationLink || "",
      },
      notableCollaborators,
      proteges,
      relatedArtists,
      labelCrew: labelCrew || "",
      labelCrewLink: labelCrewLink || "",
      associatedActs,
      associatedActsLinks,
      district: district || "",
      districtLink: districtLink || "",
      frequentProducers,
      frequentProducersLink,
      breakoutTrack: {
        name: breakoutTrackName || "",
        url: breakoutTrackUrl || "",
      },
      definingProject: {
        name: definingProjectName || "",
        year: definingProjectYear
          ? parseInt(definingProjectYear, 10)
          : undefined,
        link: definingProjectLink || "",
      },
      fansOf,
      fansOfLink,
      yearsActive: {
        start: yearsActiveStart ? parseInt(yearsActiveStart, 10) : undefined,
        end: yearsActiveEnd ? parseInt(yearsActiveEnd, 10) : undefined,
      },
      status: status as "active" | "inactive",
      submittedBy: userId,
    });

    if (!result.success) {
      const statusCode = result.error?.includes("privileges") ? 403 : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(
      { success: true, data: result.data, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error - POST /rappers:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
