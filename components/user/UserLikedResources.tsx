import { ResourceCard } from "@components/card/Resource";
import { Resource } from "@definitions/Resource";
import { useAuth } from "@hooks/useAuth";
import { classes } from "@utils/classes";
import Image from "next/image";
import { useMemo } from "react";

export const UserLikedResources = ({
  resources = [],
}: {
  resources: Resource[];
}) => {
  const { user } = useAuth();
  const isAuthentifiedUser = useMemo(
    () => resources.find((r) => r.owner.uid === user?.data.uid) !== undefined,
    [resources, user?.data.uid]
  );

  return (
    <div
      className={classes(
        "flex flex-col  space-y-3 bg-white rounded-lg lg:col-span-1 xl:col-span-1 w-full overflow-hidden"
      )}
    >
      <div className="inline-flex items-center justify-between w-full px-3 pt-4 mb-3">
        <h5 className="font-bold text-gray-900 font-marianne">
          Les ressources que{" "}
          {isAuthentifiedUser ? "vous avez aimé" : "l'utilisateur a aimé"}
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

      <div className="relative flex w-full gap-4 pb-4 overflow-x-auto snap-x">
        {resources.map((resource, idx) => (
          <div
            key={idx}
            className={classes(
              "snap-center shrink-0 w-full max-w-[18rem]",
              idx !== 0 ? "first:pl-8" : "first:pl-4",
              idx !== resources.length - 1 ? "last:pr-8" : "last:pr-4"
            )}
          >
            <ResourceCard {...resource} />
          </div>
        ))}
      </div>
    </div>
  );
};
