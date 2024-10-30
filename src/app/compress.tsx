"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import {
  Upload,
  Download,
  RefreshCcw,
  Image as ImageIcon,
  Menu,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import Header from "@/components/header-footer";
import Image from "next/image";

export default function Compressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<string>("0");
  const [compressedFileSize, setCompressedFileSize] = useState<string>("0");
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [showCompressor, setShowCompressor] = useState<boolean>(false);

  const [quality, setQuality] = useState<number>(80);
  const [maxWidth, setMaxWidth] = useState<number>(800);
  const [maxHeight, setMaxHeight] = useState<number>(800);
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
      maxWidthOrHeight: Math.max(maxWidth, maxHeight),
      useWebWorker: true,
      initialQuality: quality / 100,
      onProgress: (progress: number) =>
        setCompressionProgress(Math.round(progress)),
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
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
    const image = new Image();
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
    setMaxWidth(800);
    setMaxHeight(800);
    setFormat("jpeg");
  };

  return (
    <main className="flex-grow">
      {!showCompressor ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1
            className="
            scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl
          bg-gradient-to-r from-rose-700 via-rose-300 to-rose-700 bg-clip-text text-transparent
          "
          >
            Fast, high-quality image compression in seconds
          </h1>
          <p className="text-xl mb-8">
            Reduce file size without compromising quality
          </p>
          <Button onClick={() => setShowCompressor(true)} size="lg">
            Compress Now
          </Button>
        </div>
      ) : (
        <div className="container mx-auto p-4 flex justify-center items-center">
          <Card className="w-full max-w-4xl">
            <CardContent className="p-6 space-y-4">
              {!originalImage ? (
                <Label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-lg text-gray-500">
                      Click to upload an image
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
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="quality" className="text-sm">
                        Quality: {quality}%
                      </Label>
                      <Slider
                        id="quality"
                        min={1}
                        max={100}
                        step={1}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="maxWidth" className="text-sm">
                          Max Width
                        </Label>
                        <Input
                          id="maxWidth"
                          type="number"
                          value={maxWidth}
                          onChange={(e) =>
                            setMaxWidth(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxHeight" className="text-sm">
                          Max Height
                        </Label>
                        <Input
                          id="maxHeight"
                          type="number"
                          value={maxHeight}
                          onChange={(e) =>
                            setMaxHeight(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format" className="text-sm">
                        Format
                      </Label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger id="format">
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
                      <Progress
                        value={compressionProgress}
                        className="w-full"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold">Original</h3>
                        <div className="aspect-square relative">
                          <Image
                            width={100}
                            height={100}
                            src={originalImage}
                            alt="Original"
                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Size: {originalFileSize} KB
                        </p>
                      </div>
                      {compressedImage && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Compressed</h3>
                          <div className="aspect-square relative">
                            <Image
                              width={100}
                              height={100}
                              src={compressedImage}
                              alt="Compressed"
                              className="absolute inset-0 w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Size: {compressedFileSize} KB
                          </p>
                        </div>
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
                      <RefreshCcw className="mr-2 h-4 w-4" /> Reset Compressor
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
