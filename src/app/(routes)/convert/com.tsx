"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  FileIcon,
  X,
  ImageIcon,
} from "lucide-react";
import { siteData } from "@/data/siteMetaData";
import { motion, AnimatePresence } from "framer-motion";
import { TextSlice } from "@/utils/text-slice";

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
}: {
  images: {
    original: string;
    converted: string | null;
    name: string;
  }[];
  currentImageIndex: number;
  format: string;
  showResult: boolean;
  setFormat: (value: string) => void;
  isConverting: boolean;
  conversionProgress: number;
  setIsConverting: (val: boolean) => void;
  onConvert: () => void;
  onReset: () => void;
}) {
  const currentImage = images[currentImageIndex];

  const formatOptions = [
    { value: "jpeg", label: "JPEG" },
    { value: "webp", label: "WebP" },
    { value: "png", label: "PNG" },
    { value: "gif", label: "GIF" },
    { value: "tiff", label: "TIFF" },
    { value: "bmp", label: "BMP" },
  ];

  const handleConvert = async () => {
    setIsConverting(true);
    onConvert();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.1 }}
      className=" sm:max-w-xl  mx-auto dark:border rounded-lg shadow-lg"
    >
      <Card className="w-full bg-transparent border-none shadow-none ">
        <CardHeader>
          <CardTitle>File Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center relative justify-between p-2 bg-muted/50 rounded-md">
            <div className=" sm:hidden ">
              <ImageDetails
                name={TextSlice(currentImage.name, 14, true) || ""}
                format=""
              />
            </div>
            <div className=" sm:block hidden">
              <ImageDetails
                name={TextSlice(currentImage.name, 30, true) || ""}
                format=""
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className=" absolute -top-4 -right-4 sm:top-2 sm:right-2 shadow-md sm:bg-transparent bg-muted rounded-full scale-75"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <Card className=" bg-transparent border-none shadow-none">
              <CardContent className="space-y-4">
                <div className="space-y-2 flex justify-between items-center">
                  <Label htmlFor="format" className="text-sm font-medium">
                    Convert to Format
                  </Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format" className="w-1/2">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isConverting && (
                  <div className=" hidden dark:block h-20  DarkLoader w-full rounded-md "></div>
                )}
                {isConverting && (
                  <div className=" dark:hidden block h-20  Loader w-full rounded-md "></div>
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
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1 }}
          >
            <Card className="bg-transparent border-none shadow-none">
              <CardHeader>
                <CardTitle>Converted File</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentImage.converted ? (
                  <div className="space-y-4">
                    <div className="space-y-2 bg-muted/50 rounded-md p-2 ">
                      <div className=" sm:hidden ">
                        <ImageDetails
                          name={TextSlice(currentImage.name, 14, true) || ""}
                          format={format}
                        />
                      </div>
                      <div className=" sm:block hidden">
                        <ImageDetails
                          name={TextSlice(currentImage.name, 30, true) || ""}
                          format={format}
                        />
                      </div>
                    </div>
                    <Button asChild className="w-full">
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
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" /> Convert New Image
                    </Button>
                  </div>
                ) : (
                  !isConverting && (
                    <p className="text-sm text-muted-foreground">
                      Conversion failed. Please try again.
                    </p>
                  )
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const ImageDetails = ({
  name,
  format,
}: {
  name: string;
  format: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <ImageIcon className="h-8 w-8 text-primary" />
      <div>
        <p className="font-medium">
          {format ? `${name.slice(0, name.lastIndexOf("."))}.${format} ` : name}
        </p>
        <p className="text-sm text-muted-foreground uppercase">
          {format ? format : name.split(".").pop()}
        </p>
      </div>
    </div>
  );
};
