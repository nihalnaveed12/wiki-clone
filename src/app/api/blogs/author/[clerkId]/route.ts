import { NextRequest, NextResponse } from 'next/server';
import { getBlogsByAuthor } from '@/lib/actions/blog.actions';

export async function GET(
    request: NextRequest,
    { params }: { params: { clerkId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const result = await getBlogsByAuthor(params.clerkId, page, limit);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}