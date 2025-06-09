// /api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/database/model/User';
import dbConnect from '@/lib/database/mongodb';

const ADMIN_EMAIL = 'abdulsamadsiddiqui2000@gmail.com';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        console.log(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find user by clerkId
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user should be admin based on email and update if necessary
        if (user.email === ADMIN_EMAIL && user.role !== 'admin') {
            user = await User.findByIdAndUpdate(
                user._id,
                { role: 'admin' },
                { new: true }
            );
        }

        return NextResponse.json({
            role: user.role,
            email: user.email,
            isAdmin: user.role === 'admin' || user.email === ADMIN_EMAIL
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}