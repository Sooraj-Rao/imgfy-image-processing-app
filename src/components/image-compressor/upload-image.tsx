import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function UploadSection({
  onUpload,
}: {
  onUpload: (files: File[]) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 dark:border-gray-600 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-500 dark:text-gray-400 text-center mb-2">
          {isDragActive
            ? "Drop the images here..."
            : "Drag & drop images here, or click to select"}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center mb-4">
          Max file size: 10MB per image
        </p>
        <Button type="button">
          <File className="mr-2 h-4 w-4" />
          Select Files
        </Button>
      </div>
    </div>
  );
}
