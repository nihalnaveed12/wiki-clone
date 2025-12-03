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
  params: Promise<{ id: string }>;
}

// Helper to parse array fields (JSON string or comma-separated)
function parseArrayField(fieldString: string | null): string[] {
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

    return NextResponse.json({ success: true, data: result.data });
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
      updateData = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      // Basic Fields
      const basicFields = [
        "name",
        "city",
        "state",
        "category",
        "website",
        "artistStatus",
        "shortBio",
        "bio",
      ];
      basicFields.forEach((field) => {
        if (formData.has(field)) {
          updateData[field === "bio" ? "shortBio" : field] = (
            formData.get(field) as string
          )?.trim();
        }
      });

      // Socials
      updateData.socials = updateData.socials || {};
      [
        "instagram",
        "youtube",
        "spotify",
        "soundcloud",
        "twitter",
        "appleMusic",
      ].forEach((field) => {
        if (formData.has(field))
          updateData.socials[field] = (formData.get(field) as string)?.trim();
      });

      // Hero Section
      if (formData.has("heroTags"))
        updateData.heroTags = parseArrayField(
          formData.get("heroTags") as string
        );
      if (formData.has("heroBannerImage")) {
        const heroFile = formData.get("heroBannerImage") as File;
        if (heroFile?.size && heroFile.name !== "undefined") {
          updateData.heroBannerImage = await uploadToCloudinary(heroFile);
        }
      }

      // Media Hub
      if (formData.has("videos")) {
        const videosString = formData.get("videos") as string;
        updateData.videos = videosString ? JSON.parse(videosString) : [];
      }

      if (formData.has("definingTracks")) {
        const definingTracksString = formData.get("definingTracks") as string;
        const parsedDefiningTracks: {
          title?: string;
          year?: string;
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
        updateData.definingTracks = processedDefiningTracks;
      }
      if (formData.has("deepDiveNarrative"))
        updateData.deepDiveNarrative = (
          formData.get("deepDiveNarrative") as string
        )?.trim();
      if (formData.has("videoEmbed")) {
        updateData.videoEmbed = (formData.get("videoEmbed") as string)?.trim();
      }
      if (formData.has("videoWidth")) {
        const videoWidth = formData.get("videoWidth") as string;
        if (videoWidth) {
          updateData.videoWidth = parseInt(videoWidth, 10);
        }
      }
      if (formData.has("videoHeight")) {
        const videoHeight = formData.get("videoHeight") as string;
        if (videoHeight) {
          updateData.videoHeight = parseInt(videoHeight, 10);
        }
      }

      // At-a-Glance Details
      [
        "alsoKnownAs",
        "notableCollaborators",
        "proteges",
        "relatedArtists",
        "associatedActs",
        "associatedActsLinks",
        "frequentProducers",
        "frequentProducersLink",
        "fansOf",
        "fansOfLink",
      ].forEach((field) => {
        if (formData.has(field))
          updateData[field] = parseArrayField(formData.get(field) as string);
      });

      [
        "born",
        "origin",
        "labelCrew",
        "labelCrewLink",
        "district",
        "districtLink",
      ].forEach((field) => {
        if (formData.has(field))
          updateData[field] = (formData.get(field) as string)?.trim();
      });

      if (
        formData.has("primaryAffiliationName") ||
        formData.has("primaryAffiliationLink")
      ) {
        updateData.primaryAffiliation = {
          name:
            (formData.get("primaryAffiliationName") as string)?.trim() || "",
          link:
            (formData.get("primaryAffiliationLink") as string)?.trim() || "",
        };
      }

      // Breakout Track
      if (formData.has("breakoutTrack")) {
        updateData.breakoutTrack = JSON.parse(
          formData.get("breakoutTrack") as string
        );
      } else if (
        formData.has("breakoutTrackName") ||
        formData.has("breakoutTrackUrl")
      ) {
        updateData.breakoutTrack = {
          name: (formData.get("breakoutTrackName") as string)?.trim(),
          url: (formData.get("breakoutTrackUrl") as string)?.trim(),
        };
      }

      // Defining Project
      if (formData.has("definingProject")) {
        updateData.definingProject = JSON.parse(
          formData.get("definingProject") as string
        );
      } else if (
        formData.has("definingProjectName") ||
        formData.has("definingProjectYear") ||
        formData.has("definingProjectLink")
      ) {
        updateData.definingProject = {
          name: (formData.get("definingProjectName") as string)?.trim(),
          year: formData.has("definingProjectYear")
            ? parseInt(formData.get("definingProjectYear") as string, 10)
            : undefined,
          link: (formData.get("definingProjectLink") as string)?.trim(),
        };
      }

      // Years Active
      if (formData.has("yearsActive")) {
        updateData.yearsActive = JSON.parse(
          formData.get("yearsActive") as string
        );
      } else if (
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

      // Status
      if (formData.has("status"))
        updateData.status = (formData.get("status") as string)?.trim();

      // Image
      const imageFile = formData.get("image") as File;
      if (imageFile?.size && imageFile.name !== "undefined") {
        updateData.image = await uploadToCloudinary(imageFile);
      }
    }

    // Remove undefined keys
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const result = await updateRapper({ _id: id, ...updateData });

    if (!result.success) {
      let statusCode = 400;
      if (
        result.error?.includes("Admin privileges") ||
        result.error?.includes("Unauthorized")
      )
        statusCode = 403;
      else if (result.error?.includes("not found")) statusCode = 404;
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
  if (!userId)
    return NextResponse.json(
      { error: "Unauthorized: Please sign in" },
      { status: 401 }
    );

  try {
    const { id } = await params;
    const result = await deleteRapper(id);

    if (!result.success) {
      let statusCode = 400;
      if (
        result.error?.includes("Admin privileges") ||
        result.error?.includes("Unauthorized")
      )
        statusCode = 403;
      else if (result.error?.includes("not found")) statusCode = 404;
      return NextResponse.json({ error: result.error }, { status: statusCode });
    }

    return NextResponse.json({ success: true, message: result.message });
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
