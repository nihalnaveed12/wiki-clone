import EditBlogComponent from "@/components/edit-blog";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getBlog(id: string) {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/edit-blog/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  // Check if user owns this blog
  if (blog.author.clerkId !== userId) {
    redirect("/articles-page");
  }

  return (
    <div className="">
      <EditBlogComponent blog={blog} />
    </div>
  );
}
