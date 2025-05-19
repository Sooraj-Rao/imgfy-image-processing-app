"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl text-justify text-zinc-900 dark:text-gray-200 flex flex-col p-2 ">
      <section className="flex-grow">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="scroll-m-20 text-lg font-semibold tracking-tight">
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 text-sm sm:text-base">
          <p className="">
            Imgify is a powerful tool that quickly compresses and converts
            images without losing quality. Whether you need to reduce file sizes
            or change formats, Imgify makes the process fast and easy for
            efficient storage, sharing, and uploading.
          </p>
          <p className="">
            For a seamless experience, Imgify is also available for installation
            on your device, providing a faster and more accessible workflow.
          </p>
          <div>
            <h3 className="font-semibold mb-2 ">Key Features:</h3>
            <div className="grid gap-2 ">
              <div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Compress with minimal quality loss</li>
                  <li>Convert between popular formats</li>
                </ul>
              </div>
              <div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Resize to specific dimensions</li>
                  <li>Batch process multiple images</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 ">Get in Touch</h3>
            <div className="gap-2 ">
              <Button
                className=" bg-gradient-to-tr from-primary to-zinc-600"
                size="sm"
              >
                <Mail size={14} />
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </section>
    </div>
  );
}
