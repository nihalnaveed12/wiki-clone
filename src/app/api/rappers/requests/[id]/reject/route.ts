import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/database/mongodb";
import MusicianRequest from "@/lib/database/model/MusicianRequest";
import User from "@/lib/database/model/User";

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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await checkAdminAccess();
        await dbConnect();

        const { userId } = await auth();
        const { id: requestId } = await params;
        const body = await request.json();
        const { rejectionReason } = body;

        const musicianRequest = await MusicianRequest.findById(requestId);

        if (!musicianRequest) {
            return NextResponse.json(
                { success: false, error: 'Request not found' },
                { status: 404 }
            );
        }

        if (musicianRequest.status !== 'pending') {
            return NextResponse.json(
                { success: false, error: 'Request has already been processed' },
                { status: 400 }
            );
        }

        await MusicianRequest.findByIdAndUpdate(requestId, {
            status: 'rejected',
            reviewedBy: userId,
            reviewedAt: new Date(),
            rejectionReason: rejectionReason || '',
        });

        return NextResponse.json({
            success: true,
            message: 'Musician request rejected',
        });
    } catch (error) {
        console.error('Error rejecting musician request:', error);
        const statusCode = error instanceof Error &&
            (error.message.includes("privileges") || error.message.includes("Admin")) ? 403 : 500;

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reject request',
        }, { status: statusCode });
    }
}