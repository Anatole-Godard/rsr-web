import type { Resource } from "@definitions/Resource";
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
    <div className="flex flex-col p-6 bg-gray-100 rounded-md xl:rounded-xl">
      <div className="flex flex-col">
        <h4 className="text-xl font-extrabold xl:text-3xl lg:text-2xl font-marianne">
          {data.type === "location"
            ? data.attributes.properties.name
            : data.attributes.name}
        </h4>
        <p className="text-sm text-gray-700 xl:text-base lg:text-lg font-marianne">
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
        <hr className="my-2" />
        {/* RESOURCE VIEW */}
        <ResourceView {...data} />
      </div>
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
        <div className="relative flex items-end justify-start w-full p-10 overflow-hidden bg-gray-300 rounded-lg xl:flex-row h-72">
          <div className="w-full xl:w-1/2">
            <Map point={attributes.geometry.coordinates as number[]} />
          </div>
        </div>
      );
      break;
    case "physical_item":
      return <></>;
      break;

    case "external_link":
      return <></>;
      break;

    default:
      return <>Unsupported</>;
      break;
  }
};
