import {
  DesktopComputerIcon,
  DeviceMobileIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "@utils/fetchRSR";
import { formatDistance } from "date-fns";
import fr from "date-fns/locale/fr";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";


export const SessionsViewer = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const init = useCallback(async () => {
    fetchRSR(`/api/user/${user?.session.uid}/sessions`, user?.session)
      .then((res) => res.json())
      .then((body) => {
        setSessions(body?.data.attributes);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [user]);

  useEffect(() => {
    init();
  }, [init, user.session]);

  const revoke = async (session: { token: any; }) => {
    const res = await fetchRSR(`/api/auth/revoke`, user?.session, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    if (res.ok) init();
  };

  return (
    <div className="flex flex-col p-4 space-y-3 bg-white rounded-lg">
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
        {sessions.map((session, key) => {
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

              {session.appSource !== "web" && (
                <button
                  className="btn-red group"
                  onClick={() => revoke(session)}
                >
                  <XIcon className="w-4 h-4 mr-1 text-red-700 duration-300 group-active:text-red-100" />
                  Révoquer
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="inline-flex justify-end w-full pt-3 mt-3">
        <button className="btn-red">Fermer toutes les sessions</button>
      </div>
    </div>
  );
};
