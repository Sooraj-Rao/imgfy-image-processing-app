import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader,
  Loader2,
  Maximize2,
  RefreshCcw,
} from "lucide-react";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

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
  maxFileSize,
  setMaxFileSize,
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
  maxFileSize: number;
  setMaxFileSize: (value: number) => void;
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
  const originalSize = (currentImage.originalSize / 1024).toFixed(2);
  const compressedSize =
    currentImage.compressedSize === -1
      ? "Compression not effective"
      : currentImage.compressedSize
      ? `${(currentImage.compressedSize / 1024).toFixed(2)} KB`
      : "Not compressed yet";

  return (
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
          <div className="flex  items-center space-x-2">
            <Switch
              id="showAdvancedSettings"
              checked={showAdvancedSettings}
              onCheckedChange={setShowAdvancedSettings}
            />
            <Label htmlFor="showAdvancedSettings">Show Advanced Settings</Label>
          </div>
          {showAdvancedSettings && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize" className="text-sm font-medium">
                  Max File Size (MB)
                </Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={maxFileSize}
                  onChange={(e) => setMaxFileSize(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resizeWidth" className="text-sm font-medium">
                  Resize Width (px)
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
              <div className="space-y-2">
                <Label htmlFor="resizeHeight" className="text-sm font-medium">
                  Resize Height (px)
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintainAspectRatio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
                <Label htmlFor="maintainAspectRatio">
                  Maintain Aspect Ratio
                </Label>
              </div>
            </div>
          )}
          <Button
            onClick={onCompress}
            disabled={isCompressing}
            className="w-full"
          >
            {isCompressing
              ? "Compressing..."
              : `Compress Image${images.length > 1 ? "s" : ""}`}
          </Button>
          {isCompressing && (
            <div className="space-y-2">
              <Progress value={compressionProgress} className="w-full" />
              <p className="text-sm text-center text-gray-500">
                {compressionProgress}% complete
              </p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                className={`object-cover
                ${isCompressing && "opacity-70"}
                `}
              />
            )}
            <div
              className={` absolute left-1/2 top-1/2  p-1   -translate-x-1/2 -translate-y-1/2 
            ${isCompressing ? "block" : "hidden"}
            `}
            >
              <Loader2 className={` animate-spin  h-10 w-10   `} />
            </div>
            <Button
              variant="ghost"
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
          <p className="text-sm text-center">
            Original: {originalSize} KB | Compressed: {compressedSize}
          </p>
          <div className="flex gap-2">
            {currentImage.compressed && currentImage.compressedSize !== -1 ? (
              <Button asChild className="flex-1">
                <a
                  href={currentImage.compressed}
                  download={`compressed-${currentImage.name}.${format}`}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
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
                    "Try changing the format or quality  for better results."
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
                {showComparison ? "Hide Comparison" : "Compare"}
              </Button>
            )}
          </div>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" /> Compress New Image
            {images.length > 1 ? "s" : ""}
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
      className={`relative w-full h-full select-none cursor-ew-resize
      ${isCompressing && " opacity-70"}
      `}
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
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        Original
      </div>
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        Compressed
      </div>
    </div>
  );
}
