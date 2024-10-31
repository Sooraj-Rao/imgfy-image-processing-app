"use client";

import { Button } from "./ui/button";
import { ArrowUpIcon, DownloadIcon, HelpCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Hero() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installCount, setInstallCount] = useState(0);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      setIsInstallable(!isStandalone);
    };

    checkIfInstalled();

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);
    window
      .matchMedia("(display-mode: standalone)")
      .addEventListener("change", checkIfInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window
        .matchMedia("(display-mode: standalone)")
        .removeEventListener("change", checkIfInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") setIsInstallable(false);
      } catch (error) {
        console.error("Error during installation:", error);
      } finally {
        setDeferredPrompt(null);
      }
    } else {
      handleManualInstallation();
    }
    setInstallCount((prev) => prev + 1);
  };

  const handleManualInstallation = () => {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";
    document.head.appendChild(link);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      toast.info(
        "To install the app on your iOS device, tap the share button and then 'Add to Home Screen'."
      );
    } else {
      toast.info(
        "To install our app, you use the browser's 'Add to Home Screen' or 'Install' option."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-32 text-center h-full">
      <h1 className="text-2xl scroll-m-20 sm:text-4xl font-[900] tracking-tight lg:text-5xl bg-gradient-to-tr from-rose-700 via-rose-300 to-rose-700 bg-clip-text text-transparent">
        Fast, high-quality image compression in seconds
      </h1>
      <br />
      <p className="text-base sm:text-xl mb-8 mt-4">
        Reduce file size without compromising quality
      </p>
      <div className="flex flex-col sm:flex-row justify-center  gap-4">
        <Link href="/compress-image">
          <Button className="group" size="lg">
            Compress Now
            <div className="w-0 overflow-hidden group-hover:w-4 duration-200">
              <ArrowUpIcon className="rotate-45" />
            </div>
          </Button>
        </Link>
        {isInstallable && (
          <div>
            <Button
              onClick={handleInstallClick}
              variant="outline"
              size="lg"
              className="group"
            >
              {{
                0: "Install App",
                1: "Confirm Installation",
                5: "Failed Installation",
              }[installCount] ?? "Try Installation Again"}
              <DownloadIcon className="ml-2 h-4 w-4" />
            </Button>
            {installCount >= 3 && (
              <Button
                variant="link"
                onClick={() => setShowTroubleshoot(true)}
                className="flex items-center space-x-1 text-gray-500"
              >
                <HelpCircleIcon className="h-4 w-4" />
                <span>Troubleshoot Installation</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {showTroubleshoot && (
        <div className="modal fixed inset-1 flex items-center justify-center backdrop-blur bg-secondary/60 ">
          <div className="bg-secondary p-6 rounded-md text-zinc-700 dark:text-zinc-300 max-w-md mx-auto text-left shadow-xl  ">
            <h2 className="text-xl font-bold mb-4 ">
              Troubleshoot Installation
            </h2>
            <p>Follow these steps to install the app based on your device:</p>
            <ul className="list-disc ml-6 my-2  text-[15px]">
              <li>
                Ensure the app isn&apos;t already installed on your device
              </li>
              <li>
                For iOS: Tap the share icon and choose &apos;Add to Home
                Screen&apos;.
              </li>
              <li>
                For Android: Use the &apos;Install App&apos; option in your
                browser&apos;s menu.
              </li>
              <li>
                On Desktop: Use your browser&apos;s &apos;Install&apos; or
                &apos;Add to Home Screen&apos; option.
              </li>
            </ul>
            <Button
              onClick={() => setShowTroubleshoot(false)}
              variant="default"
              className="mt-4 w-fit"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
