import { auth } from '@clerk/nextjs/server';
import { createUser } from '@/lib/actions/user.actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userData = await req.json();

        if (userId !== userData.clerkId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await createUser(userData);

        return NextResponse.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Error syncing user:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}