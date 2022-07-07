import { ChatAlt2Icon } from "@heroicons/react/solid";
import { classes } from "libs/classes";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Channel } from "@definitions/Channel";
import { visibilities } from "constants/resourcesTypes";
import { useRouter } from "next/router";
import { AvatarGroup } from "@components/UI/Avatar/Group";

export const ChannelCard = (props: Channel) => {
  const { slug, owner, visibility, activities, messages, members, name } =
    props;
  const history = [...activities, ...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const t = useTranslations("ChannelCard");
  const { locale } = useRouter();

  return (
    <div
      className={classes(
        "flex flex-col w-full p-2 duration-300 bg-white h-fit max-h-max grow-0 border dark:border-gray-600 rounded-xl dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 group"
      )}
    >
      <Link href={"/channel/" + slug}>
        <a id="link-channel-details">
          <div
            className={classes(
              "flex items-center relative justify-center w-full h-24 rounded-lg duration-300",
              "bg-bleuFrance-100 group-hover:bg-bleuFrance-200 dark:bg-bleuFrance-800 dark:group-hover:bg-bleuFrance-900"
            )}
          >
            <div
              className={classes(
                "flex flex-col space-y-2 text-xs font-spectral items-center",
                "text-bleuFrance-700 dark:text-bleuFrance-200"
              )}
            >
              <ChatAlt2Icon className="w-6 h-6" />
            </div>

            <div className="absolute truncate top-2 left-2">
              <div className="z-10 flex flex-row items-center px-2 py-1 text-xs font-medium text-gray-200 truncate bg-gray-800 shadow-xl rounded-xl">
                {visibilities
                  .find((v) => v.value === visibility)
                  ?.icon.outline({ className: "w-3 h-3 mr-1" })}
                {visibility === "public" && t("public")}
                {visibility === "private" &&
                  (members.length > 1
                    ? t("private-members", { length: members.length })
                    : t("private-member", { length: members.length }))}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center w-full">
            <div className="flex flex-col p-3 truncate grow">
              <h3 className="w-full font-extrabold leading-5 truncate dark:text-gray-200 font-marianne">
                {name}
              </h3>
              <h4 className="text-xs font-semibold font-spectral">
                {t("created-by", { name: owner.fullName })}
              </h4>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-col px-4 pb-2">
        <div className="inline-flex items-center space-x-2">
          <AvatarGroup users={members} limit={5} />
          <span className="ml-2 text-sm font-spectral">
            {members.length > 1
              ? t("members", { length: members.length })
              : t("member", { length: members.length })}
          </span>
        </div>
        <p className="mt-1 text-xs font-spectral">
          {history.length > 0
            ? t("last-activity", {
                date: formatDistance(
                  new Date(history[0].createdAt),
                  new Date(),
                  {
                    locale: locale === "fr" ? fr : undefined,
                  }
                ),
              })
            : t("no-activity")}
        </p>
      </div>
    </div>
  );
};
