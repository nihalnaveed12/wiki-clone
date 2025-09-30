"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-md cursor-pointer hover:bg-background active:bg-background text-foreground"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
