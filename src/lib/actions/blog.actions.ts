// /lib/actions/blog.actions.ts
import dbConnect from '@/lib/database/mongodb';
import Blog from '@/lib/database/model/Blogs';
import User from '@/lib/database/model/User';
import { generateSlug } from '../utils';

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[A-Za-z0-9_\-]{5,}(?:[?&][\w=&-]*)?$/;

function normalizeYoutubeUrls(urls?: string[]): string[] {
  if (!urls) return [];
  return urls
    .map((u) => u.trim())
    .filter((u) => u !== '' && youtubeRegex.test(u))
    .slice(0, 5); // ensure max 5
}

interface CreateBlogParams {
  title: string;
  content: string;
  image: {
    id: string;
    url: string;
  };
  authorClerkId: string;
  tags?: string[];
  published?: boolean;
  bornDate?: string;
  bornPlace?: string;
  diedDate?: string;
  diedPlace?: string;
  occupation?: string;
  spouses?: string;
  origin: string;
  sideSection: string;

  // updated: multiple urls
  youtubeUrls?: string[];

  // new infobox fields
  alsoKnownAs?: string;
  realName?: string;
  genres?: string[];
  associatedActs?: string[];
  labels?: string[];
}

interface UpdateBlogParams {
  blogId: string;
  title?: string;
  content?: string;
  image?: {
    id: string;
    url: string;
  };
  tags?: string[];
  published?: boolean;
  bornDate?: string;
  bornPlace?: string;
  diedDate?: string;
  diedPlace?: string;
  occupation?: string;
  spouses?: string;
  origin: string;
  sideSection: string;

  youtubeUrls?: string[];

  alsoKnownAs?: string;
  realName?: string;
  genres?: string[];
  associatedActs?: string[];
  labels?: string[];
}

export async function createBlog(blogData: CreateBlogParams) {
  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: blogData.authorClerkId });

    if (!user) {
      throw new Error('User not found');
    }

    const baseSlug = generateSlug(blogData.title);
    let slug = baseSlug;
    let counter = 1;

    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blog = new Blog({
      title: blogData.title,
      content: blogData.content,
      image: blogData.image,
      author: user._id,
      slug,
      published: blogData.published || false,
      tags: blogData.tags || [],
      bornDate: blogData.bornDate || '',
      bornPlace: blogData.bornPlace || '',
      diedDate: blogData.diedDate || '',
      diedPlace: blogData.diedPlace || '',
      occupation: blogData.occupation || '',
      spouses: blogData.spouses || '',
      origin: blogData.origin || " ",
      sideSection: blogData.sideSection || " ",
      youtubeUrls: normalizeYoutubeUrls(blogData.youtubeUrls),

      alsoKnownAs: blogData.alsoKnownAs || '',
      realName: blogData.realName || '',
      genres: blogData.genres || [],
      associatedActs: blogData.associatedActs || [],
      labels: blogData.labels || [],
    });

    await blog.save();
    await blog.populate('author', 'firstName lastName email username photo');

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
}

export async function getAllBlogs(page = 1, limit = 10, published = true) {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(published ? { published: true } : {})
      .populate('author', 'firstName lastName email username photo clerkId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(published ? { published: true } : {});

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    await dbConnect();

    const blog = await Blog.findOne({ slug }).populate(
      'author',
      'firstName lastName email username photo clerkId'
    );

    if (!blog) {
      return null;
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    throw error;
  }
}

export async function getBlogsByAuthor(authorClerkId: string, page = 1, limit = 10) {
  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: authorClerkId });

    if (!user) {
      throw new Error('User not found');
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: user._id })
      .populate('author', 'firstName lastName email username photo clerkId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ author: user._id });

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs by author:', error);
    throw error;
  }
}

export async function updateBlog(updateData: UpdateBlogParams) {
  try {
    await dbConnect();

    const updateFields: Partial<CreateBlogParams> & { slug?: string } = {};

    if (updateData.title) {
      updateFields.title = updateData.title;
      const baseSlug = generateSlug(updateData.title);
      let slug = baseSlug;
      let counter = 1;

      while (await Blog.findOne({ slug, _id: { $ne: updateData.blogId } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateFields.slug = slug;
    }

    if (updateData.content) updateFields.content = updateData.content;
    if (updateData.image) updateFields.image = updateData.image;
    if (updateData.tags) updateFields.tags = updateData.tags;
    if (updateData.published !== undefined) updateFields.published = updateData.published;
    if (updateData.bornDate !== undefined) updateFields.bornDate = updateData.bornDate;
    if (updateData.bornPlace !== undefined) updateFields.bornPlace = updateData.bornPlace;
    if (updateData.diedDate !== undefined) updateFields.diedDate = updateData.diedDate;
    if (updateData.diedPlace !== undefined) updateFields.diedPlace = updateData.diedPlace;
    if (updateData.occupation !== undefined) updateFields.occupation = updateData.occupation;
    if (updateData.spouses !== undefined) updateFields.spouses = updateData.spouses;
    if (updateData.origin !== undefined) updateFields.origin = updateData.origin;
    if (updateData.sideSection !== undefined) updateFields.sideSection = updateData.sideSection;

    if (updateData.youtubeUrls !== undefined) {
      updateFields.youtubeUrls = normalizeYoutubeUrls(updateData.youtubeUrls);
    }

    if (updateData.alsoKnownAs !== undefined) updateFields.alsoKnownAs = updateData.alsoKnownAs;
    if (updateData.realName !== undefined) updateFields.realName = updateData.realName;
    if (updateData.genres !== undefined) updateFields.genres = updateData.genres;
    if (updateData.associatedActs !== undefined) updateFields.associatedActs = updateData.associatedActs;
    if (updateData.labels !== undefined) updateFields.labels = updateData.labels;

    const blog = await Blog.findByIdAndUpdate(
      updateData.blogId,
      { $set: updateFields },
      { new: true }
    ).populate('author', 'firstName lastName email username photo clerkId');

    if (!blog) {
      throw new Error('Blog not found');
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

export async function deleteBlog(blogId: string, authorClerkId: string) {
  try {
    await dbConnect();

    const user = await User.findOne({ clerkId: authorClerkId });

    if (!user) {
      throw new Error('User not found');
    }

    const blog = await Blog.findOneAndDelete({
      _id: blogId,
      author: user._id,
    });

    if (!blog) {
      throw new Error('Blog not found or unauthorized');
    }

    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}
