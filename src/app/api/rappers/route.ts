import { NextRequest, NextResponse } from 'next/server';
import { createRapper, getAllRappers } from '@/lib/actions/rapper.actions';

export async function GET() {
    try {
        const result = await getAllRappers();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error('API Error - GET /rappers:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const requiredFields = ['name', 'city', 'lat', 'lng', 'category', 'image', 'shortBio'];
        const missingFields = requiredFields.filter(field => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(', ')}` },
                { status: 400 }
            );
        }

        const result = await createRapper(body);

        if (!result.success) {
            const statusCode = result.error?.includes('Admin privileges required') ||
                result.error?.includes('Unauthorized') ? 403 : 400;

            return NextResponse.json(
                { error: result.error },
                { status: statusCode }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: result.message
        }, { status: 201 });
    } catch (error) {
        console.error('API Error - POST /rappers:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}