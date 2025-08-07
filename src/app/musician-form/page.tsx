"use client";
import MusicianForm from "@/components/musician-com/form";

export default function MusicianFormPage() {
  function submitForm() {
    console.log("helloo");
  }

  return (
    <div className="">
      <MusicianForm submitForm={submitForm} />
    </div>
  );
}
