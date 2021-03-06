import { RefreshIcon } from "@heroicons/react/outline";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export const GetStartedResetter = () => {
  const [, setCookie] = useCookies(["rsr-get_started"]);
  const t = useTranslations("GetStartedResetter");

  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="inline-flex items-center justify-between w-full">
        <h5 className="font-bold text-gray-900 dark:text-gray-200 font-marianne">
          {t("title")}
        </h5>
        <div className="w-6 h-6">
          <Image alt="Locker" src="/img/superhero.png" width={24} height={24} />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="mb-1 text-xs text-gray-600 dark:text-gray-300 font-spectral">
          {t("text")}
        </p>

        <div className="mt-3 ml-auto">
          <button
            onClick={() => {
              setCookie("rsr-get_started", false, {
                path: "/",
                maxAge: 3600 * 24, // Expires after 1day
                sameSite: true,
              });
              toast.success(t("toast-success"));
            }}
            className="btn-gray dark:bg-gray-700"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            {t("button")}
          </button>
        </div>
      </div>
    </div>
  );
};
