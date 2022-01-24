/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  DocumentTextIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/outline";

import { classes } from "@utils/classes";
import { ChevronDownIcon } from "@heroicons/react/solid";

export const SidebarDropdownAdmin = () => {
  return (
    <Menu as="div" className="relative flex items-center h-full">
      {({ open }) => (
        <>
          <Menu.Button>
            <div className="flex items-center">
              <span
                className={classes(
                  "inline-flex items-center justify-center w-8 h-8 text-sm duration-300  rounded-full hover:bg-gray-300 active:bg-gray-50",
                  open ? "bg-gray-200" : "bg-gray-100"
                )}
              >
                <div className="flex items-center justify-center w-full h-full align-middle border-none rounded-full select-none ">
                  <ChevronDownIcon
                    className={classes(
                      "w-5 h-5 duration-300 transition",
                      open && "rotate-180"
                    )}
                  />
                </div>
              </span>
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
              <>
                <div className="block px-4 pt-4 text-xs text-gray-400">
                  Raccourcis
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  <Shortcut href="/admin" icon={HomeIcon} name="Tableau de bord" />
                  <Shortcut
                    href="/admin/resource"
                    icon={DocumentTextIcon}
                    name="Ressources"
                  />
                  <Shortcut href="/admin/user" icon={UserIcon} name="Utilisateurs" />
                </div>
              </>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

const Shortcut = ({ href, icon, name }) => (
  <Link href={href}>
    <a className="flex flex-col items-center w-full h-full text-sm text-gray-700 group ">
      <div className="flex items-center justify-center w-12 h-12 p-4 duration-300 bg-gray-200 rounded-full group-hover:bg-gray-300 active:bg-gray-100">
        {icon({ className: "w-6 h-6" })}
      </div>
      <span className="mt-2 text-xs font-spectral">{name}</span>
    </a>
  </Link>
);
