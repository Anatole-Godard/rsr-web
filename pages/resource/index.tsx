import { ResourceCard } from "@components/Resource/Card";
import { AppLayout } from "@components/Layout/AppLayout";
import { Resource } from "@definitions/Resource";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { NextPage } from "next";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { types } from "constants/resourcesTypes";
import { useRouter } from "next/router";
import { useAuth } from "@hooks/useAuth";
import { useTranslations } from "next-intl";

const ResourceIndex: NextPage<any> = ({
  resources,
  q = null,
  type,
}: {
  resources: Resource[];
  q: string;
  type: string;
}) => {
  const router = useRouter();
  const [displayables, setDisplayables] = useState(resources);

  const [query, setQuery] = useState(q || "");
  const [selectedType, setType] = useState(type || null);

  const { user } = useAuth();
  const t = useTranslations("ResourceIndex");

  useEffect(() => {
    setQuery(router.query.q as string);
  }, [router.query.q]);

  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams();
      if (query) urlParams.append("q", query);
      if (selectedType) urlParams.append("type", selectedType);
      const res = await fetch(
        `/api/resource${
          urlParams.toString() !== "" ? "?" + urlParams.toString() : ""
        }`,
        {
          headers: { uid: user?.data.uid },
        }
      );
      const body = await res.json();
      res.ok
        ? setDisplayables(body?.data.attributes)
        : setDisplayables(resources);
    };

    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [query, selectedType, resources, user]);

  return (
    <AppLayout title={t("title")}>
      <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full mb-2">
            <div className="flex flex-col space-y-2">
              <div className="w-auto h-auto">
                <Image
                  src="/img/books.png"
                  width={64}
                  height={64}
                  alt="Books"
                />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                {t("title1")}
                <span className="ml-1 text-bleuFrance-500 dark:text-bleuFrance-400">
                  {t("title2")}
                </span>
              </h3>
            </div>
          </div>

          <div className="relative flex flex-row justify-between w-full space-x-3 text-sm">
            <div className="inline-flex items-center space-x-3">
              <label className="relative text-gray-400 focus-within:text-gray-600">
                <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
                <input
                  id="query"
                  name="query"
                  type="text"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                  className="input px-5 py-2 pl-[2.25rem] placeholder-gray-500   lg:w-96 "
                  placeholder={t("search-placeholder")}
                />
              </label>

              <label className="relative text-gray-400 focus-within:text-gray-600">
                {selectedType === null ? (
                  <SearchIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
                ) : (
                  types
                    .find((t) => t.value === selectedType)
                    ?.icon.outline({
                      className:
                        "absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3",
                    })
                )}

                <select
                  value={selectedType || ""}
                  onChange={(e) => {
                    if (e.target.value === "null") setType(null);
                    else setType(e.target.value);
                  }}
                  required
                  name="searchType"
                  className="input px-5 py-2 appearance-none pl-[2.25rem] placeholder-gray-500   lg:w-48 "
                  placeholder="Type de la ressource"
                >
                  <option value="null">{t("type-all")}</option>

                  {types.map((type, idx) => (
                    <option key={idx} value={type.value}>
                      {t(type.value)}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 right-3" />
              </label>
            </div>

            <Link href={"/resource/create"}>
              <a className="btn-bleuFrance" id="link-resource-create">
                <PlusIcon className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:block">{t("resource-create")}</span>
              </a>
            </Link>
          </div>
        </div>
        <div
          className="grid min-h-full grid-cols-1 gap-3 p-6 bg-gray-100 dark:bg-gray-900 grow xl:rounded-tl-xl lg:grid-cols-4 2xl:grid-cols-4 md:grid-cols-2 lg:gap-6 lg:p-12 md:overflow-y-auto"
          id="grid-resources"
        >
          {displayables.map((el, index) => (
            <ResourceCard key={index} {...el} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ResourceIndex;

export async function getServerSideProps(context) {
  const {
    cookies: { user },
  } = context.req;
  const uid = JSON.parse(user || "null")?.data.uid || undefined;
  const res = await fetch(
    "http://localhost:3000/api/resource",
    uid
      ? {
          headers: { uid },
        }
      : undefined
  );
  const body = await res.json();

  const resources: Resource[] = body?.data?.attributes;

  const { q = null, type = null } = context.query;

  return {
    props: {
      resources,
      q,
      type,
      i18n: (await import(`../../i18n/${context.locale}.json`)).default,
    },
  };
}
