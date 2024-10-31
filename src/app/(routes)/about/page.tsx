"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { IoMdMail } from "react-icons/io";
import { IoMdChatboxes } from "react-icons/io";
import { PiCursorClickFill } from "react-icons/pi";
import Link from "next/link";
import { siteData } from "@/data/siteMetaData";

function AboutPage() {
  const { siteName } = siteData;
  const SocialData = [
    {
      title: "Email",
      link: siteData.email,
      icon: <IoMdMail className="h-5 w-5" />,
    },
    {
      title: "LinkedIn",
      link: siteData.linkedin,
      icon: <LinkedInLogoIcon className="h-5 w-5" />,
    },
    {
      title: "Portfolio",
      link: siteData.portfolio,
      icon: <PiCursorClickFill className="rotate-90 h-5 w-5" />,
    },
  ];

  const AppName = () => (
    <span className=" mx-[2px]  text-primary">{siteName}</span>
  );

  return (
    <div className="max-w-3xl mx-auto text-sm sm:text-base dark:text-gray-200 text-zinc-900">
      <div className=" border-transparent">
        <CardHeader>
          <CardTitle className=" text-lg ">About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs sm:text-base">
            <AppName />
            is an advanced image compression tool built to simplify reducing
            image file sizes without compromising on quality. With
            <AppName />, you can effortlessly compress high-resolution images,
            making it easier to store, share, or upload on various platforms.
          </p>
          <p className="text-xs sm:text-base">
            Whether you&apos;re a photographer looking to optimize your
            portfolio or a casual user needing to share photos with minimal file
            size, <AppName /> ensures your images retain the quality you need
            while fitting seamlessly within your storage or sharing
            requirements.
          </p>
        </CardContent>
      </div>
      <hr className="dark:border-foreground/20" />
      <div>
        <CardHeader className=" pt-4 pb-2">
          <CardTitle className="text-base">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs sm:text-base">
            Have any questions, feedback, or issues? We&apos;re here to help!
          </p>
          <div className="mt-6 flex space-x-4">
            <Link
              href={siteData.contact + "imageshrinkr_about"}
              target="_blank"
            >
              <Button
                variant="outline"
                className="flex gap-x-3 items-center w-fit hover:gap-2 group gap-0 p-2.5"
              >
                <span className="w-0 overflow-hidden group-hover:w-[4.9rem] duration-500">
                  Message us
                </span>
                <IoMdChatboxes className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
      <hr className="dark:border-foreground/20" />
      <div className="mb-4">
        <CardHeader className=" pt-4 pb-2">
          <CardTitle className="text-base">Socials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-xs sm:text-base">
            Connect with us on social media!
          </p>
          <div className="mt-6 flex space-x-4">
            {SocialData.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-fit hover:gap-2 flex items-center group gap-0 p-2.5"
                >
                  <span className="w-0 overflow-hidden group-hover:w-14 duration-500">
                    {item.title}
                  </span>
                  {item.icon}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </div>
    </div>
  );
}

export default AboutPage;
