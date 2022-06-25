import { AppLayout } from "@components/Layout/AppLayout";
import { UserPlaylistResources } from "@components/User/UserPlaylistsResources";
import { Playlist } from "@definitions/Playlist";
import { Disclosure, Transition } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ChevronUpIcon,
  CollectionIcon,
} from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { GetServerSideProps, NextPage } from "next";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const UserPlaylist: NextPage = () => {
  const { user } = useAuth();
  const t = useTranslations("UserPlaylist");
  const {
    data: playlists,
    error,
    loading,
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
    <AppLayout title="Mes playlists">
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
              {t("title")}
            </h3>
          </div>

          <Link href="/user">
            <a className="btn-gray h-fit w-fit">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              {t("back")}
            </a>
          </Link>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 grow xl:rounded-tl-xl">
          {loading && (
            <p className="flex items-center justify-center w-full font-spectral h-72">
              {t("loading")}
            </p>
          )}
          {error && (
            <p className="flex items-center justify-center w-full font-spectral h-72">
              {t("error")}
            </p>
          )}
          {playlists && playlists.keys.length > 0 ? (
            playlists?.keys.map((key: string, index: number) => (
              <Disclosure key={index} defaultOpen={index === 0}>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-2 text-sm font-medium text-left text-gray-700 duration-300 bg-gray-200 rounded-lg lg:w-1/3 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 active:bg-gray-50 focus-visible:ring-opacity-75 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600">
                      <span className="inline-flex items-center space-x-2 font-bold font-marianne">
                        <CollectionIcon className="w-4 h-4 mr-2" />
                        {key}
                      </span>
                      <ChevronUpIcon
                        className={`duration-300 ${
                          open ? "transform rotate-180" : ""
                        } w-5 h-5`}
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
                      <Disclosure.Panel static className="py-2 mb-2 ">
                        <UserPlaylistResources resources={playlists?.[key]} />
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))
          ) : (
            <p className="flex items-center justify-center w-full font-spectral h-72">
              {t("empty")}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
    props: {
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
export default UserPlaylist;
