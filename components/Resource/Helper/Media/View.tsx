/* eslint-disable @next/next/no-img-element */
import { Media } from "@definitions/Resource/Media";
import { DocumentIcon, VideoCameraIcon, VolumeUpIcon } from "@heroicons/react/outline";
import Image from "next/image";

export const MediaView = ({ name, url, type }: Media) => {
    return (
      <div className="relative flex flex-col w-full h-full rounded-md sm:rounded-lg ">
        {type.includes("image") && (
          <Image src={url} alt={name} layout="fill" objectFit="cover" />
        )}
        {type.includes("audio") && (
          <div className="relative w-full h-full overflow-hidden bg-yellow-500">
            <img
              src="https://source.unsplash.com/random/?audio"
              className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
              alt="meeting"
            />
  
            <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[8]">
              <VolumeUpIcon className="w-24 h-24 stroke-[1.5] text-white" />
            </div>
          </div>
        )}
        {type.includes("video") && (
          <div className="relative w-full h-full overflow-hidden bg-blue-500">
            <video
              autoPlay={false}
              muted
              className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
            >
              <source src={url} type={type} />
              Your browser does not support the audio element.
            </video>
            <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[9]">
              <VideoCameraIcon className="w-24 h-24 stroke-[1.5] text-white" />
            </div>
          </div>
        )}
        {type.includes("application/pdf") && (
          <div className="relative w-full h-full overflow-hidden bg-green-500">
            <img
              src="https://source.unsplash.com/random/?document"
              className="z-[6] h-full xl:h-auto xl:w-full object-cover overflow-hidden absolute"
              alt="meeting"
            />
  
            <div className="absolute flex justify-center items-center h-full w-full bg-black bg-opacity-60 z-[8]">
              <DocumentIcon className="w-24 h-24 stroke-[1.5] text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };