"use client";

import { Image as ImageIcon, Menu } from "lucide-react";
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

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xl font-bold">ImageCompressor</span>
        </div>
        <nav className="hidden md:flex space-x-4">
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

export default Header;

export const Footer = () => (
  <footer className=" flex justify-evenly w-full  py-4 text-sm text-gray-600">
    <p>© 2024 ImageCompressor</p>
    <p>
      Developed by
      <Link
        className=" ml-1 text-primary hover:underline"
        href={"https://soorajrao.in"}
      >
        Sooraj
      </Link>
    </p>
  </footer>
);
