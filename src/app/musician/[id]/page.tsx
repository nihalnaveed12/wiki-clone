import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { getMusicianByIdAPI } from "@/lib/api/musicians";
import MusicianDeleteButton from "@/components/musician-com/MusicianDeleteButton";

interface Musician {
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    soundcloud: string;
  };
  image: {
    id: string;
    url: string;
  };
  _id: string;
  name: string;
  city: string;
  category: string;
  country: string;
  shortBio: string;
  website: string;
  createdAt: string;
  address: string;
  submittedBy: string; // Critical for ownership check
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MusicianProfilePage({ params }: PageProps) {
  const { id } = await params;
  const res = await getMusicianByIdAPI(id);
  const { userId } = await auth();

  if (!res.success) {
    return (
      <p className="text-center text-gray-500 py-8">
        Musician not found or failed to load.
      </p>
    );
  }

  const musician: Musician = res.data;
  const canEdit = userId && musician.submittedBy === userId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg flex justify-between p-6 border border-gray-200">
        {/* Profile Header */}
        <div className="">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Image
              src={musician.image.url}
              alt={musician.name}
              width={128}
              height={128}
              className="rounded-full object-cover w-32 h-32 border"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {musician.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {musician.category} • {musician.city}, {musician.country}
              </p>
              <p className="text-sm text-gray-500">
                Joined on {new Date(musician.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bio & Address */}
          <div className="mt-6 space-y-3">
            <p className="text-gray-700">
              <strong>Address:</strong> {musician.address}
            </p>
            <p className="text-gray-700">
              <strong>Bio:</strong> {musician.shortBio}
            </p>
            {musician.website && (
              <p className="text-gray-700">
                <strong>Website:</strong>
                <a
                  href={musician.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {musician.website}
                </a>
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Socials
            </h2>
            <div className="flex flex-wrap gap-3">
              {musician.socials.instagram && (
                <a
                  href={musician.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200"
                >
                  Instagram
                </a>
              )}
              {musician.socials.youtube && (
                <a
                  href={musician.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
                >
                  YouTube
                </a>
              )}
              {musician.socials.spotify && (
                <a
                  href={musician.socials.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                >
                  Spotify
                </a>
              )}
              {musician.socials.soundcloud && (
                <a
                  href={musician.socials.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200"
                >
                  SoundCloud
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="">
          {canEdit && (
            <Link
              href={`/musician/${musician._id}/edit`}
              className="px-4 py-1 mr-4 rounded-[6px] text-white bg-blue-500 cursor-pointer hover:bg-blue-400"
            >
              Edit
            </Link>
          )}
          <MusicianDeleteButton id={musician._id} />
        </div>
      </div>
    </div>
  );
}