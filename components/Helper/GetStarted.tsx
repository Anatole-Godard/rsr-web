import { Menu, Transition } from "@headlessui/react";
import { AcademicCapIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { classes } from "libs/classes";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

export const GetStarted = () => {
  const [cookie, setCookie] = useCookies(["rsr-get_started"]);
  const [show, setShow] = useState<boolean>(
    cookie["rsr-get_started"] !== "true"
  );
  const t = useTranslations("GetStarted");

  const { user } = useAuth();
  const {
    data: getStarted,
    error,
    loading,
    revalidate,
  }: {
    data?: {
      uid: string;
      create_account: boolean;
      create_resource: boolean;
      create_playlist: boolean;
      create_resource_comment: boolean;
      join_channel: boolean;
      done: number;
      remaining: number;
      total: number;
    };
    error?: any;
    loading: boolean;
    revalidate: () => void;
  } = useFetchRSR("/api/user/get-started", user?.session);
  const router = useRouter();

  useEffect(() => {
    revalidate();
    // disable eslint-disable-next-line because including revalidate calls it every millisecond
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  const handleClose = async () => {
    setShow(false);
    setCookie("rsr-get_started", true, {
      path: "/",
      maxAge: 3600 * 24, // Expires after 1day
      sameSite: true,
    });
  };

  return (
    user &&
    show && (
      <div className="fixed z-[60] left-4 md:left-20 xl:left-44 bottom-4">
        <Menu
          as="div"
          className="relative flex items-center h-full"
          key="sidebar_dropdown-menu"
        >
          {({ open }) => (
            <>
              <Menu.Button key="get_started_dropdown-btn">
                <div className="relative">
                  <div className="space-x-2 border border-green-500 shadow-xl btn-green">
                    <AcademicCapIcon className="w-4 h-4 mr-1" />
                    {t("button")}
                    <ChevronDownIcon
                      key="get_started_dropdown-icon"
                      className={classes(
                        "w-3 h-3 duration-300 transition",
                        open && "rotate-180"
                      )}
                    />
                  </div>
                  <div className="absolute w-4 h-4 text-[0.6rem] leading-4 text-green-100 bg-green-800 rounded-full -top-1 -right-1">
                    {getStarted?.remaining !== 0 ? getStarted?.remaining : "🥳"}
                  </div>
                </div>
              </Menu.Button>
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute left-0 p-4 origin-top-right transform -translate-y-full bg-white divide-y divide-gray-100 rounded-md shadow min-w-[22rem] -top-2 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:divide-gray-900"
                >
                  <div className="flex flex-col w-full">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 font-marianne">
                      {t("title")}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-spectral">
                      {t("subtitle")}
                    </p>
                    {getStarted && (
                      <>
                        <div className="flex justify-between mt-2 mb-1">
                          <span className="text-xs font-medium text-green-700 font-spectral dark:text-white">
                            {getStarted.done !== getStarted.total
                              ? t("todo")
                              : t("todo-none")}
                          </span>
                          <span className="text-xs font-medium text-green-700 font-marianne dark:text-white">
                            {(getStarted.done / getStarted.total) * 100}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{
                              width: `${
                                (getStarted.done / getStarted.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </>
                    )}
                    <hr className="my-2 border-gray-200" />
                    {error && (
                      <div className="flex items-center justify-center h-32 font-spectral">
                        {error}
                      </div>
                    )}
                    {loading && (
                      <div className="flex items-center justify-center h-32 font-spectral">
                        {t("loading")}
                      </div>
                    )}
                    {getStarted && (
                      <div className="flex flex-col space-y-1">
                        <Item
                          label={t("create_account")}
                          condition={getStarted?.create_account}
                          href="/"
                        />
                        <Item
                          label={t("create_resource")}
                          condition={getStarted?.create_resource}
                          href="/resource/create"
                        />
                        <Item
                          label={t("create_resource_comment")}
                          condition={getStarted?.create_resource_comment}
                          href="/resource"
                        />
                        <Item
                          label={t("create_playlist")}
                          condition={getStarted?.create_playlist}
                          href="/resource"
                        />
                        <Item
                          label={t("join_channel")}
                          condition={getStarted?.join_channel}
                          href="/channel"
                        />
                      </div>
                    )}
                    <div className="inline-flex justify-end w-full mt-3">
                      <button
                        onClick={handleClose}
                        className="px-2 py-1 text-sm btn-text-gray"
                      >
                        {getStarted && getStarted.remaining === 0
                          ? t("quit-button-done")
                          : t("quit-button-none")}
                      </button>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    )
  );
};

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useCookies } from "react-cookie";

const Item = ({
  label,
  condition,
  href,
}: {
  label: string;
  condition: boolean | (() => boolean);
  href: string;
}) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    //set interval to pass percentage to 100 after 2 seconds if condition is true
    if (condition) {
      const interval = setInterval(() => {
        if (percentage < 100) setPercentage((percentage) => percentage + 1);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [condition, percentage]);

  return (
    <Link href={href}>
      <a className="inline-flex items-center w-full p-1 duration-300 bg-transparent rounded-lg hover:bg-gray-100 active:bg-gray-50 dark:hover:bg-gray-900 dark:active:bg-gray-800">
        <span className="w-6 h-6 mr-3">
          <CircularProgressbar
            strokeWidth={10}
            value={percentage}
            styles={{
              path: {
                stroke:
                  percentage === 100
                    ? `rgba(34,197,94, 0.75)`
                    : `rgb(34,197,94)`,
                strokeLinecap: "butt",
                transition: "stroke-dashoffset 0.5s ease 0s",
                transformOrigin: "center center",
              },
              text: {
                fontSize: "4rem",
                fill:
                  percentage === 100
                    ? `rgb(255,255,255)`
                    : `rgba(34,197,94, ${percentage ? 100 : 0 / 100})`,
              },
              background: {
                fill: `rgb(34,197,94)`,
              },
            }}
            text={condition ? "✓" : ""}
            background={percentage === 100}
          />
        </span>
        <span
          className={classes(
            "text-xs font-spectral text-gray-600",
            condition && "line-through"
          )}
        >
          {label}
        </span>
      </a>
    </Link>
  );
};
