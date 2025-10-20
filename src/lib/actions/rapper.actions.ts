// @lib/actions/rapper.actions.ts

import dbConnect from "@/lib/database/mongodb";
import Rapper from "@/lib/database/model/Rappers";
import User from "../database/model/User";
import { auth } from "@clerk/nextjs/server";

interface RapperParams {
    name: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    category: string;
    website?: string;
    socials: {
        instagram?: string;
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
        twitter?: string;
    };
    image: {
        id: string;
        url: string;
    };
    audio?: string;
    shortBio: string;
    tags: string[];
    readMoreLink?: string;
    yearsActive: {
        start: number;
        end?: number;
    };
    status: 'active' | 'inactive';
    labelCrew?: string;
    associatedActs: string[];
    district?: string;
    frequentProducers: string[];
    breakoutTrack: {
        name: string;
        url?: string;
    };
    definingProject: {
        name: string;
        year?: number;
    };
    fansOf: string[];
    submittedBy: string;
}

interface UpdateRapperParams extends Omit<RapperParams, 'lat' | 'lng'> {
    _id: string;
    lat?: number;
    lng?: number;
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

async function checkAdminOrOwnerAccess(rapperId: string): Promise<void> {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized: Please sign in");
    }

    await dbConnect();
    const user = await User.findOne({ clerkId: userId });
    const rapper = await Rapper.findById(rapperId);

    if (!rapper) {
        throw new Error("Rapper not found");
    }

    if (user?.isAdmin && typeof user.isAdmin === "function" && user.isAdmin()) {
        return;
    }

    if (rapper.submittedBy === userId) {
        return;
    }

    throw new Error("Access denied: You are not allowed to perform this action");
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
            console.log(`Geocoded location: ${query} -> ${lat}, ${lng}`);
            return { lat: Number(lat), lng: Number(lng) };
        } else {
            const fallbackQuery = `${city}, ${country}`;
            const fallbackUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fallbackQuery)}&key=${apiKey}&limit=1`;

            const fallbackRes = await fetch(fallbackUrl);
            const fallbackData = await fallbackRes.json();

            if (fallbackData.results && fallbackData.results.length > 0) {
                const { lat, lng } = fallbackData.results[0].geometry;
                console.log(`Fallback geocoded location: ${fallbackQuery} -> ${lat}, ${lng}`);
                return { lat: Number(lat), lng: Number(lng) };
            }
        }

        throw new Error(`Could not find coordinates for: ${query}`);
    } catch (error) {
        console.error("Geocoding API Error:", error);
        throw new Error(`Failed to fetch coordinates for "${query}". Please verify the address is correct.`);
    }
}

export async function createRapper(params: RapperParams) {
    try {
        await checkAdminAccess();
        await dbConnect();

        const existingRapper = await Rapper.findOne({ name: params.name });
        if (existingRapper) {
            throw new Error("A rapper with this name already exists");
        }

        const rapper = await Rapper.create({
            name: params.name,
            city: params.city,
            address: params.address,
            lat: params.lat,
            lng: params.lng,
            category: params.category,
            website: params.website || '',
            socials: {
                instagram: params.socials.instagram || '',
                youtube: params.socials.youtube || '',
                spotify: params.socials.spotify || '',
                soundcloud: params.socials.soundcloud || '',
                twitter: params.socials.twitter || '',
            },
            image: params.image,
            shortBio: params.shortBio,
            audio: params.audio || '',
            tags: params.tags || [],
            readMoreLink: params.readMoreLink || '',
            yearsActive: {
                start: params.yearsActive.start,
                end: params.yearsActive.end || null,
            },
            status: params.status || 'active',
            labelCrew: params.labelCrew || '',
            associatedActs: params.associatedActs || [],
            district: params.district || '',
            frequentProducers: params.frequentProducers || [],
            breakoutTrack: {
                name: params.breakoutTrack.name,
                url: params.breakoutTrack.url || '',
            },
            definingProject: {
                name: params.definingProject.name,
                year: params.definingProject.year || null,
            },
            fansOf: params.fansOf || [],
            submittedBy: params.submittedBy,
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rapper)),
            message: "Rapper created successfully",
        };
    } catch (error) {
        console.error("Error creating rapper:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create rapper",
        };
    }
}

export async function getAllRappers() {
    try {
        await dbConnect();
        const rappers = await Rapper.find({}).sort({ createdAt: -1 });
        return {
            success: true,
            data: JSON.parse(JSON.stringify(rappers))
        };
    } catch (error) {
        console.error('Error fetching rappers:', error);
        return {
            success: false,
            error: 'Failed to fetch rappers'
        };
    }
}

export async function updateRapper(params: UpdateRapperParams) {
    try {
        await checkAdminOrOwnerAccess(params._id);
        await dbConnect();

        const { _id, ...updateData } = params;

        const rapper = await Rapper.findByIdAndUpdate(
            _id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!rapper) {
            throw new Error('Rapper not found');
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rapper)),
            message: 'Rapper updated successfully'
        };
    } catch (error) {
        console.error('Error updating rapper:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update rapper'
        };
    }
}

export async function deleteRapper(_id: string) {
    try {
        await checkAdminOrOwnerAccess(_id);
        await dbConnect();

        const rapper = await Rapper.findByIdAndDelete(_id);

        if (!rapper) {
            throw new Error('Rapper not found');
        }

        return {
            success: true,
            message: 'Rapper deleted successfully'
        };
    } catch (error) {
        console.error('Error deleting rapper:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete rapper'
        };
    }
}

export async function getRapperById(_id: string) {
    try {
        await dbConnect();

        const rapper = await Rapper.findById(_id);

        if (!rapper) {
            return {
                success: false,
                error: 'Rapper not found'
            };
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rapper))
        };
    } catch (error) {
        console.error('Error fetching rapper:', error);
        return {
            success: false,
            error: 'Failed to fetch rapper'
        };
    }
}

export async function getRappersByCity(city: string) {
    try {
        await dbConnect();

        const rappers = await Rapper.find({
            city: new RegExp(city, 'i')
        }).sort({ createdAt: -1 });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rappers))
        };
    } catch (error) {
        console.error('Error fetching rappers by city:', error);
        return {
            success: false,
            error: 'Failed to fetch rappers'
        };
    }
}