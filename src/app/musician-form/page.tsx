"use client";
import MusicianForm from "@/components/musician-com/form";
import { type FormData as MusicianFormData } from "@/components/musician-com/form";
import { addMusicianReq } from "@/lib/api/requestMusicians";

export default function MusicianFormPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  async function submitForm(data: any) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }

    try {
      const response = await addMusicianReq(formData, BASE_URL);
      if (response.success) {
        alert(
          "Your request to add musician has been sent to the admin for review!"
        );
      } else {
        alert(
          "Failed to submit request: " + (response.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit musician request. Please try again.");
    } finally {
      console.log("Form submission completed");
    }
  }

  return (
    <div className="">
      <MusicianForm submitForm={submitForm} />
    </div>
  );
}
