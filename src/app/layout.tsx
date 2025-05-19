import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header, Footer } from "@/components/home/header-footer";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import Analytics from "@/lib/analytics/main";

export const metadata: Metadata = {
  title: "Imgfy - Image Compression and Conversion",
  description: "Fast, high-quality image compression and conversion tools.",
  keywords:
    "image compression, compress images, reduce size, photo optimization, image conversion, convert images, image formats, Imgfy",
  authors: [{ name: "Sooraj Rao" }],
  openGraph: {
    title: "Imgfy - Fast Image Compression & Conversion",
    description:
      "Achieve high-quality image compression and format conversion in seconds. Ideal for optimizing images for the web, social media, and more.",
    url: "https://imgfy.soorajrao.in",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imgfy - High-Quality Image Compression & Conversion",
    description:
      "Fast and easy image compression and conversion without losing quality. Perfect for social media and web optimization.",
    creator: "@SoorajRaoo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="sm:overflow-hidden">
        <Suspense>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <div className="flex flex-col min-h-screen justify-between">
              <Analytics />
              <Header />
              <main className="min-h-[calc(100vh-120px)]">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
