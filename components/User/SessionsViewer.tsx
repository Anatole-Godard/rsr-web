import {
  DesktopComputerIcon,
  DeviceMobileIcon,
  UserRemoveIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { fetchRSR } from "libs/fetchRSR";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import Image from "next/image";
import toast from "react-hot-toast";
import { classes } from "@utils/classes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";

export const SessionsViewer = () => {
  const { user } = useAuth();
  const t = useTranslations("SessionsViewer");
  const { locale } = useRouter();
  const {
    data: sessionsFetchedData,
    // error,
    // loading: isLoading,
    revalidate,
  }: {
    data?: any[];
    error?: any;
    loading: boolean;
    revalidate: () => void;
  } = useFetchRSR(`/api/user/${user?.session.uid}/sessions`, user?.session);

  const revoke = async (session: { token: any }) => {
    const toastID = toast.loading("Suppression de la session...");
    const res = await fetchRSR(`/api/auth/revoke`, user?.session, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    toast.dismiss(toastID);
    revalidate();
    if (res.ok) {
      toast.success("La session a été révoquée avec succès");
    } else {
      toast.error(
        "Une erreur est survenue lors de la révocation de la session"
      );
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="inline-flex items-center justify-between w-full mb-3">
        <h5 className="font-bold text-gray-900 dark:text-gray-200 font-marianne">
          {t("title")}
        </h5>
        <div className="w-6 h-6">
          <Image
            alt="Locker"
            src="/img/locked.png"
            // layout="fill"
            width={24}
            height={24}
          />
        </div>
      </div>

      <div className="flex flex-col w-full space-y-3 grow">
        {sessionsFetchedData?.map((session, key) => {
          return (
            <div
              className="inline-flex items-center w-full p-2 bg-gray-100 rounded-md dark:bg-gray-700"
              key={key}
            >
              <div
                className={classes(
                  "flex items-center justify-center w-12 h-12  rounded-md shrink-0",
                  session.appSource === "web"
                    ? "bg-indigo-200 dark:bg-indigo-700"
                    : "bg-purple-200 dark:bg-purple-700"
                )}
              >
                {session.appSource === "web" ? (
                  <DesktopComputerIcon className="w-6 h-6 text-indigo-700 dark:text-indigo-200" />
                ) : (
                  <DeviceMobileIcon className="w-6 h-6 text-purple-700 dark:text-purple-200" />
                )}
              </div>

              <div className="inline-flex w-full ml-3 grow">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-marianne">
                    {session.appSource === "web" ? t("web") : t("mobile")}
                  </p>
                  <small className="text-xs font-normal text-gray-400 font-spectral">
                    {formatDistance(new Date(session.issuedAt), new Date(), {
                      locale: locale === "fr" ? fr : undefined,
                    })}
                  </small>
                </div>
              </div>

              {Math.abs(
                new Date().getTime() - new Date(session.issuedAt).getTime()
              ) /
                3600000 >
              3 ? (
                <small className="text-xs font-normal text-right text-gray-400 font-spectral">
                  {t("expired")}
                </small>
              ) : (
                <>
                  {session.appSource !== "web" && (
                    <button
                      className="btn-red group"
                      onClick={() => revoke(session)}
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      {t("revoke")}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="inline-flex justify-end w-full pt-3 mt-3">
        <button className="btn-red">
          <UserRemoveIcon className="w-4 h-4 mr-2" />
          {t("revoke-all")}
        </button>
      </div>
    </div>
  );
};
