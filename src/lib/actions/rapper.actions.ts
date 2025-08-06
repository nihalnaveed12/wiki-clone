import dbConnect from "@/lib/database/mongodb";
import Rapper from '@/lib/database/model/Rappers';
import User from "../database/model/User";
import { auth } from "@clerk/nextjs/server";

interface RapperParams {
    name: string;
    city: string;
    lat: number;
    lng: number;
    category: string;
    socials: {
        instagram?: string;
        twitter?: string;
        youtube?: string;
        spotify?: string;
    };
    image: {
        id: string;
        url: string;
    };
    shortBio: string;
}

interface UpdateRapperParams extends RapperParams {
    _id: string;
}

// Helper function to check if current user is admin
async function checkAdminAccess(): Promise<void> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized: Please sign in');
    }

    await dbConnect();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
        throw new Error('User not found');
    }

    // Use the schema method to check if user is admin
    if (!user.isAdmin()) {
        throw new Error('Access denied: Admin privileges required');
    }
}

export async function createRapper(params: RapperParams) {
    try {
        // Check admin access first
        await checkAdminAccess();

        await dbConnect();

        const rapper = await Rapper.create({
            name: params.name,
            city: params.city,
            lat: params.lat,
            lng: params.lng,
            category: params.category,
            socials: params.socials,
            image: params.image,
            shortBio: params.shortBio,
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(rapper)),
            message: 'Rapper created successfully'
        };
    } catch (error) {
        console.error('Error creating rapper:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create rapper'
        };
    }
}

// Get all rappers (public access)
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

// Update rapper (admin only)
export async function updateRapper(params: UpdateRapperParams) {
    try {
        await checkAdminAccess();
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

// Delete rapper (admin only)
export async function deleteRapper(_id: string) {
    try {
        await checkAdminAccess();
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

// Get single rapper by ID (public access)
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

// Get rappers by city (public access)
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