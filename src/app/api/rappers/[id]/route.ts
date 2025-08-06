import { NextRequest, NextResponse } from 'next/server';
import { getRapperById, updateRapper, deleteRapper } from '@/lib/actions/rapper.actions';

interface RouteParams {
    params: {
        id: string;
    };
}

// GET - Get single rapper by ID (public)
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const result = await getRapperById(params.id);

        if (!result.success) {
            const statusCode = result.error === 'Rapper not found' ? 404 : 500;
            return NextResponse.json(
                { error: result.error },
                { status: statusCode }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });
    } catch (error) {
        console.error('API Error - GET /rappers/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update rapper (admin only)
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const body = await request.json();

        const result = await updateRapper({
            _id: params.id,
            ...body
        });

        if (!result.success) {
            let statusCode = 400;
            if (result.error?.includes('Admin privileges required') ||
                result.error?.includes('Unauthorized')) {
                statusCode = 403;
            } else if (result.error?.includes('not found')) {
                statusCode = 404;
            }

            return NextResponse.json(
                { error: result.error },
                { status: statusCode }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data,
            message: result.message
        });
    } catch (error) {
        console.error('API Error - PUT /rappers/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete rapper (admin only)
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const result = await deleteRapper(params.id);

        if (!result.success) {
            let statusCode = 400;
            if (result.error?.includes('Admin privileges required') ||
                result.error?.includes('Unauthorized')) {
                statusCode = 403;
            } else if (result.error?.includes('not found')) {
                statusCode = 404;
            }

            return NextResponse.json(
                { error: result.error },
                { status: statusCode }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error('API Error - DELETE /rappers/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
