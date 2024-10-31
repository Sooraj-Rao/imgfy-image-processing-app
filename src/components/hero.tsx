"use client";

import { Button } from "./ui/button";
import { ArrowUpIcon, DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Hero() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("BeforeInstallPromptEvent fired");
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("App installed");
    };

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
      console.log("App is already installed");
    } else {
      setIsInstallable(true);
      console.log("App is installable");
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    // Attempt to trigger the installation prompt immediately
    setTimeout(() => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
      }
    }, 3000);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
          setIsInstallable(false);
        } else {
          console.log("User dismissed the install prompt");
        }
      } catch (error) {
        console.error("Error during installation:", error);
      } finally {
        setDeferredPrompt(null);
      }
    } else {
      console.log(
        "Installation prompt not available, trying alternative methods"
      );

      // Method 1: Use the manifest directly
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.json";
      document.head.appendChild(link);

      // Method 2: Trigger installation for Safari on iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert(
          "To install the app on your iOS device, tap the share button and then 'Add to Home Screen'."
        );
      }

      // Method 3: Provide instructions for other browsers
      else {
        alert(
          "To install our app, please use the browser's built-in 'Add to Home Screen' or 'Install' option from the menu."
        );
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center h-full">
      <h1 className="text-2xl scroll-m-20 sm:text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-rose-700 via-rose-300 to-rose-700 bg-clip-text text-transparent">
        Fast, high-quality image compression in seconds
      </h1>
      <p className="text-base sm:text-xl mb-8 mt-4">
        Reduce file size without compromising quality
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Link href="/compress-image">
          <Button className="group" size="lg">
            Compress Now
            <div className="w-0 overflow-hidden group-hover:w-4 duration-200">
              <ArrowUpIcon className="rotate-45" />
            </div>
          </Button>
        </Link>
        <Button
          onClick={handleInstallClick}
          variant="outline"
          size="lg"
          className="group"
        >
          Install App
          <DownloadIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
