import { NextSeo } from "next-seo";
import { useState } from "react";

const backgrounds = [
  "https://images.unsplash.com/photo-1616587896649-79b16d8b173d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1519671282429-b44660ead0a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80",
  "https://images.unsplash.com/photo-1461595520627-42e3c83019bc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1489&q=80",
  "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80",
  "https://images.unsplash.com/1/bag-and-hands.jpg?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1347&q=80",
];

export const GuestLayout = ({
  title = "Chargement...",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) => {
  const [background] = useState(
    backgrounds[Math.floor(Math.random() * backgrounds.length)]
  );
  return (
    <>
      <NextSeo title={`${title} - RSR`} />

      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 shadow-lg sm:px-6 lg:flex-none dark:flex-auto lg:px-20 xl:px-24">
          {children}
        </div>
        <div className="relative flex-1 hidden w-0 lg:block dark:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute inset-0 object-cover w-full h-full"
            src={background}
            alt="GuestBackground"
          />
          <div className="absolute inset-0 w-full h-full bg-black bg-opacity-80"></div>
        </div>
      </div>
    </>
  );
};
