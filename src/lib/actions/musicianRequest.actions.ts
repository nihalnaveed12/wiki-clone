import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import Rapper from "@/lib/database/model/Rappers";
import User from "../database/model/User";
import { auth } from "@clerk/nextjs/server";

interface MusicianRequestParams {
    name: string;
    city: string;
    country: string;
    address: string;
    category: string;
    website?: string;
    socials: {
        instagram?: string;
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
    submittedBy?: string;
}

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

async function getCoordinates(address: string, city: string, country: string) {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    if (!apiKey) {
        throw new Error("OpenCage API key is not configured.");
    }

    const query = `${address}, ${city}, ${country}`.trim();
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=1`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.results && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry;
            return { lat: Number(lat), lng: Number(lng) };
        } else {
            const fallbackQuery = `${city}, ${country}`;
            const fallbackUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fallbackQuery)}&key=${apiKey}&limit=1`;

            const fallbackRes = await fetch(fallbackUrl);
            const fallbackData = await fallbackRes.json();

            if (fallbackData.results && fallbackData.results.length > 0) {
                const { lat, lng } = fallbackData.results[0].geometry;
                return { lat: Number(lat), lng: Number(lng) };
            }
        }

        throw new Error(`Could not find coordinates for: ${query}`);
    } catch (error) {
        console.error("Geocoding API Error:", error);
        throw new Error(`Failed to fetch coordinates for "${query}". Please verify the address is correct.`);
    }
}

// Create a new musician request (for public users)
export async function createMusicianRequest(params: MusicianRequestParams) {
    try {
        await dbConnect();

        // Check if a request with this name already exists and is pending
        const existingRequest = await MusicianRequest.findOne({
            name: params.name,
            status: 'pending'
        });

        if (existingRequest) {
            throw new Error("A request for this musician name is already pending approval");
        }

        // Check if musician already exists in approved collection
        const existingRapper = await Rapper.findOne({ name: params.name });
        if (existingRapper) {
            throw new Error("A musician with this name already exists");
        }

        const request = await MusicianRequest.create({
            name: params.name,
            city: params.city,
            country: params.country,
            address: params.address,
            category: params.category,
            website: params.website || '',
            socials: {
                instagram: params.socials.instagram || '',
                youtube: params.socials.youtube || '',
                spotify: params.socials.spotify || '',
                soundcloud: params.socials.soundcloud || '',
            },
            image: params.image,
            shortBio: params.shortBio,
            submittedBy: params.submittedBy || '',
            status: 'pending',
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(request)),
            message: "Musician request submitted successfully! It will be reviewed by an admin.",
        };
    } catch (error) {
        console.error("Error creating musician request:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to submit musician request",
        };
    }
}

// Get all pending requests (admin only)
export async function getAllMusicianRequests() {
    try {
        await checkAdminAccess();
        await dbConnect();

        const requests = await MusicianRequest.find({})
            .sort({ createdAt: -1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(requests))
        };
    } catch (error) {
        console.error('Error fetching musician requests:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch requests'
        };
    }
}

// Approve a musician request (admin only)
export async function approveMusicianRequest(_id: string) {
    try {
        await checkAdminAccess();
        await dbConnect();

        const { userId } = await auth();
        const request = await MusicianRequest.findById(_id);

        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== 'pending') {
            throw new Error('Request has already been processed');
        }

        // Get coordinates for the address
        const { lat, lng } = await getCoordinates(
            request.address,
            request.city,
            request.country
        );

        // Create the rapper in the main collection
        const rapper = await Rapper.create({
            name: request.name,
            city: request.city,
            address: request.address,
            lat,
            lng,
            category: request.category,
            website: request.website || '',
            socials: {
                instagram: request.socials.instagram || '',
                youtube: request.socials.youtube || '',
                spotify: request.socials.spotify || '',
                soundcloud: request.socials.soundcloud || '',
                twitter: '',
            },
            image: request.image,
            shortBio: request.shortBio,
        });

        // Update the request status
        await MusicianRequest.findByIdAndUpdate(_id, {
            status: 'approved',
            reviewedBy: userId,
            reviewedAt: new Date(),
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rapper)),
            message: 'Musician request approved and added successfully',
        };
    } catch (error) {
        console.error('Error approving musician request:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to approve request',
        };
    }
}

// Reject a musician request (admin only)
export async function rejectMusicianRequest(_id: string, rejectionReason?: string) {
    try {
        await checkAdminAccess();
        await dbConnect();

        const { userId } = await auth();
        const request = await MusicianRequest.findById(_id);

        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== 'pending') {
            throw new Error('Request has already been processed');
        }

        await MusicianRequest.findByIdAndUpdate(_id, {
            status: 'rejected',
            reviewedBy: userId,
            reviewedAt: new Date(),
            rejectionReason: rejectionReason || '',
        });

        return {
            success: true,
            message: 'Musician request rejected',
        };
    } catch (error) {
        console.error('Error rejecting musician request:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reject request',
        };
    }
}