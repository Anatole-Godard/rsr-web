import { ResourceCard } from "@components/Resource/Card";
import { Resource } from "@definitions/Resource";
import { classes } from "libs/classes";

export const UserPlaylistResources = ({
  resources = [],
}: {
  resources: Resource[];
}) => {
  return (
    <div
      className={classes(
        "flex flex-col shadow space-y-3 dark:bg-gray-900 min-h-[8rem] rounded-lg w-full overflow-hidden"
      )}
    >
      {resources.length > 0 ? (
        <div className="relative flex w-full gap-4 overflow-x-auto snap-x">
          {resources.map((resource, idx) => (
            <div
              key={idx}
              className={classes(
                "snap-center shrink-0 w-full max-w-[18rem]",
                // "first:pl-4 last:pr-4"
              )}
            >
              <ResourceCard {...resource} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-32 font-spectral">
          Aucune ressource...
        </div>
      )}
    </div>
  );
};
