"use client";
import MusicianForm from "@/components/musician-com/form";
import { addMusician } from "@/lib/api/musicians";
import { type FormData as MusicianFormData } from "@/components/musician-com/form";

export default function AddMusicianTab({
  onSuccess,
  baseUrl,
}: {
  onSuccess?: () => void;
  baseUrl: string;
}) {
  async function handleSubmit(data: MusicianFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value?.length) {
        formData.append("image", value[0]);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      await addMusician(formData, baseUrl);
      alert("Musician added successfully!");
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Failed to add musician");
    } finally {
      console.log("Finaallyy Form Submitted");
    }
  }

  return (
    <div className="h-screen ">

      <MusicianForm submitForm={handleSubmit} />
    </div>
  )
}
