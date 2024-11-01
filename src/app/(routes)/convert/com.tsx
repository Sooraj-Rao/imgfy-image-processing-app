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
import { Download, Loader2, RefreshCcw, FileIcon, X } from "lucide-react";
import { siteData } from "@/data/siteMetaData";
import { motion, AnimatePresence } from "framer-motion";

export function ConversionSection({
  images,
  currentImageIndex,
  format,
  setFormat,
  isConverting,
  conversionProgress,
  onConvert,
  onReset,
  onRemoveImage,
}: {
  images: {
    original: string;
    converted: string | null;
    name: string;
  }[];
  currentImageIndex: number;
  format: string;
  setFormat: (value: string) => void;
  isConverting: boolean;
  conversionProgress: number;
  onConvert: () => void;
  onReset: () => void;
  onRemoveImage: (index: number) => void;
}) {
  const currentImage = images[currentImageIndex];
  const [showResult, setShowResult] = useState(false);

  const formatOptions = [
    { value: "jpeg", label: "JPEG" },
    { value: "webp", label: "WebP" },
    { value: "png", label: "PNG" },
    { value: "gif", label: "GIF" },
    { value: "tiff", label: "TIFF" },
    { value: "bmp", label: "BMP" },
  ];

  const handleConvert = () => {
    onConvert();
    setShowResult(true);
  };

  const handleReset = () => {
    onReset();
    setShowResult(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>File Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center space-x-2">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">{currentImage.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentImage.name.split(".").pop()?.toUpperCase()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Conversion Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format" className="text-sm font-medium">
                    Convert to Format
                  </Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format" className="w-full">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Conversion Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentImage.converted ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Converted File
                      </Label>
                      <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                        <FileIcon className="h-5 w-5 text-primary" />
                        <p className="text-sm">
                          {currentImage.name.split(".")[0]}.{format}
                        </p>
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
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Conversion failed. Please try again.
                  </p>
                )}
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Convert New Image
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isConverting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          <Progress value={conversionProgress} className="w-full" />
          <p className="text-sm text-center text-muted-foreground">
            {Math.round(conversionProgress)}% complete
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
