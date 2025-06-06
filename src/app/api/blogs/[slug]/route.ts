import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/actions/blog.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
        const { slug } = await params;
        const blog = await getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
