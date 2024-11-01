import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Header, Footer } from "@/components/home/header-footer";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

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
    <html lang="en" 
    className={GeistSans.className}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="flex flex-col min-h-screen justify-around">
            <Header />
            <div className=" min-h-[calc(100vh-120px)]">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
