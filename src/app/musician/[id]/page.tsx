
import { auth } from "@clerk/nextjs/server";
import { getMusicianByIdAPI } from "@/lib/api/musicians";
import MusicianProfileClient from "@/components/musician-com/MusicianProfileClient";


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
    return <p className="text-center text-gray-400 py-8">Musician not found or failed to load.</p>;
  }

  const musician = res.data;
  const canEdit = userId && musician.submittedBy === userId;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <MusicianProfileClient musician={musician} canEdit={canEdit} />
    </div>
  );
}