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

    const name = formData.get("name") as string;
    const country = formData.get("country") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const bio = formData.get("bio") as string; // Form sends 'bio'
    const category = formData.get("category") as string;
    const website = formData.get("website") as string;
    const imageFile = formData.get("image") as File;

    const instagram = formData.get("instagram") as string;
    const youtube = formData.get("youtube") as string;
    const spotify = formData.get("spotify") as string;
    const audio = formData.get("audio") as string;
    const soundcloud = formData.get("soundcloud") as string;

    const requiredFields = [
      { field: "name", value: name },
      { field: "country", value: country },
      { field: "city", value: city },
      { field: "address", value: address },
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

    const result = await createRapper({
      name: name.trim(),
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      category: category.trim(),
      shortBio: bio.trim(),
      website: website?.trim() || undefined,
      image: imageData,
      audio: audio?.trim() || undefined,
      socials: {
        instagram: instagram?.trim() || undefined,
        youtube: youtube?.trim() || undefined,
        spotify: spotify?.trim() || undefined,
        soundcloud: soundcloud?.trim() || undefined,
      },
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
      { success: true, data: result.data, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error - POST /rappers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
