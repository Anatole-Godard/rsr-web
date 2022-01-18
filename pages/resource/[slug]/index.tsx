/* eslint-disable @next/next/no-img-element */
import { AppLayout } from "@components/layouts/AppLayout";
import { Resource } from "@definitions/Resource/Resource";
import {
  ChatIcon,
  HeartIcon,
  PaperAirplaneIcon,
  PencilIcon,
  ShareIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import {
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Chip } from "@components/ui/Chip";
import { ChipList } from "@components/ui/ChipList";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

const ResourceSlug: NextPage<any> = ({
  slug,
  data,
  owner,
  description,
  comments,
  likes,
  tags,
}: Resource) => {
  const [message, setMessage] = useState<string>("");

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full max-h-full px-4 pb-4 space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col items-center justify-between w-full p-6 bg-gray-100 shadow-inner lg:h-full lg:max-h-full lg:w-1/4 lg:rounded-xl">
          <div className="flex-col items-center flex-shrink-0 w-full max-h-full space-y-2 lg:py-16">
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
            <h2 className="text-xl font-extrabold text-center font-marianne">
              {data.type === "location"
                ? data.attributes.properties.name
                : data.attributes.name}
            </h2>
            <p className="font-semibold text-center font-spectral">
              {owner.fullName}
            </p>
            {/* Chip component (merge ref/global-layout) */}
            <div className="flex justify-center w-full pb-2">
              <Chip name={data.type} size="small" color="gray" />
            </div>

            <div className="inline-flex justify-center w-full divide-x">
              <div className="flex flex-col items-center w-24 space-y-2">
                <ChatIcon className="w-6 h-6" />
                <p className="font-semibold font-spectral">
                  {comments?.length}
                </p>
              </div>
              <div className="flex flex-col items-center w-24 space-y-2">
                <ThumbUpIcon className="w-6 h-6" />
                <p className="font-semibold font-spectral">{likes}</p>
              </div>
            </div>
          </div>

          <div className="inline-flex justify-between w-full -mb-4">
            <div className="inline-flex flex-grow w-1/2 space-x-2 overflow-x-auto">
              <ChipList
                color="blue"
                list={tags?.map((tag: string) => tag.toString()) || []}
                size="small"
              />
            </div>
            <div className="inline-flex items-center justify-end flex-shrink-0 w-full space-x-2 max-w-max">
              <button className="px-2 text-gray-700 bg-gray-100 btn-red">
                <HeartIcon className="w-4 h-4" />
              </button>
              <button className="px-2 btn-gray">
                <ShareIcon className="w-4 h-4" />
              </button>
              <Link href={"/resource/" + slug + "/edit"}>
                <button className="px-2 btn-gray">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-full space-y-2 overflow-y-auto lg:space-y-4 lg:w-3/4">
          <div className="flex flex-col w-full bg-gray-100 shadow-inner lg:rounded-xl lg:h-2/5 ">
            <h2 className="w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Aperçu de la ressource
            </h2>
            <div className="relative w-full p-2 grow">
              <ResourceView {...data} slug={slug} />
            </div>
          </div>

          <div className="w-full bg-gray-100 shadow-inner h-1/5 lg:rounded-xl">
            <h2 className="w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Description
            </h2>
            <p className="px-3 pb-2 text-sm prose shrink-0">{description}</p>
          </div>

          <div className="flex flex-col flex-grow flex-shrink w-full bg-gray-100 shadow-inner max-h-[2/5] lg:rounded-xl">
            <h2 className="inline-flex items-center w-full px-3 pb-2 my-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Commentaires et avis
              <span className="h-3 px-1.5 ml-2 py-1 flex items-center justify-center bg-gray-200 rounded-full text-[0.6rem]">
                {comments?.length}
              </span>
            </h2>
            <div className="flex flex-col grow-0 shrink px-4 my-2 space-y-2 overflow-y-auto rounded-md h-full max-h-[12rem] xl:rounded-xl">
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
                      key={comment.createdAt.toString() + i}
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
                  className="mr-2 bg-gray-200 input"
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
  const res = await fetch(
    "http://localhost:3000/api/resource/" + context.params.slug
  );
  const body = await res.json();

  const resource: Resource[] = body?.data?.attributes;

  return {
    props: { ...resource },
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
        <Map
          point={attributes.geometry.coordinates as number[]}
          className="lg:rounded-xl"
        />
      );
      break;
    case "physical_item":
      return (
        <img
          className="object-cover w-auto h-full lg:rounded-xl"
          src={attributes.photoURL}
          alt={attributes.name}
        />
      );
      break;

    case "external_link":
      return (
        <a
          className="flex items-center justify-center w-auto h-full text-green-500 bg-green-100 lg:rounded-xl"
          href={attributes.url}
        >
          {attributes.image ? (
            <img
              className="object-cover h-full rounded-xl"
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
