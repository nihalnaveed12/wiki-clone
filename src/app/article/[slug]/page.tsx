import { getBlogBySlug } from "@/lib/actions/blog.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

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
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        href="/articles-page"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
      >
        ← Back to Articles
      </Link>

      {/* Article Header */}
      <header className="mb-8">
        {!blog.published && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
              Draft - Not Published
            </span>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

        {/* Author and Date */}
        <div className="flex items-center gap-4 mb-6">
          {blog.author.photo && (
            <Image
              src={blog.author.photo}
              alt={`${blog.author.firstName} ${blog.author.lastName}`}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900">
              {blog.author.firstName} {blog.author.lastName}
            </p>
            <p className="text-gray-600 text-sm">
              Published on {formatDate(blog.createdAt)}
              {blog.updatedAt !== blog.createdAt && (
                <span> • Updated {formatDate(blog.updatedAt)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Featured Image */}
        {blog.image.url && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.image.url}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          className="article-content"
        />
      </article>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {blog.author.photo && (
              <Image
                src={blog.author.photo}
                alt={`${blog.author.firstName} ${blog.author.lastName}`}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">
                Written by {blog.author.firstName} {blog.author.lastName}
              </p>
              <p className="text-gray-600 text-sm">{blog.author.email}</p>
            </div>
          </div>

          <Link
            href="/articles-page"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Read More Articles
          </Link>
        </div>
      </footer>
    </div>
  );
}
