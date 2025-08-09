"use client";
import MusicianForm from "@/components/musician-com/form";
import { type FormData as MusicianFormData } from "@/components/musician-com/form";
import { addMusicianReq } from "@/lib/api/requestMusicians";

export default function MusicianFormPage() {
  async function submitForm(data: MusicianFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value?.length) {
        formData.append("image", value[0]);
      } else if (value) {
        formData.append(key, String(value));
      }
    });

    try {
      const response = await addMusicianReq(formData);
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
