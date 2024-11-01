"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import GradientText from "@/utils/gradient-text";

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
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-b from-background to-secondary/20 flex flex-col items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.h1
          className="text-2xl sm:text-5xl md:text-6xl font-extrabold tracking-tight "
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <GradientText>Fast, High-Quality Image</GradientText>
          <br />
          <GradientText>Compression in Seconds</GradientText>
        </motion.h1>
        <motion.p
          className="mt-6 text-sm sm:text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Reduce file size without compromising quality
        </motion.p>
      </motion.div>

      <motion.div
        className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/image-compressor">
          <Button size="lg" className="group">
            Compress Now
            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </Link>
        {isInstallable && (
          <Button
            onClick={handleInstallClick}
            variant="outline"
            size="lg"
            className="group"
          >
            {installCount === 0
              ? "Install App"
              : installCount === 1
              ? "Confirm Installation"
              : installCount === 5
              ? "Failed Installation"
              : "Try Installation Again"}
            <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
          </Button>
        )}
      </motion.div>

      {installCount >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="link"
            onClick={() => setShowTroubleshoot(true)}
            className="mt-4 flex items-center space-x-1 text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Troubleshoot Installation</span>
          </Button>
        </motion.div>
      )}

      {/* <motion.div
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {["Fast", "Efficient", "Secure"].map((feature, index) => (
          <Card
            key={feature}
            className="p-6 text-center hover:shadow-lg transition-shadow"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + index * 0.2 }}
            >
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">{feature}</h2>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </motion.div>
          </Card>
        ))}
      </motion.div> */}

      {showTroubleshoot && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-card p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              Troubleshoot Installation
            </h2>
            <p className="mb-4">
              Follow these steps to install the app based on your device:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-2">
              <li>
                Ensure the app isn&apos;t already installed on your device
              </li>
              <li>
                For iOS: Tap the share icon and choose &apos;Add to Home
                Screen&apos;
              </li>
              <li>
                For Android: Use the &apos;Install App&apos; option in your
                browser&apos;s menu
              </li>
              <li>
                On Desktop: Use your browser&apos;s &apos;Install&apos; or
                &apos;Add to Home Screen&apos; option
              </li>
            </ul>
            <Button
              onClick={() => setShowTroubleshoot(false)}
              className="w-full"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
