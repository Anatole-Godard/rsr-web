/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { EyeIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { Animation } from "@components/Helper/Lottie";

import animationData from "public/lottie/home.json";
import {useTranslations} from 'next-intl';

export const HeroSection = () => {
  const t = useTranslations("HeroSection");
  const { user } = useAuth();
  return (
    <main>
      <div>
        <div className="pt-3 overflow-hidden sm:pt-6 lg:relative lg:py-16">
          <div className="max-w-md px-4 mx-auto sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
            <div className="">
              <div className="flex flex-col text-black select-none dark:text-white">
                <Image
                  src="/img/marianne.webp"
                  alt="Marianne"
                  width={506 / 15}
                  height={180 / 15}
                  layout="fixed"
                />
                <div className="mt-0.5 flex flex-col uppercase font-marianne font-bold text-[0.775rem] leading-3">
                  <span>Ministère</span>
                  <span>des Solidarités</span>
                  <span>et de la Santé</span>
                </div>
                <div className="mt-1.5 flex flex-col capitalize font-spectral font-medium italic text-[0.5rem] leading-[0.55rem]">
                  <span>Liberté</span>
                  <span>Égalité</span>
                  <span>Fraternité</span>
                </div>
              </div>

              <div className="mt-6 sm:max-w-xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-marianne dark:text-gray-100 sm:text-5xl">
                  {t("tagline")}
                  <span className="text-bleuFrance-500 dark:text-bleuFrance-400">
                    {t("buzz1")}
                  </span>
                  <span className="text-rougeMarianne-500">{t("buzz2")}</span>
                </h1>
                <p className="mt-6 text-justify text-gray-500 text-md font-spectral dark:text-gray-400">
                  {t("paragraph1")}
                  <br></br>
                  {t("paragraph2")}
                </p>
                <div className="flex items-center mt-6 space-x-3 sm:flex-row">
                  <Link href="/resource">
                    <a className="btn-bleuFrance" id="btn-resource-redirect">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      {t("resource-see")}
                    </a>
                  </Link>
                  {user ? (
                    <Link href="/resource/create">
                      <a className="btn-gray">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        {t("resource-create")}
                      </a>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <a className="btn-gray" id="btn-login-redirect">
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        {t("login")}
                      </a>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-fit sm:px-6 ">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden lg:block">
                <div className="absolute inset-y-0 w-screen left-1/2 bg-gray-50 dark:bg-gray-900 rounded-l-3xl lg:left-80 lg:right-0 lg:w-fit" />
                <svg
                  className="absolute -mr-3 top-8 right-1/2 lg:m-0 lg:left-0"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200 dark:text-gray-700"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={404}
                    height={392}
                    fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                  />
                </svg>
              </div>
              <div className="relative w-full pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                <div className="w-full bg-opacity-50 rounded-l-xl sm:rounded-r-xl lg:rounded-r-none bg-gray-50 dark:bg-gray-900 lg:h-full lg:w-auto ">
                  <Animation data={animationData} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
