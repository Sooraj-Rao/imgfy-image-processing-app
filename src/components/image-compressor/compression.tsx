import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  RefreshCcw,
} from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { MdOutlineCompare } from "react-icons/md";
import { SizeFormatter } from "@/utils/size-convert";
import { siteData } from "@/data/siteMetaData";
import { CardTitle } from "../ui/card";

export function CompressionSection({
  images,
  currentImageIndex,
  quality,
  setQuality,
  format,
  setFormat,
  isCompressing,
  compressionProgress,
  onCompress,
  onReset,
  onFullScreen,
  onPrevImage,
  onNextImage,
  comparisonValue,
  setComparisonValue,
  showComparison,
  setShowComparison,
  resizeWidth,
  setResizeWidth,
  resizeHeight,
  setResizeHeight,
  maintainAspectRatio,
  setMaintainAspectRatio,
  showAdvancedSettings,
  setShowAdvancedSettings,
}: {
  images: {
    original: string;
    compressed: string | null;
    name: string;
    originalSize: number;
    compressedSize: number;
  }[];
  currentImageIndex: number;
  quality: number;
  setQuality: (value: number) => void;
  format: string;
  setFormat: (value: string) => void;
  isCompressing: boolean;
  compressionProgress: number;
  onCompress: () => void;
  onReset: () => void;
  onFullScreen: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  comparisonValue: number;
  setComparisonValue: (value: number) => void;
  showComparison: boolean;
  setShowComparison: (value: boolean) => void;
  resizeWidth: number;
  setResizeWidth: (value: number) => void;
  resizeHeight: number;
  setResizeHeight: (value: number) => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (value: boolean) => void;
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (value: boolean) => void;
}) {
  const currentImage = images[currentImageIndex];
  const originalSize = SizeFormatter(currentImage.originalSize);
  const compressedSize =
    currentImage.compressedSize === -1
      ? "Compression not effective"
      : currentImage.compressedSize
      ? SizeFormatter(currentImage.compressedSize)
      : "Not compressed yet";

  const totalReduced =
    currentImage.compressedSize !== -1 && currentImage.compressedSize
      ? SizeFormatter(currentImage.originalSize - currentImage.compressedSize)
      : "0.00";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 w-full gap-6">
        <div className="sm:space-y-4 space-y-1">
          <p className=" font-semibold text-zinc-700 dark:text-zinc-300  mb-4 ">
            Compression Settings
          </p>
          <div className="space-y-2  ">
            <Label htmlFor="quality" className="text-sm font-medium">
              Compression level: {quality}%
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
            <div className="flex justify-between text-sm text-muted-foreground">
              <p>More compression</p>
              <p>Less compression</p>
            </div>
          </div>
          <br  className=" sm:hidden "/>
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
          <div className="flex items-center space-x-2">
            <Switch
              id="showAdvancedSettings"
              checked={showAdvancedSettings}
              onCheckedChange={setShowAdvancedSettings}
            />
            <Label className=" my-3 sm:my-0" htmlFor="showAdvancedSettings">
              Adjust Width and Height
            </Label>
          </div>
          {showAdvancedSettings && (
            <div className="space-y-4">
              <div className="flex justify-between gap-x-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="resizeWidth" className="text-sm font-medium">
                    Width (px)
                  </Label>
                  <Input
                    id="resizeWidth"
                    type="number"
                    min={0}
                    step={1}
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label htmlFor="resizeHeight" className="text-sm font-medium">
                    Height (px)
                  </Label>
                  <Input
                    id="resizeHeight"
                    type="number"
                    min={0}
                    step={1}
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 ">
                <Switch
                  id="maintainAspectRatio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
                <Label htmlFor="maintainAspectRatio">
                  Maintain Aspect Ratio
                </Label>
              </div>
              <br  className=" sm:hidden"/>
            </div>
          )}
          <Button
            onClick={onCompress}
            disabled={isCompressing}
            className="w-full"
          >
            {isCompressing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Compressing...
              </>
            ) : (
              `Compress Image${images.length > 1 ? "s" : ""}`
            )}
          </Button>
          {isCompressing && (
            <div className="space-y-2 ">
              <Progress value={compressionProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {compressionProgress}% complete
              </p>
            </div>
          )}
        </div>
        <div className="sm:space-y-4 space-y-1">
          <p className=" font-semibold text-zinc-700 dark:text-zinc-300 ">
            Image Preview
          </p>
          <div className="relative aspect-square rounded-2xl overflow-hidden ">
            {showComparison ? (
              <ComparisonSlider
                original={currentImage.original}
                compressed={currentImage.compressed}
                value={comparisonValue}
                onChange={setComparisonValue}
                isCompressing={isCompressing}
              />
            ) : (
              <Image
                src={currentImage.compressed || currentImage.original}
                alt={currentImage.name}
                fill
                className={`object-cover ${isCompressing ? "opacity-70" : ""}`}
              />
            )}
            {isCompressing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="animate-spin h-10 w-10 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              title="Full-Screen View"
              size="icon"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
              onClick={onFullScreen}
            >
              <Maximize2 className="h-4 w-4 text-white" />
            </Button>
          </div>

          {images.length > 1 && (
            <div className="flex justify-between items-center">
              <Button variant="outline" size="icon" onClick={onPrevImage}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <p className="text-sm text-center">
                Image {currentImageIndex + 1} of {images.length}
              </p>
              <Button variant="outline" size="icon" onClick={onNextImage}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="sm:space-y-4 space-y-0 ">
          <p className=" font-semibold text-zinc-700 dark:text-zinc-300 ">
            Result
          </p>
          <ul className="text-sm  space-y-1 pb-6 ">
            <li className=" flex justify-between">
              <span>Original Image Size</span>
              <span>{originalSize}</span>
            </li>
            {currentImage.compressed && (
              <>
                <li className=" flex justify-between">
                  <span>Total Size Reduced </span>
                  <span className="   ">{totalReduced}</span>
                </li>
                <li className=" flex justify-between ">
                  <span>New Image Size </span>
                  <span className="text-primary   font-semibold ">
                    {compressedSize}
                  </span>
                </li>
              </>
            )}
          </ul>
          <div
            className={`flex gap-2  ${
              currentImage.compressed ? "block" : "hidden"
            }`}
          >
            {currentImage.compressed && currentImage.compressedSize !== -1 ? (
              <Button asChild className="flex-1">
                <a
                  href={currentImage.compressed}
                  download={`${siteData.siteName}-${currentImage.name}.${format}`}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  {images.length > 1 && " All"}
                </a>
              </Button>
            ) : (
              <Button className="flex-1" disabled>
                Download
              </Button>
            )}
            {currentImage.compressedSize === -1 ? (
              <Button
                onClick={() => {
                  toast.info(
                    "Try changing the format or quality for better results."
                  );
                }}
                variant="outline"
                className="flex-1"
              >
                Suggest Alternatives
              </Button>
            ) : (
              <Button
                onClick={() => setShowComparison(!showComparison)}
                variant="outline"
                className="flex-1"
                disabled={!currentImage.compressed}
              >
                <MdOutlineCompare className="mr-2 h-4 w-4" />
                {showComparison ? (
                  <>
                    <span className=" sm:hidden">Dismiss</span>
                    <span className=" sm:block hidden">Hide Compare</span>
                  </>
                ) : (
                  "Compare"
                )}
              </Button>
            )}
          </div>
          <br  className=" sm:hidden"/>
          <Button onClick={onReset} variant="outline" className="w-full mt-4">
            <RefreshCcw className="mr-2 h-4 w-4" /> Compress New Image
            {images.length > 1 && "s"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ComparisonSlider({
  original,
  compressed,
  value,
  onChange,
  isCompressing,
}: {
  original: string;
  compressed: string | null;
  value: number;
  onChange: (value: number) => void;
  isCompressing?: boolean;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleInteraction = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      onChange((x / rect.width) * 100);
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleInteraction(event.clientX);

      const handleMouseMove = (e: MouseEvent) => handleInteraction(e.clientX);

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [handleInteraction]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleInteraction(event.touches[0].clientX);

      const handleTouchMove = (e: TouchEvent) =>
        handleInteraction(e.touches[0].clientX);

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    },
    [handleInteraction]
  );

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-full     select-none cursor-ew-resize ${
        isCompressing ? "opacity-70" : ""
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <Image
        src={compressed || original}
        alt="Compressed"
        fill
        className="object-cover"
      />
      <div
        className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        <Image src={original} alt="Original" fill className="object-cover" />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white"
        style={{ left: `calc(${value}% - 1px)` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <ChevronLeft className="w-4 h-4 text-gray-600" />
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50  text-white px-2 py-1 rounded text-sm">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        Compressed
      </div>
    </div>
  );
}
