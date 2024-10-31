"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UploadSection } from "./upload-image";
import { FullScreenView } from "./full-screen";
import { CompressionSection } from "./compression";

export default function ImageCompressor() {
  const [images, setImages] = useState<
    {
      original: string;
      compressed: string | null;
      name: string;
      originalSize: number;
      compressedSize: number;
    }[]
  >([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>("jpeg");
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [comparisonValue, setComparisonValue] = useState(50);
  const [showComparison, setShowComparison] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState<number>(1);
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [showAdvancedSettings, setShowAdvancedSettings] =
    useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        original: URL.createObjectURL(file),
        compressed: null,
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const handleCompression = async () => {
    if (images.length === 0) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    const compressedImages = await Promise.all(
      images.map(async (image, index) => {
        const imageFile = await fetch(image.original).then((r) => r.blob());
        const options = {
          maxSizeMB: showAdvancedSettings ? maxFileSize : 1,
          useWebWorker: true,
          initialQuality: quality / 100,
          maxWidthOrHeight: showAdvancedSettings
            ? Math.max(resizeWidth, resizeHeight) || undefined
            : undefined,
          onProgress: (progress: number) => {
            if (index === currentImageIndex) {
              setCompressionProgress(Math.round(progress));
            }
          },
        };

        try {
          const compressedFile = await imageCompression(
            imageFile as File,
            options
          );
          const outputBlob = await convertImageFormat(compressedFile, format);
          const compressedUrl = URL.createObjectURL(outputBlob);
          const compressedSize = outputBlob.size;

          // Check if compressed size is larger than original
          if (compressedSize >= image.originalSize) {
            return { ...image, compressed: null, compressedSize: -1 };
          }

          return { ...image, compressed: compressedUrl, compressedSize };
        } catch (error) {
          console.error("Image compression error:", error);
          return { ...image, compressed: null, compressedSize: -1 };
        }
      })
    );

    setImages(compressedImages);
    setIsCompressing(false);
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
        let width = image.width;
        let height = image.height;

        if (showAdvancedSettings && (resizeWidth > 0 || resizeHeight > 0)) {
          if (maintainAspectRatio) {
            const aspectRatio = image.width / image.height;
            if (resizeWidth > 0) {
              width = resizeWidth;
              height = width / aspectRatio;
            } else if (resizeHeight > 0) {
              height = resizeHeight;
              width = height * aspectRatio;
            }
          } else {
            width = resizeWidth > 0 ? resizeWidth : image.width;
            height = resizeHeight > 0 ? resizeHeight : image.height;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context?.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Conversion to selected format failed"));
          },
          `image/${format}`,
          quality / 100
        );
        URL.revokeObjectURL(url);
      };
      image.onerror = () =>
        reject(new Error("Failed to load image for format conversion"));
    });
  };

  const resetCompressor = () => {
    setImages([]);
    setCompressionProgress(0);
    setIsCompressing(false);
    setQuality(80);
    setFormat("jpeg");
    setCurrentImageIndex(0);
    setShowComparison(false);
    setMaxFileSize(1);
    setResizeWidth(0);
    setResizeHeight(0);
    setMaintainAspectRatio(true);
    setShowAdvancedSettings(false);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
    setShowComparison(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
    setShowComparison(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Image Compressor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {images.length === 0 ? (
              <UploadSection onUpload={handleImageUpload} />
            ) : (
              <CompressionSection
                images={images}
                currentImageIndex={currentImageIndex}
                quality={quality}
                setQuality={setQuality}
                format={format}
                setFormat={setFormat}
                isCompressing={isCompressing}
                compressionProgress={compressionProgress}
                onCompress={handleCompression}
                onReset={resetCompressor}
                onFullScreen={() => setShowFullScreen(true)}
                onPrevImage={handlePrevImage}
                onNextImage={handleNextImage}
                comparisonValue={comparisonValue}
                setComparisonValue={setComparisonValue}
                showComparison={showComparison}
                setShowComparison={setShowComparison}
                maxFileSize={maxFileSize}
                setMaxFileSize={setMaxFileSize}
                resizeWidth={resizeWidth}
                setResizeWidth={setResizeWidth}
                resizeHeight={resizeHeight}
                setResizeHeight={setResizeHeight}
                maintainAspectRatio={maintainAspectRatio}
                setMaintainAspectRatio={setMaintainAspectRatio}
                showAdvancedSettings={showAdvancedSettings}
                setShowAdvancedSettings={setShowAdvancedSettings}
              />
            )}
          </CardContent>
        </Card>
      </div>
      {showFullScreen && (
        <FullScreenView
          src={
            images[currentImageIndex]?.compressed ||
            images[currentImageIndex]?.original
          }
          onClose={() => setShowFullScreen(false)}
        />
      )}
    </div>
  );
}
