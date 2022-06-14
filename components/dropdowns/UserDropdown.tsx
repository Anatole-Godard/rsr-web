/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTheme } from "next-themes";

import { Menu, Transition } from "@headlessui/react";

import Link from "next/link";
import {
  CogIcon,
  CollectionIcon,
  LoginIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  UserAddIcon,
} from "@heroicons/react/outline";

import { ArrowRightIcon, UserCircleIcon } from "@heroicons/react/solid";

import { useAuth } from "@hooks/useAuth";
import { classes } from "@utils/classes";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export const UserDropdown = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <Menu
      as="div"
      className="relative flex items-center h-full"
      key="user_dropdown-menu"
    >
      {({ open }) => (
        <>
          <Menu.Button key="user_dropdown-btn">
            <div className="flex items-center">
              {user ? (
                <div
                  className={classes(
                    "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-100  dark:bg-gray-900 dark:active:bg-gray-900  dark:hover:bg-gray-700",
                    open
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "bg-gray-100  dark:bg-gray-800"
                  )}
                >
                  <div className="w-5/6 align-middle border-none rounded-full select-none h-5/6 ">
                    <Image
                      key="user_dropdown-image"
                      layout="responsive"
                      alt={user.data.fullName}
                      width={16}
                      height={16}
                      className="rounded-full"
                      src={
                        user.data.photoURL
                          ? user.data.photoURL
                          : "https://ui-avatars.com/api/?name=" +
                            user.data.fullName +
                            "&color=007bff&background=054880"
                      }
                    />
                  </div>
                </div>
              ) : (
                <span
                  className={classes(
                    "btn-bleuFrance rounded-full px-2",
                    open ? "bg-bleuFrance-50" : "bg-bleuFrance-100 "
                  )} id="button-dropdown"
                >
                  <UserCircleIcon
                    key="user_dropdown-icon"
                    className="w-4 h-4 lg:mr-1"
                  />
                  <span className="hidden text-xs font-semibold lg:block">
                    Se connecter
                  </span>
                </span>
              )}
            </div>
          </Menu.Button>
          <Transition
            show={open}
            enter="transform transition duration-100 ease-in"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transform transition duration-75 ease-out"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items
              static
              className={
                "bg-white md:origin-top-right fixed md:absolute left-0 md:left-auto md:right-0 mt-6 dark:bg-gray-900 text-base z-50 float-left pb-2 list-none text-left rounded-xl shadow-lg w-full md:w-96"
              }
            >
              {user ? (
                <>
                  <Link href="/user">
                    <a className="inline-flex justify-between items-center  w-full min-h-[6rem] px-2 py-4 duration-300 rounded-t-xl hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-900 border-b dark:border-gray-800 border-gray-100 ">
                      <div className="inline-flex items-center">
                        <div className="relative flex items-center justify-center w-12 h-12 m-1 mr-2 text-xl text-white bg-white rounded-full shrink-0">
                          <Image
                            alt={user.data.fullName}
                            layout="fill"
                            className="rounded-full"
                            src={
                              user.data.photoURL || "/uploads/user/default.png"
                            }
                          />
                        </div>
                        <div className="flex flex-col px-1 space-y-1">
                          <span className="text-sm font-marianne font-medium overflow-ellipsis tracking-tight leading-[1.12rem] text-gray-800 dark:text-gray-200">
                            {user.data.fullName || "Name not provided"}
                          </span>
                          <span className="text-xs text-gray-600 font-spectral overflow-ellipsis dark:text-gray-200">
                            inscrit il y a{" "}
                            {formatDistance(
                              new Date(user.data.createdAt),
                              new Date(),
                              { locale: fr }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="pr-3">
                        <ArrowRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-200" />
                      </div>
                    </a>
                  </Link>

                  
                  <Link href="/user/playlists">
                    <a
                      className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 font-marianne dark:hover:bg-bleuFrance-800"
                      
                    >
                      <CollectionIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 font-marianne dark:border-gray-800" />
                      Mes playlists
                    </a>
                  </Link>

                  <a
                    className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 font-marianne dark:hover:bg-bleuFrance-800"
                    onClick={signOut}
                  >
                    <LogoutIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 font-marianne dark:border-gray-800" />
                    Déconnexion
                  </a>

                  {(user.session.role === "admin" ||
                    user.session.role === "superadmin") && (
                    <>
                      <div className="block px-4 py-2 text-xs text-gray-400 font-spectral">
                        Administration de la plateforme
                      </div>
                      <Link href="/admin">
                        <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800 font-marianne">
                          <CogIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800 " />
                          Administration
                        </a>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="block px-4 py-2 pt-4 text-xs text-gray-400 font-spectral">
                    Connexion
                  </div>
                  <Link href="/auth/login">
                    <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out font-marianne dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800" id="link-redirect-login">
                      <LoginIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800 " />
                      Connexion
                    </a>
                  </Link>
                  <Link href="/auth/register">
                    <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out font-marianne dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800" id="link-redirect-register">
                      <UserAddIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                      Inscription
                    </a>
                  </Link>
                  {/* <Link href="/auth">
              <a className="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800">
                Register
              </a>
            </Link> */}
                </>
              )}
              <div className="block px-4 py-2 text-xs text-gray-400 font-spectral">
                Thème de la plateforme
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-between w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 focus:outline-none hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800"
              >
                <span className="inline-flex items-center font-marianne">
                  {theme === "light" ? (
                    <>
                      <MoonIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                      Thème sombre
                    </>
                  ) : (
                    <>
                      <SunIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                      Thème clair
                    </>
                  )}
                </span>
                <span
                  style={{ opacity: 1 }}
                  className="hidden sm:block text-gray-400 text-sm leading-5 py-0.5 px-1.5 border border-gray-100 dark:border-gray-800 rounded-md bg-white select-none dark:bg-gray-900"
                >
                  <span className="sr-only">Appuyer sur </span>
                  <kbd className="font-sans">
                    <abbr className="no-underline">Ctrl</abbr>
                  </kbd>
                  <span className="sr-only"> et </span>
                  <kbd className="font-sans"> + D</kbd>
                  <span className="sr-only">
                    {" "}
                    pour activer/désactiver le thème sombre
                  </span>
                </span>
              </button>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
