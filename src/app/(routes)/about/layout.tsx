import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Imgfy Simple Image Conversion and Compression",
  description:
    "Learn more about Simple Image Conversion and Compression, our mission, and our team. We're dedicated to providing fast and high-quality solutions for image conversion and compression.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
