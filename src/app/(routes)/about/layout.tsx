import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Imgfy Image Conversion and Compression",
  description:
    "Learn more about Imgfy Image Conversion and Compression. We're dedicated to providing fast and high-quality solutions for image conversion and compression.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
