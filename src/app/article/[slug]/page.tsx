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
  image?: {
    id: string;
    url: string;
  };
  author: Author;
  slug: string;
  bornDate: string;
  bornPlace: string;
  diedDate: string;
  diedPlace: string;
  occupation: string;
  spouses: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  youtubeUrl?: string;
  updatedAt: string;
}

function extractYouTubeId(url: string): string | null {
  const shortRegex = /youtu\.be\/([^?&]+)/;
  const longRegex = /v=([^?&]+)/;

  const shortMatch = url.match(shortRegex);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  const longMatch = url.match(longRegex);
  if (longMatch && longMatch[1]) return longMatch[1];

  return null;
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
            {blog.title}
          </h1>

          <p className="text-gray-600 text-sm">
            Published on {formatDate(blog.createdAt)}
            {blog.updatedAt !== blog.createdAt && (
              <span> • Updated {formatDate(blog.updatedAt)}</span>
            )}
          </p>
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
            {blog.image?.url &&  (

            <div className="p-4">
              <div className="bg-orange-100 p-3">
                <Image
                  src={blog.image.url}
                  alt={blog.title}
                  height={1000}
                  width={1000}
                />
              </div>
            </div>
            )}

            <div className="p-4">
              {blog.youtubeUrl && (
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    blog.youtubeUrl
                  )}?mute=1&autoplay=1`}
                  title="YouTube video player"
                  
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            <div className="px-2 flex flex-col gap-3">
              <div className="flex  sm:justify-between sm:gap-3 gap-10">
                <h1 className="font-semibold font-sans">Born</h1>

                <div className="text-sm">
                  <h2>{blog.bornDate}</h2>

                  <p>{blog.bornPlace}</p>
                </div>
              </div>

              {blog.diedDate && blog.diedPlace ? (
                <div className="flex  sm:justify-between sm:gap-3 gap-10">
                  <h1 className="font-semibold font-sans">Died</h1>

                  <div className="text-sm">
                    <h2>{blog.diedDate}</h2>

                    <p>{blog.diedPlace}</p>
                  </div>
                </div>
              ) : (
                <div className=""></div>
              )}

              <div className="flex  sm:justify-between sm:gap-3 gap-10">
                <h1 className="font-semibold font-sans">Occupation</h1>

                <div className="text-sm">
                  <h2>{blog.occupation}</h2>
                </div>
              </div>
              <div className="flex  sm:justify-between sm:gap-3 gap-10">
                <h1 className="font-semibold font-sans">Spouses</h1>

                <div className="text-sm">
                  <h2>{blog.spouses}</h2>
                </div>
              </div>
            </div>

            {/* <div className="">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
