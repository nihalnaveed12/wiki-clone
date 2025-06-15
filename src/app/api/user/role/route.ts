// app/api/user/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import User from '@/lib/database/model/User';
import dbConnect from '@/lib/database/mongodb';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { userId } = await auth();
        console.log(request)
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ role: user.role }, { status: 200 });
    } catch (error) {
        console.error('Error getting user role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}