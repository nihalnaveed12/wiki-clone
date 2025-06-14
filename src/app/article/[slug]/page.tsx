import { getBlogBySlug } from "@/lib/actions/blog.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Author {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  photo: string;
  clerkId: string;
}

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: {
    id: string;
    url: string;
  };
  author: Author;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const blog: Blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-7 py-[92px]">
      <Link
        href="/articles-page"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        ← Back to Articles
      </Link>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-b-2 border-zinc-400 pb-2">
          <h1 className="text-3xl font-bold font-serif italic ">
            {blog?.author?.firstName} {blog?.author?.lastName}
          </h1>

          <p className="text-gray-600 text-sm">
            Published on {formatDate(blog.createdAt)}
            {blog.updatedAt !== blog.createdAt && (
              <span> • Updated {formatDate(blog.updatedAt)}</span>
            )}
          </p>
        </div>

        <div className="">
          <h1 className="text-xl  ">{blog.title.toUpperCase()}</h1>
        </div>

        <div className="flex sm:flex-row flex-col-reverse gap-6 w-full">
          <div className="sm:w-[90%]">
            <article className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="article-content"
              />
            </article>
          </div>

          <div className="border-2 p-1 h-fit flex-col flex gap-3 sm:w-[40%] ">
            <div className="bg-orange-100 p-3">
              <h2 className="text-xl font-semibold font-serif italic pb-2 ">
                {blog.author.firstName} {blog.author.lastName}
              </h2>
              <Image
                src={blog.image.url}
                alt={blog.title}
                height={1000}
                width={1000}
              />
            </div>

            <div className="">
              <p className="text-gray-600 text-sm text-center">
                Published on {formatDate(blog.createdAt)}
                {blog.updatedAt !== blog.createdAt && (
                  <span> • Updated {formatDate(blog.updatedAt)}</span>
                )}
              </p>
            </div>

            <div className="">
              {blog?.tags?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {blog?.tags?.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
