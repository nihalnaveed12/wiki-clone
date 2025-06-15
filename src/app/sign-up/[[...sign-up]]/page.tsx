import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 flex justify-center py-12">
      <SignUp />
    </div>
  );
}
