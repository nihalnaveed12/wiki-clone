"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch("/api/sync-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              clerkId: user.id,
              email: user.emailAddresses[0].emailAddress,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              username: user.username || "",
              photo: user.imageUrl || "",
            }),
          });

          if (response.ok) {
            console.log("User synced successfully");
          } else {
            console.error("Failed to sync user");
          }
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, user]);

  return null;
}
