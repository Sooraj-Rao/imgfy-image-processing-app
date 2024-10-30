import { StarsIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowUpIcon } from "@radix-ui/react-icons";

export const Hero = ({
  setShowCompressor,
}: {
  setShowCompressor: (val: boolean) => void;
}) => (
  <div className="container mx-auto px-4 py-16 text-center">
    <h1
      className="
        scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl
        bg-gradient-to-r from-rose-700 via-rose-300 to-rose-700 bg-clip-text text-transparent
      "
    >
      Fast, high-quality image compression in seconds
    </h1>
    <p className="text-xl mb-8 mt-4">
      Reduce file size without compromising quality
    </p>
    <Button
      onClick={() => setShowCompressor(true)}
      className=" group"
      size="lg"
    >
      Compress Now
      <div className=" w-0 overflow-hidden group-hover:w-4 duration-200">
        <ArrowUpIcon className=" rotate-45   " />
      </div>
    </Button>
  </div>
);
