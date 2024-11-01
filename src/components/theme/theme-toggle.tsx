"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const ChangeTheme = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className=" flex items-center gap-x-2">
      <Button
        onClick={ChangeTheme}
        variant="ghost"
        className="px-3"
        title="Change Theme"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] dark:hidden" />
        <MoonIcon className="h-[1.2rem] w-[1.2rem] dark:block hidden" />
        <p className=" sm:hidden">Theme</p>
      </Button>
    </div>
  );
}
