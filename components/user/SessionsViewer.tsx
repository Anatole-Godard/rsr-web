import {
  DesktopComputerIcon,
  DeviceMobileIcon,
  UserRemoveIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import useFetchRSR from "@hooks/useFetchRSR";
import { fetchRSR } from "@utils/fetchRSR";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import Image from "next/image";
import { useState } from "react";

export const SessionsViewer = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState<string>(
    `/api/user/${user?.session.uid}/sessions`
  );
  const {
    data: sessionsFetchedData,
    error,
    loading: isLoading,
  }: {
    data?: { data: { attributes: any[] } };
    error?: any;
    loading: boolean;
  } = useFetchRSR(url, user?.session);

  const revoke = async (session: { token: any }) => {
    const res = await fetchRSR(`/api/auth/revoke`, user?.session, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    if (res.ok) {
      setUrl((old) => old + `?`);
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white rounded-lg shadow">
      <div className="inline-flex items-center justify-between w-full mb-3">
        <h5 className="font-bold text-gray-900 font-marianne">
          Appareils connectés
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
        {sessionsFetchedData?.data.attributes.map((session, key) => {
          return (
            <div
              className="inline-flex items-center w-full p-2 bg-gray-100 rounded-md"
              key={key}
            >
              {session.appSource === "web" ? (
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-200 rounded-md shrink-0">
                  <DesktopComputerIcon className="w-6 h-6 text-indigo-700" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-md shrink-0">
                  <DeviceMobileIcon className="w-6 h-6 text-purple-700" />
                </div>
              )}
              <div className="inline-flex w-full ml-3 grow">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-700 font-marianne">
                    {session.appSource === "web" ? "Web" : "Mobile"}
                  </p>
                  <small className="text-xs font-normal text-gray-400 font-spectral">
                    {formatDistance(new Date(session.issuedAt), new Date(), {
                      locale: fr,
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
                  La session sera révoquée automatiquement à la reconnexion
                </small>
              ) : (
                <>
                  {session.appSource !== "web" && (
                    <button
                      className="btn-red group"
                      onClick={() => revoke(session)}
                    >
                      <XIcon className="w-4 h-4 mr-2" />
                      Révoquer
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
          Fermer toutes les sessions
        </button>
      </div>
    </div>
  );
};
