/* eslint-disable @next/next/no-img-element */
import { ChevronRightIcon, StarIcon } from "@heroicons/react/solid";

import Link from "next/link";
import Image from "next/image";
import { EyeIcon, PlusIcon, UserCircleIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#E8E8E8" offset="20%" />
      <stop stop-color="#fff" offset="50%" />
      <stop stop-color="#E8E8E8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#E8E8E8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const HeroSection = () => {
  const { user } = useAuth();
  return (
    <main>
      <div>
        <div className="pt-3 overflow-hidden sm:pt-6 lg:relative lg:py-16">
          <div className="max-w-md px-4 mx-auto sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl lg:grid lg:grid-cols-2 lg:gap-24">
            <div className="">
              <Image
                src="/img/ministere.png"
                alt="Ministère de la santé et de la solidarité"
                width={175 / 1.4}
                height={150 / 1.4}
              />
              {/* <div>
                  <a className="inline-flex space-x-4 font-spectral">
                    <span className="rounded bg-bleuFrance  px-2.5 py-1 text-xs font-semibold text-white tracking-wide uppercase">
                      {"Quoi de neuf ?"}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm font-medium text-bleuFrance-500 dark:text-bleuFrance-300">
                      <span>Notre première release est disponible 🎉</span>
                      
                    </span>
                  </a>
              </div> */}
              <div className="mt-6 sm:max-w-xl">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-marianne dark:text-gray-100 sm:text-5xl">
                  {"Tissons des liens "}
                  <span className="text-bleuFrance-500 dark:text-bleuFrance-400">
                    ense
                  </span>
                  <span className="text-rougeMarianne-500">mble</span>
                </h1>
                <p className="mt-6 text-justify text-gray-500 text-md font-spectral dark:text-gray-400">
                  Entrez dans un salon de discussion, discutez, échangez,
                  partagez vos idées, vos expériences, vos projets, vos
                  réflexions.
                  <br></br>
                  Tissez des liens entre vous et chaque citoyen grâce aux
                  ressources que vous trouverez sur le site.
                </p>
                <div className="flex items-center mt-6 space-x-3 sm:flex-row">
                  <Link href="/resource">
                    <a className="btn-bleuFrance">
                      <EyeIcon className="w-4 h-4 mr-2" />
                      Consulter les ressources
                    </a>
                  </Link>
                  {user ? (
                    <Link href="/resource/create">
                      <a className="btn-gray">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Créer une ressource
                      </a>
                    </Link>
                  ) : (
                    <Link href="/auth/login">
                      <a className="btn-gray">
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Se connecter
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
              <div className="relative pl-4 -mr-40 sm:mx-auto sm:max-w-3xl sm:px-0 lg:max-w-none lg:h-full lg:pl-12">
                <div className="w-full rounded-md shadow bg-gray-50 ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto ">
                  {/* <Image
                    className="rounded-md lg:rounded-l-xl lg:rounded-r-none "
                    src="/img/bg/hero.jpg"
                    alt="Hero banner"
                    layout="fill"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(700, 475)
                    )}`}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-wide text-center text-gray-500 uppercase">
            Trusted by over 5 very average small businesses
          </p>
          <div className="grid grid-cols-2 gap-8 mt-6 md:grid-cols-6 lg:grid-cols-5">
            <div className="flex justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
                alt="Tuple"
              />
            </div>
            <div className="flex justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
                alt="Mirage"
              />
            </div>
            <div className="flex justify-center col-span-1 md:col-span-2 lg:col-span-1">
              <img
                className="h-12"
                src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
                alt="StaticKit"
              />
            </div>
            <div className="flex justify-center col-span-1 md:col-span-2 md:col-start-2 lg:col-span-1">
              <img
                className="h-12"
                src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
                alt="Transistor"
              />
            </div>
            <div className="flex justify-center col-span-2 md:col-span-2 md:col-start-4 lg:col-span-1">
              <img
                className="h-12"
                src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
                alt="Workcation"
              />
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </main>
  );
};
