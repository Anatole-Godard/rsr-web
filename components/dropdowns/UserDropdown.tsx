/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTheme } from "next-themes";

import { Menu, Transition } from "@headlessui/react";

import Link from "next/link";
import {
  CogIcon,
  LoginIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  UserAddIcon,
} from "@heroicons/react/outline";

import { ArrowRightIcon, UserIcon } from "@heroicons/react/solid";

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
                    "flex items-center justify-center h-8 px-2 text-sm transition duration-150 ease-in-out rounded-full min-w-min dark:bg-blue-800 focus:outline-none focus:border-gray-300 dark:border-gray-800 active:bg-blue-300 hover:bg-blue-100",
                    open ? "bg-blue-100" : "bg-blue-200 "
                  )}
                >
                  <UserIcon
                    key="user_dropdown-icon"
                    className="w-4 h-4 text-blue-500 lg:mr-1"
                  />
                  <span className="hidden text-xs font-semibold text-blue-500 lg:block">
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
                    <a className="inline-flex justify-between items-center  w-full min-h-[6rem] px-2 py-4 duration-300 rounded-t-xl hover:bg-blue-50 dark:hover:bg-blue-900 border-b dark:border-gray-800 border-gray-100 ">
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
                          <span className="text-xs font-normal text-gray-600 font-marianne overflow-ellipsis dark:text-gray-200">
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

                  <a
                    className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800"
                    onClick={signOut}
                  >
                    <LogoutIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                    Déconnexion
                  </a>

                  {(user.session.role === "admin" ||
                    user.session.role === "superadmin") && (
                    <>
                      <div className="block px-4 py-2 text-xs text-gray-400">
                        Administration de la plateforme
                      </div>
                      <Link href="/admin">
                        <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800">
                          <CogIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800 " />
                          Administration
                        </a>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="block px-4 py-2 pt-4 text-xs text-gray-400">
                    Connexion
                  </div>
                  <Link href="/auth/login">
                    <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800">
                      <LoginIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800 " />
                      Connexion
                    </a>
                  </Link>
                  <Link href="/auth/register">
                    <a className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800">
                      <UserAddIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                      Inscription
                    </a>
                  </Link>
                  {/* <Link href="/auth">
              <a className="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-800">
                Register
              </a>
            </Link> */}
                </>
              )}
              <div className="block px-4 py-2 text-xs text-gray-400">
                Thème de la plateforme
              </div>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-between w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 focus:outline-none hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800"
              >
                <span className="inline-flex items-center">
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
