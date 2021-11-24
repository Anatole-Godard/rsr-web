/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/layouts/AppLayout";
import { Resource } from "@definitions/Resource";
import { PaperAirplaneIcon } from "@heroicons/react/outline";
import {
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { fakeResource } from "@utils/faker.dev";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import dynamic from "next/dynamic";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

const ResourceSlug: NextPage<any> = ({
  slug,
  data,
  owner,
  description,
  comments,
}: Resource) => {
  const [message, setMessage] = useState<string>("");

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full px-4 pb-4 space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col items-center w-full h-full p-6 space-y-2 bg-gray-100 shadow-inner lg:py-20 lg:w-1/4 lg:rounded-xl">
          <span
            className={
              (data.type === "location"
                ? "bg-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-500"
                : "") +
              (data.type === "physical_item"
                ? "bg-emerald-300 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-500"
                : "") +
              (data.type === "external_link"
                ? "bg-amber-300 text-amber-800 dark:bg-amber-900 dark:text-amber-500"
                : "") +
              " rounded-3xl w-32 h-32 flex items-center justify-center mx-auto"
            }
          >
            {data.type === "location" && (
              <LocationMarkerIcon className="w-10 h-10" />
            )}
            {data.type === "physical_item" && (
              <HandIcon className="w-10 h-10" />
            )}
            {data.type === "external_link" && (
              <ExternalLinkIcon className="w-10 h-10" />
            )}
          </span>
          <h2 className="text-xl font-extrabold font-marianne">
            {data.type === "location"
              ? data.attributes.properties.name
              : data.attributes.name}
          </h2>
          <p className="font-semibold font-spectral">{owner}</p>
          {/* Chip component (merge ref/global-layout) */}
        </div>
        <div className="flex flex-col items-center w-full h-full space-y-2 overflow-y-auto lg:space-y-4 lg:w-3/4">
          <div className="w-full bg-gray-100 shadow-inner lg:rounded-xl">
            <h2 className="w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Aperçu de la ressource
            </h2>
            {/* <div className="w-full h-64 my-2">
              <ResourceView {...data} slug={slug} />
            </div> */}
          </div>

          <div className="w-full bg-gray-100 shadow-inner lg:rounded-xl">
            <h2 className="w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Description
            </h2>
            <p className="px-3 pb-2 text-sm prose">{description}</p>
          </div>
          <div className="flex-shrink w-full max-h-full bg-gray-100 shadow-inner lg:rounded-xl">
            <h2 className="inline-flex items-center w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Commentaires et avis
              <span className="h-3 px-1.5 ml-2 py-1 flex items-center justify-center bg-gray-200 rounded-full text-[0.6rem]">
                {comments?.length}
              </span>
            </h2>
            <div className="flex flex-col px-4 my-2 space-y-2 overflow-y-auto rounded-md max-hfull xl:rounded-xl">
              {comments && comments?.length > 0 ? (
                comments.map(
                  (
                    comment: {
                      owner: {
                        photoURL: string;
                        fullName: string;
                        uid: string;
                      };
                      createdAt: Date | string;
                      content: string;
                    },
                    i
                  ) => (
                    <div
                      className="inline-flex p-2 space-x-6 rounded-md bg-gray-50"
                      key={i}
                    >
                      <img
                        src={comment.owner.photoURL}
                        alt={comment.owner.fullName}
                        className="w-10 h-10 rounded-full"
                      ></img>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-700 font-spectral">
                          {comment.owner.fullName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p className="text-sm text-gray-600">
                  Aucun commentaire pour le moment.
                </p>
              )}
              <div className="inline-flex items-center pb-2">
                <input
                  value={message}
                  placeholder="Écrivez un commentaire"
                  onChange={(e) => setMessage(e.target.value)}
                  className="mr-2 input"
                ></input>
                <button className="btn-green">
                  <PaperAirplaneIcon className="w-[1.25rem] h-[1.25rem] " />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResourceSlug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...JSON.parse(JSON.stringify(fakeResource())),
      slug: context.query.slug,
    },
  };
};

const ResourceView: React.FC<any> = ({
  type,
  attributes,
  slug,
}: {
  type: Resource["data"]["type"];
  attributes: Resource["data"]["attributes"];
  slug: string;
}) => {
  const like = async () => {
    console.log("liked", slug); //TODO
  };

  const report = async () => {
    console.log("report", slug); //TODO
  };

  switch (type) {
    case "location":
      return (
        <Map point={attributes.geometry.coordinates as number[]} className="" />
      );
      break;
    case "physical_item":
      return (
        <img
          className="object-cover w-full max-h-full"
          src={attributes.photoURL}
          alt={attributes.name}
        />
      );
      break;

    case "external_link":
      return (
        <a
          className="flex items-center justify-center w-full max-h-full text-green-500 bg-green-100"
          href={attributes.url}
        >
          {attributes.image ? (
            <img
              className="object-cover w-full h-full rounded-xl"
              src={attributes.image}
              alt={attributes.name}
            />
          ) : (
            <ExternalLinkIcon className="w-16 h-16" />
          )}
        </a>
      );
      break;

    default:
      return <>Unsupported</>;
      break;
  }
};
