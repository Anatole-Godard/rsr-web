import { AppLayout } from "@components/layouts/AppLayout";
import { Chip } from "@components/ui/Chip";
import { ChipList } from "@components/ui/ChipList";
import type { Resource } from "@definitions/Resource";
import {
  ChatIcon,
  CheckIcon,
  ExternalLinkIcon,
  HandIcon,
  HeartIcon,
  LocationMarkerIcon,
  PencilIcon,
  ShareIcon,
  ThumbUpIcon,
} from "@heroicons/react/outline";
import { fakeResource } from "@utils/faker.dev";
import { GetServerSideProps, NextPage } from "next";

import Link from "next/link";
import { useState } from "react";

const ResourceSlugEdit: NextPage<any> = ({
  slug,
  data,
  owner,
  description: defaultDescription,
  comments,
  likes,
  tags: defaultTags,
}: Resource) => {
  const [title, setTitle] = useState(
    data.type === "location"
      ? data.attributes.properties.name
      : data.attributes.name
  );
  const [description, setDescription] = useState(defaultDescription);
  const [tags, setTags] = useState(defaultTags);

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full max-h-full px-4 pb-4 space-y-2 lg:flex-row lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col items-center justify-between w-full h-full max-h-full p-6 bg-gray-100 shadow-inner lg:w-1/4 lg:rounded-xl">
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
            <input
              className="bg-gray-200 input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la ressource"
            />
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
              <button className="px-2 btn-green">
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full h-full space-y-2 overflow-y-auto lg:space-y-4 lg:w-3/4">
          <div className="flex flex-col w-full bg-gray-100 shadow-inner h-2/5 lg:rounded-xl">
            <h2 className="w-full px-3 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase border-b font-marianne">
              Description
            </h2>
            <div className="flex px-4 py-4 h-fit grow">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 pb-2 text-sm bg-gray-200 grow input active:bg-gray-300"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResourceSlugEdit;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      ...JSON.parse(JSON.stringify(fakeResource())),
      slug: context.query.slug,
    },
  };
};
