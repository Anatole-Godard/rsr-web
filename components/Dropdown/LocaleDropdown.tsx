import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, FlagIcon } from "@heroicons/react/outline";
import { classes } from "@utils/classes";
import Link from "next/link";

export const LocaleDropdown = () => {
  return (
    <Menu
      as="div"
      className="relative flex items-center h-full"
      key="sidebar_dropdown-menu"
    >
      {({ open }) => (
        <>
          <Menu.Button key="sidebar_dropdown-btn">
            <div className="flex items-center">
              <span
                className={classes(
                  "btn-gray rounded-full",
                  open
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "bg-gray-100  dark:bg-gray-800"
                )}
              >
                <div className="flex items-center justify-center w-full h-full align-middle border-none rounded-full select-none ">
                  <FlagIcon className="w-4 h-4 mr-2" />
                  Langue
                  <ChevronDownIcon
                    key="sidebar_dropdown-icon"
                    className={classes(
                      "w-3 h-3 ml-2 duration-300 transition",
                      open && "rotate-180"
                    )}
                  />
                </div>
              </span>
            </div>
          </Menu.Button>
          <Transition
            show={open}
            className="absolute"
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
                "bg-white absolute mt-6 dark:bg-gray-900 text-base z-50 pb-2 list-none text-left rounded-xl shadow-lg w-full md:w-96"
              }
            >
              <>
                <div className="block px-4 py-2 pt-4 text-xs text-gray-400 font-spectral">
                  Langues
                </div>
                <Link href="/" locale="fr">
                  <a
                    className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out font-marianne dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800"
                    id="link-redirect-login"
                  >
                    Français
                  </a>
                </Link>
                <Link href="/" locale="en">
                  <a
                    className="inline-flex items-center w-full px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out font-marianne dark:text-gray-300 hover:text-bleuFrance-500 hover:bg-bleuFrance-50 dark:hover:bg-bleuFrance-800"
                    id="link-redirect-register"
                  >
                    Anglais
                  </a>
                </Link>
              </>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
