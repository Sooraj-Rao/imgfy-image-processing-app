"use client";

import { useState } from "react";
import { ArrowUpRight, BugIcon, Image as ImageIcon, Menu } from "lucide-react";
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
import { usePathname } from "next/navigation";
import { NavButtons } from "./hero";

export const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="shadow dark:border-b flex justify-center w-full">
      <div className="flex items-center justify-between 2xl:justify-around w-full py-3 px-4">
        <Link href={"/"} className="">
          <div className="flex items-center  space-x-2 text-rose-500 hover:text-primary duration-300">
            <ImageIcon className="h-8 w-8 " />
            <span className="text-xl font-extrabold">{siteData.siteName}</span>
          </div>
        </Link>
        <nav className="hidden md:flex space-x-2 items-center ">
          <Link href="/">
            <Button variant="ghost" className="scale-90">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="scale-90">
              About
            </Button>
          </Link>
          {path !== "/" && (
            <>
              <NavButtons size="sm" path={path} />
            </>
          )}
          <Link
            href={siteData.report}
            className="flex items-center gap-1 scale-90"
            title="Opens form for reporting"
          >
            <Button variant="ghost">
              <BugIcon />
              <span>Report an Issue</span>
            </Button>
          </Link>
          <ModeToggle />
        </nav>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                  <Link href="/" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="ghost">Home</Button>
                  </Link>
                  <Link href="/about" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="ghost">About</Button>
                  </Link>
                  {path !== "/" && (
                    <div
                      onClick={() => setIsSheetOpen(false)}
                      className=" flex flex-col gap-2"
                    >
                      <NavButtons size="sm" path={path} />
                    </div>
                  )}
                  <Link
                    href={siteData.report}
                    className="flex items-center gap-1"
                    onClick={() => setIsSheetOpen(false)}
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
  <footer className="flex justify-evenly w-full border-t py-4 sm:text-sm text-xs dark:text-gray-200 text-zinc-900">
    <Link
      title="Open Portfolio"
      className="group"
      target="_blank"
      href={siteData.portfolio}
    >
      <p>
        Developed by
        <span className="ml-1 text-primary font-semibold group-hover:underline">
          Sooraj
        </span>
      </p>
    </Link>
  </footer>
);
