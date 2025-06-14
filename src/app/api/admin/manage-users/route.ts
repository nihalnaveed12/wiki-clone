import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/database/model/User';
import dbConnect from '@/lib/database/mongodb';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;

async function isUserAdmin(userId: string): Promise<boolean> {
    try {
        const user = await User.findOne({ clerkId: userId });
        return user?.email === ADMIN_EMAIL || user?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Update user role
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Check if current user is admin
        const isAdmin = await isUserAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const { targetUserId, newRole } = await request.json();

        if (!targetUserId || !newRole) {
            return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
        }

        if (newRole !== 'admin' && newRole !== 'user') {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // If promoting to admin, check if we already have 3 admins
        if (newRole === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount >= 3) {
                return NextResponse.json({
                    error: 'Cannot have more than 3 admins'
                }, { status: 400 });
            }
        }

        // Find and update the user
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Prevent demoting the main admin (ADMIN_EMAIL)
        if (targetUser.email === ADMIN_EMAIL && newRole === 'user') {
            return NextResponse.json({
                error: 'Cannot demote the main admin'
            }, { status: 400 });
        }

        // Update the user role
        await User.findByIdAndUpdate(targetUserId, { role: newRole });

        return NextResponse.json({
            success: true,
            message: `User role updated to ${newRole}`
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}