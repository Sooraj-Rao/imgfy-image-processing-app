import Image from "next/image";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export function FullScreenView({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
    >
      <div className="relative max-w-full max-h-full">
        <Image
          src={src}
          alt="Full Screen View"
          width={1200}
          height={800}
          className="rounded-lg"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
          onClick={onClose}
        >
          <X className="h-6 w-6 text-white" />
        </Button>
      </div>
      <p className="absolute bottom-4 text-white text-sm">
        Click anywhere to close
      </p>
    </div>
  );
}
