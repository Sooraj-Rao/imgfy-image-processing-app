import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header, Footer } from "@/components/header-footer";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ImgCompress",
  description: "Fast, high-quality image compression in seconds",
  keywords:
    "image compression, compress images, reduce size, photo optimization,ImgCompress,Img Compress,Image Compress,Image Compression ",
  authors: [{ name: "Sooraj Rao" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
