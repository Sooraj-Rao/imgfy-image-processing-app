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
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { siteData } from "@/data/siteMetaData";

export const Header = () => {
  return (
    <header className=" shadow ">
      <div className=" mx-auto px-10 py-3  flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-8 w-8 text-primary" />
          <span className="text-xl font-extrbold text-primary">
            {siteData.siteName}
          </span>
        </div>
        <nav className="hidden md:flex space-x-2 items-center ">
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
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="hover:underline">
                    Home
                  </a>
                  <a href="#" className="hover:underline">
                    About
                  </a>
                  <a href="#" className="hover:underline">
                    Report
                  </a>
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
  <footer className=" flex justify-evenly w-full  border-t py-4 text-sm dark:text-gray-200 text-zinc-900">
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
