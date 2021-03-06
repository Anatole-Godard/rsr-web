import { AppLayout } from "@components/Layout/AppLayout";
import { UserLikedResources } from "@components/User/UserLikedResources";
import { UserResources } from "@components/User/UserResources";
import { Resource } from "@definitions/Resource";
import { CogIcon, CollectionIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "libs/fetchRSR";
import { NextPage } from "next";
import Link from "next/link";

import { UserStatistics } from "@components/User/UserStatistics";
import { UserSeenResources } from "@components/User/UserSeenResources";
import { useTranslations } from "next-intl";

type Props = {
  resources: Resource[];
  likes: Resource[];
  allResources: Resource[];
};

const UserIndexPage: NextPage<Props> = ({
  resources,
  likes,
  allResources,
}: Props) => {
  const { user } = useAuth();
  const t = useTranslations("UserIndex");

  return (
    <AppLayout title={t("title")}>
      <div className="flex flex-col w-full h-full bg-white dark:bg-black ">
        <div className="flex flex-col w-full px-6 py-6 space-y-3 bg-white lg:justify-between lg:items-end lg:flex-row shrink-0 lg:px-12 dark:bg-black dark:border-gray-800 lg:space-y-0">
          <div className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="object-cover w-16 h-16 rounded-full"
              src={user?.data.photoURL || "/uploads/user/default.png"}
              alt={user?.data.fullName}
            />
            <h3 className="ml-5 text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
              {t("title1")}
              <span className="ml-1 text-bleuFrance-600 dark:text-bleuFrance-300">
                {t("title2")}
              </span>
            </h3>
          </div>
          <div className="inline-flex items-center space-x-2">
            <Link href="/user/playlists">
              <a className="btn-gray h-fit w-fit">
                <CollectionIcon className="w-4 h-4 mr-2" />
                {t("playlists")}
              </a>
            </Link>

            <Link href="/user/settings">
              <a className="btn-gray h-fit w-fit">
                <CogIcon className="w-4 h-4 mr-2" />
                {t("settings")}
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-col p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 grow xl:rounded-tl-xl">
          {user && (
            <>
              <UserStatistics
                user={user}
                resources={resources}
                allResources={allResources.filter((r: Resource) =>
                  r.seenBy.some((u) => u.uid === user.data.uid)
                )}
              />

              <UserResources resources={resources} />
              <UserLikedResources resources={likes} />
              <UserSeenResources
                resources={allResources.filter((r: Resource) =>
                  r.seenBy.some((u) => u.uid === user.data.uid)
                )}
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserIndexPage;

export const getServerSideProps = async (ctx) => {
  const {
    cookies: { user },
  } = ctx.req;
  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };

  const parsedUser = JSON.parse(user);

  const resources = await (
    await fetchRSR(
      `http://localhost:3000/api/user/${parsedUser.data.uid}`,
      parsedUser?.session
    )
  ).json();

  const allResources = await (
    await fetchRSR(`http://localhost:3000/api/resource`, parsedUser?.session)
  ).json();

  const likes = await (
    await fetchRSR(
      `http://localhost:3000/api/user/${parsedUser.data.uid}/resources/likes`,
      parsedUser?.session
    )
  ).json();

  return {
    props: {
      ...resources.data.attributes,
      likes: likes?.data?.attributes || [],
      allResources: allResources?.data?.attributes || [],
      i18n: (await import(`../../i18n/${ctx.locale}.json`)).default,
    },
  };
};
