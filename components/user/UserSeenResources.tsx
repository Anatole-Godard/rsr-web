import { ResourceCard } from "@components/card/Resource";
import { Resource } from "@definitions/Resource";
import { useAuth } from "@hooks/useAuth";
import { classes } from "@utils/classes";
import Image from "next/image";
import { useMemo } from "react";

export const UserSeenResources = ({
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
                "flex flex-col shadow space-y-3 bg-white rounded-lg lg:col-span-1 xl:col-span-2 w-full overflow-hidden"
            )}
        >
            <div className="inline-flex items-center justify-between w-full px-3 pt-4">
                <h5 className="font-bold text-gray-900 font-marianne">
                    Les ressources que vous avez vues
                </h5>
                <div className="w-6 h-6">
                    {/* TODO: Change image */}
                    <Image
                        alt="Books"
                        src="/img/books.png"
                        // layout="fill"
                        width={24}
                        height={24}
                    />
                </div>
            </div>

            {resources.length > 0 ? (
                <div className="relative flex w-full gap-4 py-4 overflow-x-auto snap-x">
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
            ) : (
                <div className="flex items-center justify-center w-full h-32 font-spectral">
                    Aucune ressource...
                </div>
            )}
        </div>
    );
};
