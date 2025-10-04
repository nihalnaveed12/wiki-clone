import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateBlog } from "@/lib/actions/blog.actions";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import Blog from "@/lib/database/model/Blogs";
import User from "@/lib/database/model/User";
import dbConnect from "@/lib/database/mongodb";
import { isUserAdmin, updateUserRoleIfAdmin } from "@/lib/utils/admin";

// GET by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const blog = await Blog.findById(id).populate(
      "author",
      "firstName lastName email username photo clerkId"
    );

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(
      { blog: JSON.parse(JSON.stringify(blog)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await updateUserRoleIfAdmin(userId);

    const existingBlog = await Blog.findById(id).populate("author");

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (existingBlog.author.clerkId !== userId) {
      return NextResponse.json(
        {
          error: "Forbidden - You can only edit your own posts",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;
    const tags = formData.get("tags") as string;
    const published = formData.get("published") === "true";
    const removeImage = formData.get("removeImage") === "true";

    // NEW InfoBox fields
    const bornDate = formData.get("bornDate") as string;
    const bornPlace = formData.get("bornPlace") as string;
    const diedDate = formData.get("diedDate") as string;
    const diedPlace = formData.get("diedPlace") as string;
    const occupation = formData.get("occupation") as string;
    const spouses = formData.get("spouses") as string;
    const origin = formData.get("origin") as string;
    const sideSection = formData.get("sideSection") as string;
    const alsoKnownAs = formData.get("alsoKnownAs") as string;
    const realName = formData.get("realName") as string;
    const genres = formData.get("genres") as string;
    const associatedActs = formData.get("associatedActs") as string;
    const labels = formData.get("labels") as string;

    // NEW: multiple YouTube URLs
    const youtubeUrlsRaw = formData.getAll("youtubeUrls") as string[];
    const youtubeUrls = youtubeUrlsRaw
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .slice(0, 5); // max 5 videos

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    let imageData = existingBlog.image;

    if (removeImage && existingBlog.image.id) {
      await deleteFromCloudinary(existingBlog.image.id);
      imageData = { id: "", url: "" };
    }

    if (image && image.size > 0) {
      if (existingBlog.image.id) {
        await deleteFromCloudinary(existingBlog.image.id);
      }
      imageData = await uploadToCloudinary(image);
    }

    const updatedBlog = await updateBlog({
      blogId: id,
      title,
      content,
      image: imageData,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      published,
      bornDate: bornDate || "",
      bornPlace: bornPlace || "",
      diedDate: diedDate || "",
      diedPlace: diedPlace || "",
      occupation: occupation || "",
      spouses: spouses || "",
      origin: origin || "",
      sideSection: sideSection || "",
      youtubeUrls: youtubeUrls.length ? youtubeUrls : [],
      alsoKnownAs: alsoKnownAs || "",
      realName: realName || "",
      genres: genres ? genres.split(",").map((g) => g.trim()) : [],
      associatedActs: associatedActs
        ? associatedActs.split(",").map((a) => a.trim())
        : [],
      labels: labels ? labels.split(",").map((l) => l.trim()) : [],
    });

    return NextResponse.json(
      { success: true, blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    await updateUserRoleIfAdmin(userId);

    const currentUser = await User.findOne({ clerkId: userId });
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const blog = await Blog.findById(id).populate("author");
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const isAuthor = blog.author.clerkId === userId;
    const isAdmin = await isUserAdmin(userId);

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        {
          error: "Forbidden - You can only delete your own posts",
        },
        { status: 403 }
      );
    }

    if (blog.image.id) {
      await deleteFromCloudinary(blog.image.id);
    }

    await Blog.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
