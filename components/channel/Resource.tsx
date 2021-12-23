import type { Resource } from "@definitions/Resource";
import { Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationIcon,
  ExternalLinkIcon,
  HeartIcon,
  PaperAirplaneIcon,
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
              crée par {owner.fullName}{" "}
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
            <span className="text-gray-400">{comments?.length}</span>
            <HeartIcon className="w-4 h-4 ml-2 mr-1 text-gray-400 " />
            <span className="text-gray-400">{likes}</span>
          </div>
        </div>
        <hr className="my-2" />
        {/* RESOURCE VIEW */}
        <ResourceView {...data} slug={slug} />
      </div>
      {/* COMMENTS */}

      {showComments ? (
        <>
          {comments?.length > 0 && (
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
                  {comments?.map(
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
              </Transition>
            </>
          )}
        </>
      ) : (
        <button
          className="btn-text-green"
          onClick={() => setShowComments(true)}
        >
          <ChevronDownIcon className="w-4 h-4 mr-1 text-emerald-500" />
          Afficher les commentaires ({comments?.length || 0})
        </button>
      )}
    </div>
  );
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
        <div className="relative flex flex-col w-full h-48 p-10 overflow-hidden rounded-lg xl:flex-row">
          <Map
            point={attributes.geometry.coordinates as number[]}
            className="w-full xl:w-1/2 rounded-xl"
          />
          <div className="flex-col justify-between min-h-full p-3 xl:w-1/2">
            <p className="max-h-full text-sm text-gray-700 font-marianne">
              {JSON.stringify({ type, attributes, slug }, null, 2)}
            </p>
            <div className="inline-flex items-center justify-end w-full space-x-1">
              <button className="btn-text-red" onClick={like}>
                <HeartIcon className="w-4 h-4 mr-1 text-red-700" />
                J'aime
              </button>
              <button className="btn-text-yellow" onClick={like}>
                <ExclamationIcon className="w-4 h-4 mr-1 text-yellow-700" />
                Signaler
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case "physical_item":
      return (
        <div className="flex flex-col w-full h-48 rounded-lg xl:flex-row">
          <img
            className="object-cover w-full max-h-full xl:w-1/2 rounded-xl"
            src={attributes.photoURL}
            alt={attributes.name}
          />
          <div className="flex-col justify-between p-3 xl:w-1/2">
            <p className="max-h-full text-sm text-gray-700 font-marianne">
              {JSON.stringify({ type, attributes, slug }, null, 2)}
            </p>
            <div className="inline-flex items-center justify-end w-full space-x-1">
              <button className="btn-text-red" onClick={like}>
                <HeartIcon className="w-4 h-4 mr-1 text-red-700" />
                J'aime
              </button>
              <button className="btn-text-yellow" onClick={like}>
                <ExclamationIcon className="w-4 h-4 mr-1 text-yellow-700" />
                Signaler
              </button>
            </div>
          </div>
        </div>
      );
      break;

    case "external_link":
      return (
        <div className="flex flex-col w-full h-48 rounded-lg xl:flex-row">
          <a
            className="flex items-center justify-center w-full max-h-full text-green-500 bg-green-100 xl:w-1/2 rounded-xl"
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
          <div className="flex-col justify-between p-3 xl:w-1/2">
            <p className="max-h-full text-sm text-gray-700 font-marianne">
              {JSON.stringify({ type, attributes, slug }, null, 2)}
            </p>
            <div className="inline-flex items-center justify-end w-full space-x-1">
              <button className="btn-text-red" onClick={like}>
                <HeartIcon className="w-4 h-4 mr-1 " />
                J'aime
              </button>
              <button className="btn-text-yellow" onClick={like}>
                <ExclamationIcon className="w-4 h-4 mr-1" />
                Signaler
              </button>
            </div>
          </div>
        </div>
      );
      break;

    default:
      return <>Unsupported</>;
      break;
  }
};
