"use client";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersTab from "@/components/dashboard/UsersTab";
import PostsTab from "@/components/dashboard/PostsTab";
import MusiciansTab from "@/components/dashboard/MusiciansTab";
import AddMusicianTab from "@/components/dashboard/AddMusicians";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "users" | "posts" | "musicians" | "add"
  >("users");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <p>Loading dashboard...</p>;
  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL)
    return <p className="text-red-500">Access denied</p>;

  return (
    <SidebarProvider>
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b">
          <SidebarTrigger />
        </header>
        <main className="p-4">
          {activeTab === "users" && (
            <UsersTab baseUrl={BASE_URL} adminEmail={ADMIN_EMAIL} />
          )}
          {activeTab === "posts" && <PostsTab baseUrl={BASE_URL} />}
          {activeTab === "musicians" && <MusiciansTab baseUrl={BASE_URL} />}
          {activeTab === "add" && (
            <AddMusicianTab
              onSuccess={() => setActiveTab("musicians")}
              baseUrl={BASE_URL}
            />
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
