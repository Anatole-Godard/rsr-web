import type { Resource } from "@definitions/Resource";
import { Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import dynamic from "next/dynamic";
import { Fragment, useState } from "react";

const Map: any = dynamic(() => import("@components/map/Map") as any, {
  ssr: false,
});

export const ChannelResource: React.FC<any> = ({
  slug,
  owner,
  createdAt,
  description,
  tags,
  data,
  likes,
  comments,
  validated,
}: Resource) => {
  const [message, setMessage] = useState<string>("");
  const [showComments, setShowComments] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-6 bg-gray-100 rounded-md shadow xl:rounded-xl">
        <div className="inline-flex justify-between">
          <div className="flex flex-col">
            <small className="-mb-2 text-xs text-gray-400 uppercase select-none font-spectral">
              Ressource -{" "}
              {data.type === "location"
                ? "Emplacement"
                : data.type === "external_link"
                ? "Lien externe"
                : data.type === "physical_item"
                ? "Objet"
                : ""}
            </small>
            <h4 className="text-xl font-extrabold xl:text-2xl font-marianne">
              {data.type === "location"
                ? data.attributes.properties.name
                : data.attributes.name}
            </h4>
            <p className="text-sm text-gray-700 font-marianne">
              crée par {owner}{" "}
              {typeof createdAt === "string"
                ? formatDistanceToNow(new Date(createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })
                : formatDistanceToNow(createdAt, {
                    addSuffix: true,
                    locale: fr,
                  })}
            </p>
          </div>
          <div className="inline-flex items-end text-xs select-none">
            {validated && (
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
            )}
            <ChatAltIcon className="w-4 h-4 ml-2 mr-1 text-gray-400" />
            <span className="text-gray-400">{comments.length}</span>
            <HeartIcon className="w-4 h-4 ml-2 mr-1 text-gray-400 " />
            <span className="text-gray-400">{likes}</span>
          </div>
        </div>
        <hr className="my-2" />
        {/* RESOURCE VIEW */}
        <ResourceView {...data} />
      </div>
      {/* COMMENTS */}

      {showComments ? (
        <>
          {comments.length > 0 && (
            <>
              <button
                className="inline-flex items-center w-full p-2 mt-2 text-sm duration-300 ease-linear rounded-md text-emerald-500 hover:bg-emerald-100 active:bg-emerald-300 active:text-emerald-700 max-w-max "
                onClick={() => setShowComments(false)}
              >
                <ChevronDownIcon className="w-4 h-4 mr-1 rotate-180 text-emerald-500" />
                Cacher les commentaires
              </button>
              <Transition
                as={Fragment}
                show={showComments}
                enter="transform transition duration-[400ms]"
                enterFrom="opacity-0  scale-50"
                enterTo="opacity-100 scale-100"
                leave="transform duration-200 transition ease-in-out"
                leaveFrom="opacity-100 scale-100 "
                leaveTo="opacity-0 scale-95 "
              >
                <div className="flex flex-col px-4 mt-2 space-y-2 overflow-y-auto rounded-md xl:rounded-xl">
                  {comments.map(
                    (
                      comment: {
                        photoURL: string;
                        owner: string;
                        content: string;
                      },
                      i
                    ) => (
                      <div
                        className="inline-flex p-2 space-x-6 rounded-md bg-gray-50"
                        key={i}
                      >
                        <img
                          src={comment.photoURL}
                          alt={comment.owner}
                          className="w-10 h-10 rounded-full"
                        ></img>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-700 font-marianne">
                            {comment.owner}
                          </p>
                          <p className="text-xs text-gray-600">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  <input
                    value={message}
                    placeholder="Écrivez un commentaire"
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 mt-2 bg-gray-100 rounded-md "
                  ></input>
                </div>
              </Transition>
            </>
          )}
        </>
      ) : (
        <button
          className="inline-flex items-center w-full p-2 mt-2 text-sm duration-300 ease-linear rounded-md text-emerald-500 hover:bg-emerald-100 active:bg-emerald-300 active:text-emerald-700 max-w-max "
          onClick={() => setShowComments(true)}
        >
          <ChevronDownIcon className="w-4 h-4 mr-1 text-emerald-500" />
          Afficher les commentaires ({comments.length})
        </button>
      )}
    </div>
  );
};

const ResourceView: React.FC<any> = ({
  type,
  attributes,
}: Resource["data"]) => {
  switch (type) {
    case "location":
      return (
        <div className="relative flex w-full h-48 p-10 overflow-hidden rounded-lg xl:flex-row">
          <Map
            point={attributes.geometry.coordinates as number[]}
            className="w-full xl:w-1/2 rounded-xl"
          />
        </div>
      );
      break;
    case "physical_item":
      return (
        <div className="flex w-full h-48 rounded-lg xl:flex-row">
          <img
            className="object-cover w-full h-auto xl:w-1/2 rounded-xl"
            src={attributes.photoURL}
            alt={attributes.name}
          />
          <div className="flex-col p-3">
            <p className="text-sm text-gray-700 font-marianne">
              {attributes.description}
            </p>
          </div>
        </div>
      );
      break;

    case "external_link":
      return (
        <div className="flex w-full h-48 rounded-lg xl:flex-row">
          <a
            className="flex items-center justify-center w-full h-auto text-green-500 bg-green-100 xl:w-1/2 rounded-xl"
            href={attributes.url}
          >
            {attributes.image ? (
              <img
                className="object-cover w-full h-full rounded-xl"
                src={attributes.image}
              />
            ) : (
              <ExternalLinkIcon className="w-16 h-16" />
            )}
          </a>
          <div className="flex-col p-3">
            <p className="text-sm text-gray-700 font-marianne">
              {attributes.description}
            </p>
          </div>
        </div>
      );
      break;

    default:
      return <>Unsupported</>;
      break;
  }
};
