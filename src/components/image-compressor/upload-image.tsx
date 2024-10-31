import { Upload } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function UploadSection({
  onUpload,
}: {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center sm:p-8 w-full bg-transparent ">
      <Label htmlFor="image-upload" className="cursor-pointer w-full ">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 w-full text-center hover:border-primary transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Click to upload images
          </p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Max file size: 10MB per image
          </p>
        </div>
        <Input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onUpload}
          multiple
          className="hidden"
        />
      </Label>
    </div>
  );
}
