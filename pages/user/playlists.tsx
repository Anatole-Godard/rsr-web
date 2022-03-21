import { AppLayout } from "@components/layouts/AppLayout";
import { UserPlaylistResources } from "@components/user/UserPlaylistsResources";
import { Playlist } from "@definitions/Playlist";
import { Disclosure, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  CollectionIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const UserPlaylist: NextPage = () => {
  const { user } = useAuth();
  const {
    data: playlists,
    error,
    loading,
    revalidate,
    payload,
  }: {
    data?: Playlist;
    error?: any;
    loading: boolean;
    revalidate: () => void;
    payload?: any;
  } = useFetchRSR(
    `/api/user/${user?.data.uid}/resources/playlists`,
    user?.session
  );

  return (
    <AppLayout>
      <div className="flex flex-col w-full h-full bg-white dark:bg-black ">
        <div className="flex flex-col w-full px-6 py-6 space-y-3 bg-white lg:justify-between lg:items-end lg:flex-row shrink-0 lg:px-12 dark:bg-black dark:border-gray-800 lg:space-y-0">
          <div className="inline-flex items-center">
            <Image
              className="rounded-full"
              src={user?.data.photoURL || "/uploads/user/default.png"}
              width={32}
              height={32}
              alt={user?.data.fullName}
            />
            <h3 className="ml-5 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              Mes playlists
            </h3>
          </div>

          <Link href="/user">
            <a className="btn-gray h-fit w-fit">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Retour
            </a>
          </Link>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 grow xl:rounded-tl-xl">
          {loading && (
            <p className="flex items-center justify-center w-full font-spectral h-72">
              Chargement des playlists...
            </p>
          )}
          {error && (
            <p className="flex items-center justify-center w-full font-spectral h-72">
              Une erreur est survenue
            </p>
          )}
          {playlists &&
            playlists?.keys.map((key: string, index: number) => (
              <Disclosure key={index} defaultOpen={index === 0}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-2 text-sm font-medium text-left duration-300 rounded-lg lg:w-1/3 text-bleuFrance-700 bg-bleuFrance-100 hover:bg-bleuFrance-200 focus:outline-none focus-visible:ring focus-visible:ring-bleuFrance-500 focus-visible:ring-opacity-75">
                      <span className="inline-flex items-center space-x-2 font-spectral">
                        <CollectionIcon className="w-4 h-4 mr-2" />
                        {key}
                      </span>
                      <ChevronUpIcon
                        className={`${
                          open ? "transform rotate-180" : ""
                        } w-5 h-5 text-bleuFrance-500`}
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
                      <Disclosure.Panel
                        static
                        className="py-2 mb-2 "
                      >
                       <UserPlaylistResources resources={playlists?.[key]} />
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
        </div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const {
    cookies: { user },
  } = ctx.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };

  return {
    props: {},
  };
};
export default UserPlaylist;