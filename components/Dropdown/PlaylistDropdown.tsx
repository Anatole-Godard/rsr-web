import { Playlist } from "@definitions/Playlist";
import { ResourceMinimum } from "@definitions/Resource";
import { Menu, Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CollectionIcon,
  PlusCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { classes } from "libs/classes";
import { fetchRSR } from "libs/fetchRSR";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

export const PlaylistDropdown = ({
  resource,
}: {
  resource: ResourceMinimum;
}) => {
  const { user } = useAuth();
  const t = useTranslations("PlaylistDropdown");
  const {
    data: playlists,
    error,
    loading,
    revalidate,
  }: {
    data?: Playlist;
    error?: any;
    loading: boolean;
    revalidate: () => void;
  } = useFetchRSR(
    `/api/user/${user.data.uid}/resources/playlists`,
    user.session
  );

  const manage = async (playlistKey: string, action: "add" | "remove") => {
    const toastID = toast.loading(
      action === "add" ? t("toast-add-loading") : t("toast-remove-loading")
    );
    const res = await fetchRSR(
      `/api/user/${user.data.uid}/resources/playlists/manage`,
      user.session,
      {
        method: action === "add" ? "POST" : "DELETE",
        body: JSON.stringify({
          playlistKey,
          resource,
        }),
      }
    );
    toast.dismiss(toastID);
    if (res.ok) {
      revalidate();
      toast.success(
        action === "add" ? t("toast-add-success") : t("toast-remove-success")
      );
    } else toast.error(t("toast-error"));
  };

  const deletePlaylist = async (key: string) => {
    const toastID = toast.loading(t("toast-delete-loading"));
    const res = await fetchRSR(
      `/api/user/${user.data.uid}/resources/playlists/delete`,
      user.session,
      {
        method: "DELETE",
        body: JSON.stringify({
          playlistKey: key,
        }),
      }
    );
    toast.dismiss(toastID);
    if (res.ok) {
      revalidate();
      toast.success(t("toast-delete-success"));
    } else {
      toast.error(t("toast-error"));
    }
  };

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
              <CollectionIcon className="w-4 h-4 md:mr-1 shrink-0 lg:mr-2" />
              <span className="hidden md:block">{t("button")}</span>
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
            <Menu.Items className="absolute left-0 min-w-[16rem] z-10 w-full p-3 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow lg:left-auto lg:right-0 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {!error && !loading ? (
                <>
                  {playlists?.keys.map((key: string, index: number) => (
                    <PlaylistCheckbox
                      name={key}
                      inPlaylist={
                        (playlists?.[key] as ResourceMinimum[]).find(
                          (r) => r.slug === resource.slug
                        ) != null
                      }
                      onCheck={(e) =>
                        manage(key, e.currentTarget.checked ? "add" : "remove")
                      }
                      onDelete={deletePlaylist}
                      key={index}
                    />
                  ))}
                  {playlists?.keys.length > 0 && (
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  )}
                  <PlaylistCreator
                    resource={resource}
                    revalidate={revalidate}
                  />
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
  onDelete,
}: {
  name: string;
  inPlaylist: boolean;
  // eslint-disable-next-line no-unused-vars
  onCheck: (e: any) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (key: string) => void;
}) => {
  const [checked] = useState(inPlaylist);

  return (
    <div className="inline-flex items-center w-full mb-2 space-x-2">
      <label className="flex items-center px-2 py-1 space-x-2 text-sm font-medium text-gray-600 duration-300 rounded-lg grow hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          className="duration-300 accent-green-600"
          checked={checked}
          onChange={onCheck}
        />
        <span className="truncate">{name}</span>
      </label>
      <button className="px-1 py-1 btn-gray" onClick={() => onDelete(name)}>
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

const PlaylistCreator = ({
  // resource,
  revalidate,
}: {
  resource: ResourceMinimum;
  revalidate: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");

  const { user } = useAuth();
  const t = useTranslations("PlaylistDropdown");

  const create = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (key) {
      const toastID = toast.loading(t("toast-create-loading"));
      const res = await fetchRSR(
        `/api/user/${user.data.uid}/resources/playlists/create`,
        user.session,
        {
          method: "POST",
          body: JSON.stringify({
            playlistKey: key,
          }),
        }
      );
      toast.dismiss(toastID);
      // const body = await res.json();
      // console.log(body);
      if (res.ok) {
        toast.success(t("toast-create-success"));
        setOpen(false);
        setKey("");
        revalidate();
      } else {
        toast.error(t("toast-create-error"));
      }
    }
  };

  return (
    <>
      {open ? (
        <form onSubmit={create} className="relative">
          <button
            onClick={() => setOpen(false)}
            type="button"
            className="absolute px-1 py-1 duration-300 transform -translate-y-1/2 cursor-pointer active:ring-0 ring-inset btn-gray top-1/2 left-2"
          >
            <XIcon className="w-4 h-4" />
          </button>
          <input
            name="key"
            type="text"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-10 py-2 placeholder-gray-400 dark:bg-gray-900 input text-ellipsis"
            // placeholder="Rechercher une ressource, un canal, un utilisateur..."
            placeholder={t("placeholder")}
          />
          <button
            type="submit"
            className="absolute px-1 py-1 duration-300 transform -translate-y-1/2 btn-green top-1/2 right-2"
          >
            <CheckCircleIcon className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="w-full btn-green">
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          {t("create")}
        </button>
      )}
    </>
  );
};
