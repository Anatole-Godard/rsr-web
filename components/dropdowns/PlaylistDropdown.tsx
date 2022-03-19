import { Playlist } from "@definitions/Playlist";
import { ResourceMinimum } from "@definitions/Resource";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  CollectionIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { classes } from "@utils/classes";
import { Fragment, useState } from "react";

export const PlaylistDropdown = ({
  resource,
}: {
  resource: ResourceMinimum;
}) => {
  const { user } = useAuth();
  const {
    data: playlists,
    error,
    loading,
  }: {
    data?: { data: { attributes: Playlist } };
    error?: any;
    loading: boolean;
  } = useFetchRSR(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/user/${
      user.data.uid
    }/resources/playlists`,
    user.session
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button
              className={classes(
                "btn-green",
                open && "bg-green-300 text-green-800"
              )}
            >
              <CollectionIcon className="w-4 h-4 mr-1 shrink-0 lg:mr-2" />
              Ajouter à la playlist
              <ChevronDownIcon
                className={classes(
                  "w-4 h-4 ml-1 lg:ml-2 duration-200 transition-all",
                  open && "rotate-180"
                )}
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 w-56 p-3 mt-2 origin-top-right bg-white rounded-md shadow lg:left-auto lg:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!error && !loading ? (
                <>
                  {playlists.data.attributes.keys.map(
                    (key: string, index: number) => (
                      <PlaylistCheckbox
                        name={key}
                        inPlaylist={
                          (
                            playlists.data.attributes[key] as ResourceMinimum[]
                          ).find((r) => r.slug === resource.slug) !== null
                        }
                        onCheck={() => console.log("change state")}
                        key={index}
                      />
                    )
                  )}
                  {playlists.data.attributes.keys.length > 0 && (
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  )}
                  <PlaylistCreator resource={resource} onSubmit={() => {}} />
                </>
              ) : (
                <div className="flex items-center justify-center h-16 text-sm font-spectral">
                  {loading ? "Chargement..." : "Une erreur est survenue"}
                </div>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

const PlaylistCheckbox = ({
  name,
  inPlaylist = false,
  onCheck,
}: {
  name: string;
  inPlaylist: boolean;
  onCheck: () => void;
}) => {
  const [checked, setChecked] = useState(inPlaylist);
  return (
    <label className="flex items-center justify-center py-2 space-x-2 text-sm font-medium duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-slate-600">
      <input
        type="checkbox"
        className="duration-300 accent-green-600"
        checked={checked}
        onChange={onCheck}
      />
      <span className="truncate">{name}</span>
    </label>
  );
};

const PlaylistCreator = ({
  resource,
  onSubmit,
}: {
  resource: ResourceMinimum;
  onSubmit: (e: any) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return open ? (
    <></>
  ) : (
    <button onClick={() => setOpen(true)} className="w-full btn-green">
      <PlusCircleIcon className="w-4 h-4 mr-1 lg:mr-2" />
      Créer une playlist
    </button>
  );
};
