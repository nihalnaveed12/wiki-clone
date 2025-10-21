// app/api/rappers/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  getRapperById,
  updateRapper,
  deleteRapper,
} from "@/lib/actions/rapper.actions";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@clerk/nextjs/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Helper function to parse array fields
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

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getRapperById(id);

    if (!result.success) {
      const statusCode = result.error === "Rapper not found" ? 404 : 500;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("API Error - GET /rappers/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type");

    let updateData: any = {};

    if (contentType?.includes("application/json")) {
      // JSON request - for fields without files
      updateData = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      // FormData request - for file uploads
      const formData = await request.formData();

      // Basic Fields
      if (formData.has("name")) updateData.name = formData.get("name");
      if (formData.has("city")) updateData.city = formData.get("city");
      if (formData.has("category"))
        updateData.category = formData.get("category");
      if (formData.has("website")) updateData.website = formData.get("website");
      if (formData.has("shortBio"))
        updateData.shortBio = formData.get("shortBio");
      if (formData.has("bio")) updateData.shortBio = formData.get("bio"); // Fallback for 'bio'

      // Socials
      if (formData.has("socials")) {
        updateData.socials = JSON.parse(formData.get("socials") as string);
      } else {
        updateData.socials = {};
        if (formData.has("instagram"))
          updateData.socials.instagram = formData.get("instagram");
        if (formData.has("youtube"))
          updateData.socials.youtube = formData.get("youtube");
        if (formData.has("spotify"))
          updateData.socials.spotify = formData.get("spotify");
        if (formData.has("soundcloud"))
          updateData.socials.soundcloud = formData.get("soundcloud");
      }

      // New Fields
      if (formData.has("audio")) updateData.audio = formData.get("audio");
      if (formData.has("tags"))
        updateData.tags = parseArrayField(formData.get("tags") as string);
      if (formData.has("readMoreLink"))
        updateData.readMoreLink = formData.get("readMoreLink");

      if (formData.has("yearsActive")) {
        updateData.yearsActive = JSON.parse(
          formData.get("yearsActive") as string
        );
      } else {
        if (
          formData.has("yearsActiveStart") ||
          formData.has("yearsActiveEnd")
        ) {
          updateData.yearsActive = {
            start: formData.has("yearsActiveStart")
              ? parseInt(formData.get("yearsActiveStart") as string, 10)
              : undefined,
            end: formData.has("yearsActiveEnd")
              ? parseInt(formData.get("yearsActiveEnd") as string, 10)
              : undefined,
          };
        }
      }

      if (formData.has("status")) updateData.status = formData.get("status");
      if (formData.has("labelCrew"))
        updateData.labelCrew = formData.get("labelCrew");
      if (formData.has("associatedActs"))
        updateData.associatedActs = parseArrayField(
          formData.get("associatedActs") as string
        );
      if (formData.has("district"))
        updateData.district = formData.get("district");
      if (formData.has("frequentProducers"))
        updateData.frequentProducers = parseArrayField(
          formData.get("frequentProducers") as string
        );

      if (formData.has("breakoutTrack")) {
        updateData.breakoutTrack = JSON.parse(
          formData.get("breakoutTrack") as string
        );
      } else {
        if (
          formData.has("breakoutTrackName") ||
          formData.has("breakoutTrackUrl")
        ) {
          updateData.breakoutTrack = {
            name: formData.get("breakoutTrackName") || undefined,
            url: formData.get("breakoutTrackUrl") || undefined,
          };
        }
      }

      if (formData.has("definingProject")) {
        updateData.definingProject = JSON.parse(
          formData.get("definingProject") as string
        );
      } else {
        if (
          formData.has("definingProjectName") ||
          formData.has("definingProjectYear")
        ) {
          updateData.definingProject = {
            name: formData.get("definingProjectName") || undefined,
            year: formData.has("definingProjectYear")
              ? parseInt(formData.get("definingProjectYear") as string, 10)
              : undefined,
          };
        }
      }

      if (formData.has("fansOf"))
        updateData.fansOf = parseArrayField(formData.get("fansOf") as string);

      // Handle image upload
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        try {
          updateData.image = await uploadToCloudinary(imageFile);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          return NextResponse.json(
            { error: "Failed to upload image. Please try again." },
            { status: 500 }
          );
        }
      }
    }

    // Filter out undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const result = await updateRapper({
      _id: id,
      ...updateData,
    });

    if (!result.success) {
      let statusCode = 400;
      if (
        result.error?.includes("Admin privileges required") ||
        result.error?.includes("Unauthorized")
      ) {
        statusCode = 403;
      } else if (result.error?.includes("not found")) {
        statusCode = 404;
      }

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error("API Error - PUT /rappers/[id]:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized: Please sign in" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const result = await deleteRapper(id);

    if (!result.success) {
      let statusCode = 400;
      if (
        result.error?.includes("Admin privileges required") ||
        result.error?.includes("Unauthorized")
      ) {
        statusCode = 403;
      } else if (result.error?.includes("not found")) {
        statusCode = 404;
      }

      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("API Error - DELETE /rappers/[id]:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
