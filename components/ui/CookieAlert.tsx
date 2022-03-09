import { Transition } from "@headlessui/react";
import {
  ExternalLinkIcon,
  SparklesIcon,
  XIcon,
} from "@heroicons/react/outline";
import { classes } from "@utils/classes";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export const CookieAlert = () => {
  const router = useRouter();

  const [cookie, setCookie] = useCookies(["cookie-accepted"]);
  const [show, setShow] = useState<boolean>(
    cookie["cookie-accepted"] !== "true"
  );

  const [blur, setBlur] = useState(false);

  useEffect(() => {
    setTimeout(() => setBlur(true), 5000);
  }, [cookie]);

  const handleClose = async () => {
    setShow(false);
    setCookie("cookie-accepted", true, {
      path: "/",
      maxAge: 3600 * 24, // Expires after 1day
      sameSite: true,
    });
  };

  return (
    <div className="fixed w-full">
      <Transition
        as={Fragment}
        show={show}
        enter="transform transition duration-[400ms]"
        enterFrom="opacity-0 scale-50"
        enterTo="opacity-100 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 scale-100 "
        leaveTo="opacity-0 scale-95 "
      >
        <div className="sticky right-0 z-50 flex flex-col w-full max-w-lg p-3 space-y-3 md:p-6">
          <div
            className={classes(
              "group flex flex-col items-center justify-between h-full px-4 py-4 text-white bg-bleuFrance-500 border-0 motion-safe:backdrop-filter motion-safe:backdrop-blur-md rounded-xl duration-500 transition-all ease-in-out hover:bg-opacity-95 dark:bg-bleuFrance-200",
              blur ? "bg-opacity-10 text-bleuFrance-700 dark:bg-opacity-50" : "bg-opacity-90"
            )}
          >
            <div className="inline-flex items-center w-full h-full select-none">
              <SparklesIcon
                className={classes(
                  "shrink-0 w-4 h-4 mr-2 duration-500 transition-colors",
                  blur ? "group-hover:text-white" : ""
                )}
              />
              <span
                className={classes(
                  "inline-block mr-8 text-xs duration-500 transition-colors",
                  blur ? "group-hover:text-white" : ""
                )}
              >
                {
                  "Ce site utilise des cookies essentiels au bon fonctionnement de l'application "
                }
                <strong>uniquement</strong>.
              </span>

              {/* <span className="inline-flex items-center ">
                <button
                  className="font-semibold leading-none bg-transparent outline-none focus:outline-none"
                  onClick={() => setShow(false)}
                >
                  <XIcon className="w-4 h-4 duration-500 group-hover:text-white" />
                </button>
              </span> */}
            </div>
            <div
              className={classes(
                "inline-flex items-center w-full h-full pt-3 mt-3 select-none duration-500 transition-colors",
                blur
                  ? "border-bleuFrance-100 group-hover:border-bleuFrance-700"
                  : "border-bleuFrance-700"
              )}
            >
              <button
                onClick={() => router.push("/privacy/cookies")}
                className={classes(
                  "w-full mr-1.5 inline-flex justify-center items-center py-2 rounded-md text-sm font-spectral duration-500 transition-all",
                  blur
                    ? "bg-bleuFrance bg-opacity-10 group-hover:bg-bleuFrance-300 hover:bg-opacity-40 active:bg-opacity-30 group-hover:bg-opacity-25 group-hover:text-white"
                    : "bg-bleuFrance-300 bg-opacity-25 text-white hover:bg-opacity-40 active:bg-opacity-30"
                )}
              >
                <ExternalLinkIcon className="w-4 h-4 mr-2 transition-colors duration-300 group-hover:text-white" />
                En savoir plus
              </button>
              <button
                onClick={handleClose}
                className={classes(
                  "w-full ml-1.5 inline-flex justify-center items-center py-2 rounded-md text-sm font-spectral duration-500 transition-all",
                  blur
                    ? "bg-bleuFrance bg-opacity-10 group-hover:bg-bleuFrance-300 hover:bg-opacity-40 active:bg-opacity-30 group-hover:bg-opacity-25 group-hover:text-white"
                    : "bg-bleuFrance-300 bg-opacity-25 text-white hover:bg-opacity-40 active:bg-opacity-30"
                )}
              >
                <XIcon className="w-4 h-4 mr-2 transition-colors duration-300 group-hover:text-white" />
                Ne plus afficher
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};
