import { NextResponse, NextRequest } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createMusicianRequest } from "@/lib/actions/musicianRequest.actions";
import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import User from "@/lib/database/model/User";
import { auth } from "@clerk/nextjs/server";

// Check admin access
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

// Parse array fields from string format
function parseArrayField(fieldString: string): string[] {
  if (!fieldString) return [];
  try {
    return JSON.parse(fieldString);
  } catch {
    return fieldString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

export async function GET() {
  try {
    await checkAdminAccess();
    await dbConnect();

    const requests = await MusicianRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching musician requests:", error);
    const statusCode =
      error instanceof Error &&
      (error.message.includes("privileges") || error.message.includes("Admin"))
        ? 403
        : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch requests",
      },
      { status: statusCode }
    );
  }
}

// ✅ POST: Create new musician request
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized: Please sign in");

  try {
    const formData = await request.formData();

    // Basic fields
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const bio = formData.get("bio") as string;
    const category = formData.get("category") as string;
    const artistStatus = formData.get("artistStatus") as string;
    const website = formData.get("website") as string;
    const imageFile = formData.get("image") as File;

    // Socials
    const instagram = formData.get("instagram") as string;
    const youtube = formData.get("youtube") as string;
    const spotify = formData.get("spotify") as string;
    const soundcloud = formData.get("soundcloud") as string;

    // New video fields (✅ added)
    const videoEmbed = formData.get("videoEmbed") as string;
    const videoWidth = formData.get("videoWidth") as string;
    const videoHeight = formData.get("videoHeight") as string;

    // Other optional fields
    const audio = formData.get("audio") as string;
    const tagsString = formData.get("tags") as string;
    const readMoreLink = formData.get("readMoreLink") as string;
    const yearsActiveStart = formData.get("yearsActiveStart") as string;
    const yearsActiveEnd = formData.get("yearsActiveEnd") as string;
    const labelCrew = formData.get("labelCrew") as string;
    const labelCrewLink = formData.get("labelCrewLink") as string;
    const associatedActsString = formData.get("associatedActs") as string;
    const associatedActslink = formData.get("associatedActsLinks") as string;
    const districtLink = formData.get("districtLink") as string;
    const district = formData.get("district") as string;
    const frequentProducersString = formData.get("frequentProducers") as string;
    const frequentProducersStringLink = formData.get(
      "frequentProducersLink"
    ) as string;
    const breakoutTrackName = formData.get("breakoutTrackName") as string;
    const breakoutTrackUrl = formData.get("breakoutTrackUrl") as string;
    const definingProjectName = formData.get("definingProjectName") as string;
    const definingProjectLink = formData.get("definingProjectLink") as string;
    const definingProjectYear = formData.get("definingProjectYear") as string;
    const fansOfString = formData.get("fansOf") as string;
    const fansOfStringLink = formData.get("fansOfLink") as string;

    // Required field check
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

    // Image upload
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

    // Parse array fields
    const tags = parseArrayField(tagsString);
    const associatedActs = parseArrayField(associatedActsString);
    const associatedActsLinks = parseArrayField(associatedActslink);
    const frequentProducers = parseArrayField(frequentProducersString);
    const frequentProducersLink = parseArrayField(frequentProducersStringLink);
    const fansOf = parseArrayField(fansOfString);
    const fansOfLink = parseArrayField(fansOfStringLink);

    // ✅ Create musician request
    const result = await createMusicianRequest({
      name: name.trim(),
      city: city.trim(),
      state: state?.trim() || undefined,
      category: category.trim(),
      artistStatus: artistStatus?.trim() || undefined,
      shortBio: bio.trim(),
      website: website?.trim() || undefined,
      image: imageData,
      socials: {
        instagram: instagram?.trim() || undefined,
        youtube: youtube?.trim() || undefined,
        spotify: spotify?.trim() || undefined,
        soundcloud: soundcloud?.trim() || undefined,
      },
      audio: audio?.trim() || undefined,
      tags,
      readMoreLink: readMoreLink?.trim() || undefined,
      yearsActive: {
        start: yearsActiveStart ? parseInt(yearsActiveStart, 10) : undefined,
        end: yearsActiveEnd ? parseInt(yearsActiveEnd, 10) : undefined,
      },
      labelCrew: labelCrew?.trim() || undefined,
      labelCrewLink: labelCrewLink?.trim() || undefined,
      associatedActs: associatedActs || undefined,
      associatedActsLinks: associatedActsLinks || undefined,
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
        link: definingProjectLink?.trim() || undefined,
        year: definingProjectYear
          ? parseInt(definingProjectYear, 10)
          : undefined,
      },
      fansOf,
      fansOfLink,
      // ✅ include new video fields

      videoEmbed: videoEmbed?.trim() || "",
      videoWidth: videoWidth ? parseInt(videoWidth, 10) : 560,
      videoHeight: videoHeight ? parseInt(videoHeight, 10) : 315,

      submittedBy: userId,
    });

    if (!result.success) {
      const statusCode =
        result.error?.includes("privileges") || result.error?.includes("Admin")
          ? 403
          : 400;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: result.message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error - POST /rappers/requests:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
