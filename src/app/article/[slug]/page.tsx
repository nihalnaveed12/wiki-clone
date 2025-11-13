import { getBlogBySlug } from "@/lib/actions/blog.actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import EditButton from "@/components/edit-button";
import ClientVideoTabs from "@/components/clientArticle"; // new client component

interface PageProps {
  params: Promise<{ slug: string }>;
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
  image?: { id: string; url: string };
  author: Author;
  slug: string;
  bornDate: string;
  bornPlace: string;
  diedDate: string;
  diedPlace: string;
  occupation: string;
  spouses: string;
  origin: string;
  sideSection: string;
  alsoKnownAs: string;
  realName: string;
  genres: string;
  associatedActs: string[];
  labels: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  youtubeUrls?: string[];
  musicVideos?: string[];
  introVideos?: string[];
  vlogVideos?: string[];
  updatedAt: string;
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex sm:justify-between sm:gap-3 gap-10">
      <h1 className="font-semibold font-sans">{label}</h1>
      <div className="text-sm">{value}</div>
    </div>
  );
}

// helper function to extract video ID
function extractYouTubeId(url: string): string | null {
  const shortRegex = /youtu\.be\/([^?&]+)/;
  const longRegex = /v=([^?&]+)/;
  return url.match(shortRegex)?.[1] || url.match(longRegex)?.[1] || null;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const blog: Blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const { youtubeUrls, musicVideos, introVideos, vlogVideos } = blog;
  const rightVideo =
    youtubeUrls && youtubeUrls.length > 4 ? youtubeUrls[4] : null;

  return (
    <div className="max-w-5xl mx-auto px-7 py-[92px]">

      <h3 className="text-3xl font-serif">Media Gallery</h3>

      {/* Client component for tab UI */}
      <ClientVideoTabs
        youtubeUrls={youtubeUrls}
        musicVideos={musicVideos}
        introVideos={introVideos}
        vlogVideos={vlogVideos}
      />

      {/* Back and Edit */}
      <div className="flex justify-between sm:flex-row flex-col mt-8">
        <Link
          href="/articles-page"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          ← Back to Articles
        </Link>
        <EditButton AuthorId={blog.author.clerkId} blogId={blog._id} />
      </div>

      <hr className="border-t-2 border-gray-500 mb-6" />

      {/* Title and Dates */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between border-b-2 border-zinc-400 pb-2">
          <h1 className="text-3xl font-bold font-serif italic">{blog.title}</h1>
          <p className="text-gray-600 text-sm">
            Published on {formatDate(blog.createdAt)}
            {blog.updatedAt !== blog.createdAt && (
              <span> • Updated {formatDate(blog.updatedAt)}</span>
            )}
          </p>
        </div>

        {/* Layout */}
        <div className="flex sm:flex-row flex-col-reverse gap-6 w-full">
          {/* LEFT SIDE */}
          <div className="sm:w-[90%]">
            <article className="prose prose-lg max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="article-content"
              />
            </article>
          </div>

          {/* RIGHT SIDE */}
          <div className="border-2 p-1 h-fit flex-col flex gap-3 sm:w-[40%]">
            {blog.image?.url && (
              <div className="p-4 bg-orange-100">
                <Image
                  src={blog.image.url}
                  alt={blog.title}
                  height={1000}
                  width={1000}
                  className="rounded-md"
                />
              </div>
            )}

            {rightVideo && extractYouTubeId(rightVideo) && (
              <div className="p-4">
                <iframe
                  width="100%"
                  height="215"
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    rightVideo
                  )}`}
                  title="Extra YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md border"
                />
              </div>
            )}

            <div className="px-2 flex flex-col gap-3">
              <InfoRow
                label="Born"
                value={`${blog.bornDate || ""} ${blog.bornPlace || ""}`}
              />
              {blog.diedDate && blog.diedPlace && (
                <InfoRow
                  label="Died"
                  value={`${blog.diedDate} ${blog.diedPlace}`}
                />
              )}
              <InfoRow label="Occupation" value={blog.occupation} />
              <InfoRow label="Spouses" value={blog.spouses} />
              <InfoRow label="Origin" value={blog.origin} />
              <InfoRow label="Side/Section" value={blog.sideSection} />
              <InfoRow label="Also Known As" value={blog.alsoKnownAs} />
              <InfoRow label="Real Name" value={blog.realName} />
              <InfoRow label="Genres" value={blog.genres} />
              <InfoRow label="Labels" value={blog.labels} />
              {blog.associatedActs?.length > 0 && (
                <InfoRow
                  label="Associated Acts"
                  value={blog.associatedActs.join(", ")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
