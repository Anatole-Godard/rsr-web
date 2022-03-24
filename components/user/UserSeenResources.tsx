import { ResourceCard } from "@components/card/Resource";
import { Resource } from "@definitions/Resource";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
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
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-2 text-sm font-medium text-left text-gray-700 duration-300 bg-gray-200 rounded-lg lg:w-1/3 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 active:bg-gray-50 focus-visible:ring-opacity-75">
            <div className="inline-flex items-center">
              <div className="w-6 h-6 mr-3">
                <Image
                  alt="Books"
                  src="/img/books.png"
                  // layout="fill"
                  width={24}
                  height={24}
                />
              </div>
              <h5 className="font-bold text-gray-900 font-marianne">
                Les ressources que vous avez vues
              </h5>
            </div>
            <ChevronUpIcon
              className={`duration-300 ${
                open ? "transform rotate-180" : ""
              } w-5 h-5 `}
            />
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static className="mb-2 ">
              {resources.length > 0 ? (
                <div className="relative flex w-full space-x-4 overflow-x-auto snap-x">
                  {resources.map((resource, idx) => (
                    <div
                      key={idx}
                      className={classes(
                        "snap-center shrink-0 w-full max-w-[18rem]"
                      )}
                    >
                      <ResourceCard {...resource} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex w-full p-3 font-spectral">
                  Aucune ressource...
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
