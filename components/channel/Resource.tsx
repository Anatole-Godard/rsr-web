import type { Resource } from "@definitions/Resource";
import {
  ChatAltIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import dynamic from "next/dynamic";

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
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col p-6 bg-gray-100 rounded-md xl:rounded-xl">
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
      {comments.length > 0 && (
        <div className="flex flex-col p-6 mt-3 rounded-md xl:rounded-xl">
          {comments.map(
            (
              comment: { photoURL: string; owner: string; content: string },
              i
            ) => (
              <div className="inline-flex space-x-4" key={i}>
                <img src={comment.photoURL} alt={comment.owner}></img>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-700 font-marianne">
                    {comment.owner}
                  </p>
                  <p className="text-xs text-gray-600 font-marianne">
                    {comment.content}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
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
