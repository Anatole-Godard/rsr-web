import { AppLayout } from "@components/layouts/AppLayout";
import { ChipList } from "@components/ui/ChipList";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { fakeResource } from "@utils/faker.dev";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

import { useRef } from "react";
import { Rerousel } from "rerousel";

const Store: NextPage = () => {
  const { theme } = useTheme();
  const carouselRef = useRef(null);
  const [resources, setResources] = useState([
    fakeResource(),
    fakeResource(),
    fakeResource(),
    fakeResource(),
  ]);

  const [resourcesTrending, setResourcesTrending] = useState([
    fakeResource(),
    fakeResource(),
    fakeResource(),
    fakeResource(),
  ]);

  const background = (url: string) =>
    theme === "light"
      ? "-webkit-linear-gradient(top, #000091C0, #ffffffff), url('" + url + "')"
      : "-webkit-linear-gradient(top, #E1000FC0, #000000ff), url('" +
        url +
        "')";

  return (
    <AppLayout>
      {/* <div className="w-screen min-h-screen"> */}
      <div className="w-full h-96">
        <Rerousel itemRef={carouselRef} interval={5000}>
          {[
            {
              header: "La ressource phare en ce moment! 😎",
              paragraph:
                "Le ministère de la santé et de la solidarité crée une plateforme d'échange",
              backgroundUrl: "https://picsum.photos/1600/600",
            },
            {
              header: "JEU CONCOURS: Un iPhone 13 Pro à gagner! 😎",
              paragraph:
                "Le ministère de la santé et de la solidarité offre un iPhone 13 Pro au gagnant",
              backgroundUrl: "https://picsum.photos/1600/601",
            },
          ].map((el, key) => (
            <div
              key={key}
              className="z-20 flex flex-col items-start justify-center object-cover w-full p-12 rounded-tl-xl h-96"
              style={{
                background: background(el.backgroundUrl),
                opacity: 0.9,
              }}
              ref={carouselRef}
            >
              <h5 className="text-gray-900 dark:text-gray-200 text-md filter font-marianne">
                {el.header}
              </h5>
              <h5 className="text-3xl font-extrabold text-black dark:text-white filter font-marianne">
                {el.paragraph}
              </h5>
              <Link href="/">
                <a className="inline-flex items-center mt-4 font-bold text-black duration-150 ease-in text-md dark:text-white filter font-marianne focus:outline-none focus:text-blue-700 dark:focus:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                  Voir plus
                  <ArrowRightIcon className="w-4 h-4 ml-2 -mb-1" />
                </a>
              </Link>
            </div>
          ))}
        </Rerousel>
      </div>
      <div className="w-full p-6">
        <div className="z-50 hidden grid-cols-3 gap-3 -mt-16 md:grid xl:grid-cols-6 xl:gap-6">
          {resources.map((item, key) => (
            <ResourcePreview
              key={key}
              slug={item.slug}
              photoURL={"https://picsum.photos/400/" + (300 + key).toString()}
              name={
                item.data.type === "location"
                  ? item.data.attributes.properties.name
                  : item.data.attributes.name
              }
              description={item.description}
            />
          ))}
        </div>
        <div className="flex flex-col mt-12">
          <div className="inline-flex justify-between mb-6">
            <h5 className="text-xl font-bold">Tendances 🥵</h5>
            <Link href="/">
              <a className="inline-flex items-center font-bold text-black duration-150 ease-in opacity-100 text-md dark:text-white filter font-marianne focus:outline-none focus:text-blue-700 dark:focus:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                Voir plus
                <ArrowRightIcon className="w-4 h-4 ml-2 -mb-1" />
              </a>
            </Link>
          </div>

          <div className="w-full">
            <div className="grid grid-cols-3 gap-6 xl:grid-cols-6">
              {resourcesTrending.map((item) => (
                <ResourceTrending
                  key={item.slug}
                  slug={item.slug}
                  type={item.data.type}
                  tags={["tag1"]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* </div> */}
    </AppLayout>
  );
};

const ResourcePreview: React.FC<any> = ({
  photoURL,
  name,
  tagline,
  slug,
}: {
  photoURL: string;
  name: string;
  tagline?: string;
  slug: string;
}) => {
  return (
    <Link href={`/resource/${slug}`}>
      <a
        className="z-50 flex flex-col justify-end w-full duration-300 ease-linear shadow-lg cursor-pointer hover:shadow-lg h-28 rounded-xl hover:scale-105 focus:ring-2 ring-blue-500"
        style={{
          background:
            "-webkit-linear-gradient(top, transparent, #00000080), url('" +
            photoURL +
            "')",
        }}
      >
        <div className="flex flex-col w-full p-2 ">
          <h4 className="text-xs font-normal font-marianne text-gray-50">
            {name}
          </h4>
          <p className="text-[0.6rem] text-gray-300 font-marianne font-thin mt-0.5 truncate">
            {tagline}
          </p>
        </div>
      </a>
    </Link>
  );
};

const ResourceTrending: React.FC<any> = ({
  name,
  type,
  tags,
  slug,
}: {
  name: string;
  type: "location" | "physical_item" | "external_link" | string;
  tags?: string[];
  slug: string;
}) => {
  return (
    <Link href={`/resource/${slug}`}>
      <a className="flex flex-col w-full p-6 duration-300 ease-linear shadow cursor-pointer hover:shadow-lg rounded-xl hover:scale-105 focus:ring-2 ring-blue-500 group">
        <span
          className={
            (type === "location"
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-500"
              : "") +
            (type === "physical_item"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-500"
              : "") +
            (type === "external_link"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-500"
              : "") +
            " rounded-3xl w-20 h-20 flex items-center justify-center mx-auto"
          }
        >
          {type === "location" && <LocationMarkerIcon className="w-6 h-6" />}
          {type === "physical_item" && <HandIcon className="w-6 h-6" />}
          {type === "external_link" && <ExternalLinkIcon className="w-6 h-6" />}
        </span>
        <span className="mt-3 text-base font-medium text-gray-800 font-marianne dark:text-gray-200">
          {name}
        </span>
        <span className="mt-0.5 text-xs font-medium text-gray-600 font-marianne dark:text-gray-400">
          {tags?.[0]}
        </span>
      </a>
    </Link>
  );
};

export default Store;
