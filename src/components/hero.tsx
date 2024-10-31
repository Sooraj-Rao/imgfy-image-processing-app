"use client";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hero Component
export const Hero = () => (
  <div className="container mx-auto px-4 py-16 text-center h-full">
    <h1
      className="
       text-2xl scroll-m-20 sm:text-4xl font-extrabold tracking-tight lg:text-5xl
        bg-gradient-to-r from-rose-700 via-rose-300 to-rose-700 bg-clip-text text-transparent
      "
    >
      Fast, high-quality image compression in seconds
    </h1>
    <p className="text-base sm:text-xl mb-8 mt-4">
      Reduce file size without compromising quality
    </p>
    <Link href={"/compress-image"}>
      <Button className="group" size="lg">
        Compress Now
        <div className="w-0 overflow-hidden group-hover:w-4 duration-200">
          <ArrowUpIcon className="rotate-45" />
        </div>
      </Button>
    </Link>
    <InstallPrompt /> {/* Ensure InstallPrompt is rendered here */}
  </div>
);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// InstallPrompt Component
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      console.log("beforeinstallprompt event fired"); // Debugging log
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset prompt after use
      });
    }
  };

  return (
    <div>
      {/* Show button only if deferredPrompt is set */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Install App
        </button>
      )}
    </div>
  );
}
