import { Resource } from "@definitions/Resource";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChatAltIcon,
  ExternalLinkIcon,
  HandIcon,
  HeartIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { Fragment } from "react";

export const SearchComponent = ({
  isOpen,
  setIsOpen,
  filtered,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filtered: any[];
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-[39]"
        onClose={() => setIsOpen(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-baseline"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 mt-16 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-b-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                Recherche
              </Dialog.Title>
              <div className="flex flex-col mt-2 space-y-2">
                {filtered.length > 0 ? (
                  filtered.map((resource) => (
                    <ResourceSearch {...resource} key={resource.slug} />
                  ))
                ) : (
                  <div>Aucun résultat</div>
                )}
              </div>

              <div className="inline-flex justify-end w-full mt-4">
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="btn-red"
                >
                  Fermer
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const ResourceSearch = ({
  slug,
  data,
  owner,
  comments,
  likes,
}: {
  slug: string;
  data: Resource["data"];
  owner: any; //TODO
  comments: {
    content: string;
    createdAt: string;
    owner: {
      fullName: string;
      photoUrl: string;
      uid: string;
    };
  }[];
  likes: number; // todo
}) => {
  return (
    <a
      key={slug}
      className="inline-flex justify-between w-full px-4 py-2 transition-all duration-300 bg-gray-100 rounded-lg select-none hover:-translate-y-1 hover:shadow hover:bg-gray-200"
      onClick={() =>
        console.log({
          slug,
          data,
          owner,
          comments,
          likes,
        })
      }
    >
      <div className="inline-flex items-center">
        <span
          className={
            (data.type === "location"
              ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-500"
              : "") +
            (data.type === "physical_item"
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-500"
              : "") +
            (data.type === "external_link"
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-500"
              : "") +
            " rounded-xl w-10 h-10 flex items-center justify-center mx-auto"
          }
        >
          {data.type === "location" && (
            <LocationMarkerIcon className="w-4 h-4" />
          )}
          {data.type === "physical_item" && <HandIcon className="w-4 h-4" />}
          {data.type === "external_link" && (
            <ExternalLinkIcon className="w-4 h-4" />
          )}
        </span>
        <div className="flex flex-col h-full ml-3">
          <h5 className="text-base font-extrabold text-gray-700 font-marianne">
            {data.type === "location"
              ? data.attributes.properties.name
              : data.attributes.name}
          </h5>
          <p className="text-xs text-gray-600 font-marianne">
            par{" "}
            <span className="font-semibold text-blue-500">
              {owner.fullName}
            </span>
          </p>
        </div>
      </div>

      <div className="inline-flex items-center h-full py-2 space-x-2 text-xs">
        <ChatAltIcon className="w-3 h-3" />
        {comments.length}
        <HeartIcon className="w-3 h-3 -mt-0.5" />
        {likes}
      </div>
    </a>
  );
};
