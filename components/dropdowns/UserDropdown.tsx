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
  UserIcon,
} from "@heroicons/react/outline";

export const UserDropdown = () => {
  const { user, signout } = {
    user: {
      fullName: "John Doe",
      photoURL: "https://avatars3.githubusercontent.com/u/1234?s=460&v=4",
      uid: "1234567890",
      superuser: true,
    },
    signout: () => {},
  };
  const { theme, setTheme } = useTheme();

  return (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="flex items-center">
              {user ? (
                <span className="inline-flex items-center justify-center w-8 h-8 text-sm rounded-full">
                  <img
                    alt={user?.fullName}
                    className="w-full h-full align-middle border-none rounded-full select-none "
                    src={
                      user?.photoURL
                        ? user.photoURL
                        : "https://ui-avatars.com/api/?name=" +
                          user?.fullName +
                          "&color=007bff&background=054880"
                    }
                  />
                </span>
              ) : (
                <span className="flex items-center justify-center w-8 h-8 text-sm transition duration-150 ease-in-out bg-blue-200 rounded-full dark:bg-blue-800 focus:outline-none focus:border-gray-300 dark:border-gray-800">
                  <UserIcon className="w-5 h-5 text-blue-500" />
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
                  <Link href={"/profile/" + user?.uid}>
                    <a className="flex flex-col items-center justify-center w-full min-h-[6rem] px-2 py-4 duration-300 rounded-t-xl hover:bg-blue-50 dark:hover:bg-blue-900">
                      <div className="relative flex items-center justify-center w-16 h-16 m-1 mr-2 text-xl text-white bg-white rounded-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="object-cover h-full rounded-full"
                          alt={user.fullName}
                          src={user.photoURL}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center w-full px-1">
                        <span className="text-[0.7rem] overflow-ellipsis text-center tracking-tight leading-[1.12rem] text-gray-800 dark:text-gray-200">
                          {user?.fullName || "Name not provided"}
                        </span>
                      </div>
                    </a>
                  </Link>

                  <a
                    className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out cursor-pointer dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800"
                    onClick={signout}
                  >
                    <LogoutIcon className="w-6 h-6 pr-2 mr-2 text-center border-r border-gray-200 dark:border-gray-800" />
                    Déconnexion
                  </a>

                  {user.superuser && (
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
                  <Link href="/auth">
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