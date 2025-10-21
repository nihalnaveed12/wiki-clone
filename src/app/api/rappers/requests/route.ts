// app/api/rappers/requests/route.ts

import { NextResponse, NextRequest } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createMusicianRequest } from "@/lib/actions/musicianRequest.actions";
import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import User from "@/lib/database/model/User";
import { auth } from "@clerk/nextjs/server";

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
            (error.message.includes("privileges") ||
                error.message.includes("Admin"))
                ? 403
                : 500;

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch requests",
            },
            { status: statusCode }
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
        const imageFile = formData.get("image") as File;

        // Socials
        const instagram = formData.get("instagram") as string;
        const youtube = formData.get("youtube") as string;
        const spotify = formData.get("spotify") as string;
        const soundcloud = formData.get("soundcloud") as string;
        

        // New Fields
        const audio = formData.get("audio") as string;
        const tagsString = formData.get("tags") as string;
        const readMoreLink = formData.get("readMoreLink") as string;
        const yearsActiveStart = formData.get("yearsActiveStart") as string;
        const yearsActiveEnd = formData.get("yearsActiveEnd") as string;
        const labelCrew = formData.get("labelCrew") as string;
        const associatedActsString = formData.get(
            "associatedActs"
        ) as string;
        const district = formData.get("district") as string;
        const frequentProducersString = formData.get(
            "frequentProducers"
        ) as string;
        const breakoutTrackName = formData.get("breakoutTrackName") as string;
        const breakoutTrackUrl = formData.get("breakoutTrackUrl") as string;
        const definingProjectName = formData.get(
            "definingProjectName"
        ) as string;
        const definingProjectYear = formData.get(
            "definingProjectYear"
        ) as string;
        const fansOfString = formData.get("fansOf") as string;

        // Validate required fields
        const requiredFields = [
            { field: "name", value: name },
            
            { field: "city", value: city },
           
            { field: "category", value: category },
            { field: "bio", value: bio },
            { field: "yearsActiveStart", value: yearsActiveStart },
            { field: "breakoutTrackName", value: breakoutTrackName },
            { field: "definingProjectName", value: definingProjectName },
        ];

        const missingFields = requiredFields
            .filter(({ value }) => !value || value.trim() === "")
            .map(({ field }) => field);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    error: `Missing required fields: ${missingFields.join(", ")}`,
                },
                { status: 400 }
            );
        }

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

        // Parse array fields
        const tags = parseArrayField(tagsString);
        const associatedActs = parseArrayField(associatedActsString);
        const frequentProducers = parseArrayField(frequentProducersString);
        const fansOf = parseArrayField(fansOfString);

        // Call createMusicianRequest with all fields
        const result = await createMusicianRequest({
            name: name.trim(),
           
            city: city.trim(),
           
            category: category.trim(),
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
                start: parseInt(yearsActiveStart, 10),
                end: yearsActiveEnd
                    ? parseInt(yearsActiveEnd, 10)
                    : undefined,
            },
            labelCrew: labelCrew?.trim() || undefined,
            associatedActs,
            district: district?.trim() || undefined,
            frequentProducers,
            breakoutTrack: {
                name: breakoutTrackName.trim(),
                url: breakoutTrackUrl?.trim() || undefined,
            },
            definingProject: {
                name: definingProjectName.trim(),
                year: definingProjectYear
                    ? parseInt(definingProjectYear, 10)
                    : undefined,
            },
            fansOf,
            submittedBy: userId,
        });

        if (!result.success) {
            const statusCode =
                result.error?.includes("privileges") ||
                result.error?.includes("Admin")
                    ? 403
                    : 400;
            return NextResponse.json(
                { error: result.error },
                { status: statusCode }
            );
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
                error:
                    error instanceof Error
                        ? error.message
                        : "Internal server error",
            },
            { status: 500 }
        );
    }
}

// ============================================


