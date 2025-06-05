import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { updateBlog } from '@/lib/actions/blog.actions';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import Blog from '@/lib/database/model/Blogs';
import User from '@/lib/database/model/User';
import dbConnect from '@/lib/database/mongodb';

// GET single blog by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const blog = await Blog.findById(await (params.id))
            .populate('author', 'firstName lastName email username photo clerkId');

        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ blog: JSON.parse(JSON.stringify(blog)) }, { status: 200 });
    } catch (error) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// UPDATE blog
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Check if user owns this blog
        const existingBlog = await Blog.findById(params.id).populate('author');

        if (!existingBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        if (existingBlog.author.clerkId !== userId) {
            return NextResponse.json({ error: 'Forbidden - You can only edit your own posts' }, { status: 403 });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File;
        const tags = formData.get('tags') as string;
        const published = formData.get('published') === 'true';
        const removeImage = formData.get('removeImage') === 'true';

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        let imageData = existingBlog.image;

        // Handle image removal
        if (removeImage && existingBlog.image.id) {
            await deleteFromCloudinary(existingBlog.image.id);
            imageData = { id: '', url: '' };
        }

        // Handle new image upload
        if (image && image.size > 0) {
            // Delete old image if exists
            if (existingBlog.image.id) {
                await deleteFromCloudinary(existingBlog.image.id);
            }
            imageData = await uploadToCloudinary(image);
        }

        const updatedBlog = await updateBlog({
            blogId: params.id,
            title,
            content,
            image: imageData,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            published,
        });

        return NextResponse.json({ success: true, blog: updatedBlog }, { status: 200 });
    } catch (error) {
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE blog
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Get current user
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get the blog
        const blog = await Blog.findById(params.id).populate('author');
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        // Check permissions - only author or admin can delete
        const isAuthor = blog.author.clerkId === userId;
        const isAdmin = currentUser.role === 'admin'; // Assuming you have role field in User model

        if (!isAuthor && !isAdmin) {
            return NextResponse.json({
                error: 'Forbidden - You can only delete your own posts'
            }, { status: 403 });
        }

        // Delete image from Cloudinary if exists
        if (blog.image.id) {
            await deleteFromCloudinary(blog.image.id);
        }

        // Delete the blog
        await Blog.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true, message: 'Blog deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}