import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Image Conversion - Fast and High-Quality",
  description:
    "Quickly and easily convert images to various formats with high quality. Perfect for optimizing photos and preparing them for web, social media, and more.",
  keywords:
    "image conversion, convert images, image formats, photo optimization, image converter, JPEG to PNG, PNG to JPEG, image transformation",
  authors: [{ name: "Sooraj Rao" }],
  openGraph: {
    title: "Simple Image Conversion",
    description:
      "Convert images to different formats quickly with high quality. Ideal for optimizing photos for various uses.",
    url: "https://imgfy.soorajrao.in/convert",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Image Conversion - Fast and Easy",
    description:
      "Convert images instantly with high-quality results. Ideal for social media and web optimization.",
    creator: "@SoorajRaoo",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}