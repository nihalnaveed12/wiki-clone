// app/api/admin/delete-blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import Blog from '@/lib/database/model/Blogs';
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

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('id');

        if (!blogId) {
            return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
        }

        // Check if user is admin
        const isAdmin = await isUserAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        // Get the blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Delete image from Cloudinary if exists
        if (blog.image.id) {
            await deleteFromCloudinary(blog.image.id);
        }

        // Delete the blog
        await Blog.findByIdAndDelete(blogId);

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}