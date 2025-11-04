// app/api/rappers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createRapper, getAllRappers } from "@/lib/actions/rapper.actions";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

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
    throw new Error("Unauthorized: Please sign in");
  }

  try {
    const formData = await request.formData();

    // Basic Fields
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const bio = formData.get("bio") as string;
    const category = formData.get("category") as string;
    const website = formData.get("website") as string;
    const artistStatus = formData.get("artistStatus") as string;
    const imageFile = formData.get("image") as File;

    // Socials
    const instagram = formData.get("instagram") as string;
    const youtube = formData.get("youtube") as string;
    const spotify = formData.get("spotify") as string;
    const soundcloud = formData.get("soundcloud") as string;
    const twitter = formData.get("twitter") as string;

    // New Fields
    const audio = formData.get("audio") as string;
    const tagsString = formData.get("tags") as string;
    const readMoreLink = formData.get("readMoreLink") as string;
    const yearsActiveStart = formData.get("yearsActiveStart") as string;
    const yearsActiveEnd = formData.get("yearsActiveEnd") as string;
    const status = formData.get("status") as string;
    const labelCrew = formData.get("labelCrew") as string;
    const labelCrewLink = formData.get("labelCrewLink") as string;
    const associatedActsString = formData.get("associatedActs") as string;
    const associatedActslinks = formData.get("associatedActsLinks") as string;
    const district = formData.get("district") as string;
    const districtLink = formData.get("districtLink") as string;
    const frequentProducersString = formData.get("frequentProducers") as string;
    const frequentProducerslink = formData.get(
      "frequentProducersLink"
    ) as string;
    const breakoutTrackName = formData.get("breakoutTrackName") as string;
    const breakoutTrackUrl = formData.get("breakoutTrackUrl") as string;
    const definingProjectName = formData.get("definingProjectName") as string;
    const definingProjectYear = formData.get("definingProjectYear") as string;
    const definingProjectLink = formData.get("definingProjectLink") as string;
    const fansOfString = formData.get("fansOf") as string;
    const fansOflink = formData.get("fansOfLink") as string;

    // ✅ New YouTube Embed Fields (optional)
    const videoEmbed = formData.get("videoEmbed") as string;
    const videoWidth = formData.get("videoWidth") as string;
    const videoHeight = formData.get("videoHeight") as string;

    // Validate required fields
    const requiredFields = [
      { field: "name", value: name },
      { field: "city", value: city },
      { field: "category", value: category },
      { field: "bio", value: bio },
    ];

    const missingFields = requiredFields
      .filter(({ value }) => !value || value.trim() === "")
      .map(({ field }) => field);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Parse array fields
    const parseArray = (input: string): string[] => {
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

    const tags = parseArray(tagsString);
    const associatedActs = parseArray(associatedActsString);
    const associatedActsLinks = parseArray(associatedActslinks);
    const frequentProducers = parseArray(frequentProducersString);
    const frequentProducersLink = parseArray(frequentProducerslink);
    const fansOf = parseArray(fansOfString);
    const fansOfLink = parseArray(fansOflink);

    // Handle image upload
    let imageData = { id: "", url: "" };
    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
      try {
        imageData = await uploadToCloudinary(imageFile);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }
    }

    // Get coordinates from city
    const getCoordinates = async (city: string) => {
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
      if (!apiKey) {
        throw new Error("OpenCage API key is not configured.");
      }

      const query = city.trim();
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}&limit=1`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.results?.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat: Number(lat), lng: Number(lng) };
      }

      throw new Error(`Could not find coordinates for: ${query}`);
    };

    const { lat, lng } = await getCoordinates(city);

    // Create rapper record
    const result = await createRapper({
      name: name.trim(),
      city: city.trim(),
      lat,
      lng,
      category: category.trim(),
      artistStatus: artistStatus?.trim() || undefined,
      website: website?.trim() || undefined,
      socials: {
        instagram: instagram?.trim() || undefined,
        youtube: youtube?.trim() || undefined,
        spotify: spotify?.trim() || undefined,
        soundcloud: soundcloud?.trim() || undefined,
        twitter: twitter?.trim() || undefined,
      },
      image: imageData,
      shortBio: bio.trim(),
      audio: audio?.trim() || undefined,
      tags,
      readMoreLink: readMoreLink?.trim() || undefined,
      yearsActive: {
        start: yearsActiveStart ? parseInt(yearsActiveStart, 10) : undefined,
        end: yearsActiveEnd ? parseInt(yearsActiveEnd, 10) : undefined,
      },
      status: (status || "active") as "active" | "inactive",
      labelCrew: labelCrew?.trim() || undefined,
      labelCrewLink: labelCrewLink?.trim() || undefined,
      associatedActs,
      associatedActsLinks,
      district: district?.trim() || undefined,
      districtLink: districtLink?.trim() || undefined,
      frequentProducers,
      frequentProducersLink,
      breakoutTrack: {
        name: breakoutTrackName?.trim() || undefined,
        url: breakoutTrackUrl?.trim() || undefined,
      },
      definingProject: {
        name: definingProjectName?.trim() || undefined,
        year: definingProjectYear
          ? parseInt(definingProjectYear, 10)
          : undefined,
        link: definingProjectLink?.trim() || undefined,
      },
      fansOf,
      fansOfLink,
      submittedBy: userId,

      // ✅ New video fields
      videoEmbed: videoEmbed?.trim() || "",
      videoWidth: videoWidth ? parseInt(videoWidth, 10) : 560,
      videoHeight: videoHeight ? parseInt(videoHeight, 10) : 315,
    });

    if (!result.success) {
      const statusCode =
        result.error?.includes("privileges") || result.error?.includes("Admin")
          ? 403
          : 400;
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
