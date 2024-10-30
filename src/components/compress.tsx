"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { Upload, Download, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<string>("0");
  const [compressedFileSize, setCompressedFileSize] = useState<string>("0");
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<string>("jpeg");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (imageFile) {
      setOriginalImage(URL.createObjectURL(imageFile));
      setOriginalFileSize((imageFile.size / 1024).toFixed(2));
      setCompressedImage(null);
      setCompressedFileSize("0");
    }
  };

  const handleCompression = async () => {
    if (!originalImage) return;

    setIsCompressing(true);
    setCompressionProgress(0);

    const imageFile = await fetch(originalImage).then((r) => r.blob());
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
      initialQuality: quality / 100,
      onProgress: (progress: number) =>
        setCompressionProgress(Math.round(progress)),
    };

    try {
      const compressedFile = await imageCompression(imageFile as File, options);
      const outputBlob = await convertImageFormat(compressedFile, format);
      setCompressedImage(URL.createObjectURL(outputBlob));
      setCompressedFileSize((outputBlob.size / 1024).toFixed(2));
    } catch (error) {
      console.error("Image compression error:", error);
    } finally {
      setIsCompressing(false);
    }
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
        context?.drawImage(image, 0, 0);
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
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalFileSize("0");
    setCompressedFileSize("0");
    setCompressionProgress(0);
    setIsCompressing(false);
    setQuality(80);
    setFormat("jpeg");
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Add your Image for Compression here
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!originalImage ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer w-full max-w-md"
                >
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                      Click to upload an image
                    </p>
                    <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                      Max file size: 10MB
                    </p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality" className="text-sm font-medium">
                        Quality: {quality}%
                      </Label>
                      <Slider
                        id="quality"
                        min={1}
                        max={100}
                        step={1}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-sm font-medium">
                        Format
                      </Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger id="format" className="w-full">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpeg">JPEG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleCompression}
                      disabled={isCompressing}
                      className="w-full"
                    >
                      {isCompressing ? "Compressing..." : "Compress Image"}
                    </Button>
                    {isCompressing && (
                      <div className="space-y-2">
                        <Progress
                          value={compressionProgress}
                          className="w-full"
                        />
                        <p className="text-sm text-center text-gray-500">
                          {compressionProgress}% complete
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <ImagePreview
                        title="Original"
                        src={originalImage}
                        size={originalFileSize}
                      />
                      {!isCompressing ? (
                        <ImagePreviewAnim />
                      ) : (
                        <ImagePreview
                          title="Compressed"
                          src={compressedImage}
                          size={compressedFileSize}
                        />
                      )}
                    </div>
                    {compressedImage && (
                      <Button asChild className="w-full">
                        <a
                          href={compressedImage}
                          download={`compressed-image.${format}`}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                          Compressed Image
                        </a>
                      </Button>
                    )}
                    <Button
                      onClick={resetCompressor}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" /> Compress Another
                      Image
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </>
  );
}

function ImagePreview({
  title,
  src,
  size,
}: {
  title: string;
  src: string | null;
  size: string;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div
        className={cn(
          "aspect-square relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800",
          !src && "flex items-center justify-center"
        )}
      >
        {src && <Image src={src} alt={title} fill className="object-cover" />}
      </div>
      <p className="text-xs text-muted-foreground">Size: {size} KB</p>
    </div>
  );
}

function ImagePreviewAnim() {
  return (
    <div className=" mt-7">
      <div className="w-48 h-[11.8rem]  rounded bg-zinc-300 dark:bg-zinc-600 animate-pulse    "></div>
    </div>
  );
}
