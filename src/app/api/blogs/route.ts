import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createBlog, getAllBlogs } from '@/lib/actions/blog.actions';
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const image = formData.get('image') as File;
        const tags = formData.get('tags') as string;
        const published = formData.get('published') === 'true';
        const bornDate = formData.get('bornDate') as string;
        const bornPlace = formData.get('bornPlace') as string;
        const diedDate = formData.get('diedDate') as string;
        const diedPlace = formData.get('diedPlace') as string;
        const occupation = formData.get('occupation') as string;
        const spouses = formData.get('spouses') as string;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        let imageData = { id: '', url: '' };

        if (image && image.size > 0) {
            imageData = await uploadToCloudinary(image);
        }

        const blog = await createBlog({
            title,
            content,
            image: imageData,
            authorClerkId: userId,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            published,
            bornDate: bornDate || '',
            bornPlace: bornPlace || '',
            diedDate: diedDate || '',
            diedPlace: diedPlace || '',
            occupation: occupation || '',
            spouses: spouses || '',
        });

        return NextResponse.json({ success: true, blog }, { status: 201 });
    } catch (error) {
        console.error('Error creating blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const published = searchParams.get('published') !== 'false';

        const result = await getAllBlogs(page, limit, published);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}