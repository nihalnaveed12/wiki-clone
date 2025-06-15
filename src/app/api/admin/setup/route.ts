import { NextResponse } from 'next/server';
import { ensureMainAdminRole } from '@/lib/utils/admin';

export async function GET() {
    await ensureMainAdminRole();
    return NextResponse.json({ message: 'Main admin role ensured' }, { status: 200 });
}