"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadSection } from "@/components/compressor/upload-image";
import { motion, AnimatePresence } from "framer-motion";
import { ConversionSection } from "./convert";

type ImageData = {
  original: string;
  converted: string | null;
  name: string;
  originalSize: number;
  convertedSize: number;
};

export default function ImageConverter() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [format, setFormat] = useState("jpeg");

  const handleImageUpload = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      original: URL.createObjectURL(file),
      converted: null,
      name: file.name,
      originalSize: file.size,
      convertedSize: 0,
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  }, []);

  const handleConversion = useCallback(async () => {
    if (images.length === 0) return;

    setIsConverting(true);
    setConversionProgress(0);

    const convertedImages = await Promise.all(
      images.map(async (image, index) => {
        const imageFile = await fetch(image.original).then((r) => r.blob());

        try {
          const convertedBlob = await convertImageFormat(
            imageFile as File,
            format
          );
          const convertedUrl = URL.createObjectURL(convertedBlob);
          const convertedSize = convertedBlob.size;

          setConversionProgress(((index + 1) / images.length) * 100);

          return { ...image, converted: convertedUrl, convertedSize };
        } catch (error) {
          console.error("Image conversion error:", error);
          return { ...image, converted: null, convertedSize: -1 };
        }
      })
    );

    setImages(convertedImages);
    setIsConverting(false);
    setShowResult(true);
  }, [images, format]);

  const convertImageFormat = async (
    file: File,
    format: string
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const quality = format === "jpeg" ? 0.6 : 0.8;

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Conversion to selected format failed"));
          },
          `image/${format}`,
          quality
        );
      };
      image.onerror = () =>
        reject(new Error("Failed to load image for format conversion"));
      image.src = URL.createObjectURL(file);
    });
  };

  const resetConverter = useCallback(() => {
    setImages([]);
    setConversionProgress(0);
    setIsConverting(false);
    setFormat("jpeg");
    setShowResult(false);
    setCurrentImageIndex(0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl ">
      <AnimatePresence mode="wait">
        {images.length === 0 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">
                  Upload Image for Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadSection onUpload={handleImageUpload} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="conversion"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ConversionSection
              images={images}
              currentImageIndex={currentImageIndex}
              format={format}
              setFormat={setFormat}
              isConverting={isConverting}
              conversionProgress={conversionProgress}
              setIsConverting={setIsConverting}
              onConvert={handleConversion}
              onReset={resetConverter}
              showResult={showResult}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
