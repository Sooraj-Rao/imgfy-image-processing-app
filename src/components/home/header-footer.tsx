"use client";

import { BugIcon, Image as ImageIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme/theme-toggle";
import Link from "next/link";
import { siteData } from "@/data/siteMetaData";

export const Header = () => {
  return (
    <header className=" shadow flex justify-center w-full">
      <div className=" flex items-center justify-between 2xl:justify-around w-full py-3 px-4">
        <Link href={"/"} className=" ">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-extrbold text-primary">
              {siteData.siteName}
            </span>
          </div>
        </Link>
        <nav className="hidden  md:flex space-x-2 items-center ">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>

          <Link
            href={siteData.report + siteData.siteName}
            className=" flex items-center gap-1"
          >
            <Button variant="ghost">
              <BugIcon />
              Report an Issue
            </Button>
          </Link>
          <ModeToggle />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                <nav className="flex flex-col items-center space-y-2 mt-4">
                  <Link href="/">
                    <Button variant="ghost">Home</Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="ghost">About</Button>
                  </Link>

                  <Link
                    href={siteData.report + siteData.siteName}
                    className=" flex items-center gap-1"
                  >
                    <Button variant="ghost">Report an Issue</Button>
                  </Link>
                  <ModeToggle />
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export const Footer = () => (
  <footer className=" flex justify-evenly w-full  border-t py-4 sm:text-sm text-xs  dark:text-gray-200 text-zinc-900">
    <p>© 2024 {siteData.siteName}</p>
    <p>
      Developed by
      <Link
        title="Open Portfolio"
        target="_blank"
        className=" ml-1 text-primary hover:underline"
        href={siteData.portfolio}
      >
        Sooraj
      </Link>
    </p>
  </footer>
);
