/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ResourceCardSmall } from "@components/card/Resource";
import { Resource } from "@definitions/Resource/Resource";
import { classes } from "@utils/classes";
import Image from "next/image";

export const UserResources = ({
  resources,
  isAuthentifiedUser = false,
}: {
  resources: Resource[];
  isAuthentifiedUser?: boolean;
}) => {
  return (
    <div
      className={classes(
        "flex flex-col  space-y-3 bg-white rounded-lg lg:col-span-2 xl:col-span-3 w-full overflow-hidden"
      )}
    >
      <div className="inline-flex items-center justify-between w-full px-3 pt-4 mb-3">
        <h5 className="font-bold text-gray-900 font-marianne">
          Les ressources que{" "}
          {isAuthentifiedUser ? "vous avez créés" : "l'utilisateur a créé"}
        </h5>
        <div className="w-6 h-6">
          <Image
            alt="Books"
            src="/img/books.png"
            // layout="fill"
            width={24}
            height={24}
          />
        </div>
      </div>

      <div className="relative flex w-full gap-6 pb-4 overflow-x-auto snap-x">
        {resources.map((resource, idx) => (
          <div
            key={idx}
            className={classes(
              "snap-center shrink-0 ",
              idx !== 0 ? "first:pl-8" : "first:pl-4",
              idx !== resources.length - 1 ? "last:pr-8" : "last:pr-4"
            )}
          >
            <ResourceCardSmall {...resource} />
          </div>
        ))}
      </div>
    </div>
  );
};
