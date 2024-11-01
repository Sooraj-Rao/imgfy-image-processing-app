"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadSection } from "@/components/image-compressor/upload-image";
import { ConversionSection } from "./com";
import { motion } from "framer-motion";

export default function ImageConverter() {
  const [images, setImages] = useState<
    {
      original: string;
      converted: string | null;
      name: string;
      originalSize: number;
      convertedSize: number;
    }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [conversionProgress, setConversionProgress] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [format, setFormat] = useState<string>("jpeg");

  const handleImageUpload = (files: File[]) => {
    const newImages = files.map((file) => ({
      original: URL.createObjectURL(file),
      converted: null,
      name: file.name,
      originalSize: file.size,
      convertedSize: 0,
    }));
    setImages([...images, ...newImages]);
  };

  const handleConversion = async () => {
    if (images.length === 0) return;

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
  };

  const convertImageFormat = async (
    file: File,
    format: string
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const image = new window.Image();
    const url = URL.createObjectURL(file);
    image.src = url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context?.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Conversion to selected format failed"));
        }, `image/${format}`);
        URL.revokeObjectURL(url);
      };
      image.onerror = () =>
        reject(new Error("Failed to load image for format conversion"));
    });
  };

  const resetConverter = () => {
    setImages([]);
    setConversionProgress(0);
    setIsConverting(false);
    setFormat("jpeg");
    setShowResult(false);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="h-full">
      <div className="container mx-auto sm:px-4 py-8 sm:w-[80%] w-full flex justify-center">
        {images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="sm:max-w-xl w-full bg-transparent">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">
                  Upload image for Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadSection onUpload={handleImageUpload} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="w-full bg-transparent shadow-none border-none">
            <CardContent className="mt-4 px-0 mx-4 sm:mx-0">
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
