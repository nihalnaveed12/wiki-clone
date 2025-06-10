import { getAllUsers } from "@/lib/actions/user.actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const result = await getAllUsers();

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}