import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fastest Image Compression - High-Quality Results",
  description:
    "Optimize your images with our fast, high-quality image compression tool. Reduce image sizes without sacrificing quality, perfect for web, social media, and more.",
  keywords:
    "image compression, compress images, reduce size, photo optimization, image optimization, JPEG compression, PNG compression, web image compression",
  authors: [{ name: "Sooraj Rao" }],
  openGraph: {
    title: "Fastest Image Compression",
    description:
      "Achieve high-quality, fast image compression with ease. Perfect for optimizing images for web and social media.",
    url: "https://imgfy.soorajrao.in/compress",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fastest Image Compression",
    description:
      "Compress images quickly and efficiently without losing quality. Perfect for web and social media.",
    creator: "SoorajRaoo",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}