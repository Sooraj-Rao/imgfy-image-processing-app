"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Download,
  Loader2,
  RefreshCcw,
  X,
  ImageIcon,
  CheckCircle,
} from "lucide-react";
import { siteData } from "@/data/siteMetaData";
import { motion, AnimatePresence } from "framer-motion";
import { TextSlice } from "@/utils/text-slice";
import { SizeFormatter } from "@/utils/size-convert";
import { Progress } from "@/components/ui/progress";

type ImageData = {
  original: string;
  converted: string | null;
  name: string;
  originalSize: number;
  convertedSize: number;
};

type ConversionSectionProps = {
  images: ImageData[];
  currentImageIndex: number;
  format: string;
  setFormat: (value: string) => void;
  isConverting: boolean;
  conversionProgress: number;
  setIsConverting: (val: boolean) => void;
  onConvert: () => void;
  onReset: () => void;
  showResult: boolean;
};

export function ConversionSection({
  images,
  currentImageIndex,
  format,
  setFormat,
  isConverting,
  conversionProgress,
  onConvert,
  showResult,
  onReset,
  setIsConverting,
}: ConversionSectionProps) {
  const currentImage = images[currentImageIndex];

  const formatOptions = [
    { value: "jpeg", label: "JPEG" },
    { value: "webp", label: "WebP" },
    { value: "png", label: "PNG" },
    { value: "gif", label: "GIF" },
    { value: "tiff", label: "TIFF" },
    { value: "bmp", label: "BMP" },
    { value: "avif", label: "AVIF" },
    { value: "heic", label: "HEIC" },
    { value: "svg", label: "SVG" },
    { value: "ico", label: "ICO" },
    { value: "eps", label: "EPS" },
    { value: "psd", label: "PSD" },
  ];

  const handleConvert = async () => {
    setIsConverting(true);
    onConvert();
  };

  return (
    <Card className="bg-background/60 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Image Conversion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3 bg-muted rounded-md relative">
                <ImageDetails
                  name={TextSlice(currentImage.name, 30, true)!}
                  format={currentImage.name.split(".").pop() || ""}
                  size={currentImage.originalSize}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onReset}
                  className="absolute -top-2 -right-2 shadow-md bg-background rounded-full"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="format" className="text-sm font-medium">
                  Convert to Format
                </Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format" className="w-1/2">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className=" grid grid-cols-3 gap-2">
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {isConverting && (
                <div className="h-20 w-full rounded-md overflow-hidden">
                  <div className="h-full w-full Loader dark:hidden"></div>
                  <div className="h-full w-full DarkLoader hidden dark:block"></div>
                </div>
              )}

              <Button
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  `Convert Image${images.length > 1 ? "s" : ""}`
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {currentImage.converted ? (
                <div className="bg-gradient-to-br from-primary/10  to-primary/10 dark:from-background dark:to-background p-6 rounded-lg ">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="text-green-500 h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-4">
                    Conversion Successful!
                  </h3>
                  <div className=" bg-white shadow  dark:bg-muted/50 rounded-md p-4 mb-4">
                    <ImageDetails
                      name={TextSlice(currentImage.name, 30, true)!}
                      format={format}
                      size={currentImage.convertedSize}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full ">
                      <a
                        href={currentImage.converted}
                        download={`${siteData.siteName}-${
                          currentImage.name.split(".")[0]
                        }.${format}`}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Converted Image
                      </a>
                    </Button>
                    <Button
                      onClick={onReset}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" /> Convert New Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow-lg text-center">
                  <p className="text-lg font-semibold text-red-600 dark:text-red-300">
                    Conversion failed. Please try again.
                  </p>
                  <Button onClick={onReset} variant="outline" className="mt-4">
                    Try Again
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function ImageDetails({
  name,
  format,
  size,
}: {
  name: string;
  format: string;
  size: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center space-x-3">
      <div className="bg-primary/10 p-2 rounded-full">
        <ImageIcon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="font-medium">
          {format ? `${name.slice(0, name.lastIndexOf("."))}.${format}` : name}
        </p>
        <p className="text-sm text-muted-foreground">
          {SizeFormatter(size)} •{" "}
          {format.toUpperCase() || name.split(".").pop()?.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
