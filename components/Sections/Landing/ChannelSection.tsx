import { ChevronRightIcon } from "@heroicons/react/outline";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Channel } from "@definitions/Channel";
import { ChannelCard } from "@components/Channel/Card";
import { useAuth } from "@hooks/useAuth";

export const ChannelSection = ({ channels }: { channels: Channel[] }) => {
  const t = useTranslations("ChannelSection");

  const { user } = useAuth();

  if (!user?.session) return null;

  return (
    <div className="flex flex-col w-full ">
      <div className="inline-flex items-end justify-between px-3">
        <h3 className="text-xl font-extrabold text-gray-800 md:text-2xl font-marianne lg:text-3xl xl:text-4xl dark:text-gray-200">
          {t("title1")}
          <span className="ml-1.5 text-bleuFrance-500 dark:text-bleuFrance-400">
            {t("title2")}
          </span>
        </h3>
        <Link href="/channel">
          <a
            className="flex flex-row items-center mb-1 text-sm font-medium transition duration-300 cursor-pointer font-spectral dark:text-gray-300 dark:hover:text-bleuFrance-200 hover:text-bleuFrance-500"
            id="link-resources-library"
          >
            {t("see-all")}
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </a>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-6 pb-12 mt-6 border-t md:grid-cols-3 xl:grid-cols-4 dark:border-gray-700">
        {channels.map((channel, key) => (
          <ChannelCard {...channel} key={key} />
        ))}
      </div>
    </div>
  );
};
