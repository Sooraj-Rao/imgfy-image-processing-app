import React from "react";
import Compressor from "../components/compress";
import Header, { Footer } from "@/components/header-footer";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Compressor />
      <Footer />
    </div>
  );
};

export default Page;
