"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface EditProps {
  AuthorId: string;
  blogId: string;
}

export default function EditButton({ AuthorId, blogId }: EditProps) {
  const { user } = useUser();
  const isAuthor = user?.id === AuthorId;

  return (
    <>
      {isAuthor && (
        <Link
          className="h-fit px-4 py-2 rounded-[6px] text-white hover:bg-blue-600 bg-blue-500"
          href={`/edit-article/${blogId}`}
        >
          Edit
        </Link>
      )}
    </>
  );
}
