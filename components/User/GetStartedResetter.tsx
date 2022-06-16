import { RefreshIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";
import { useCookies } from "react-cookie";

export const GetStartedResetter = () => {
  const [cookie, setCookie] = useCookies(["rsr-get_started"]);
  const [show, setShow] = useState<boolean>(
    cookie["rsr-get_started"] !== "true"
  );

  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow">
      <div className="inline-flex items-center justify-between w-full">
        <h5 className="font-bold text-gray-900 font-marianne">
          {`Réinitialisation du composant "Premiers pas"`}
        </h5>
        <div className="w-6 h-6">
          <Image alt="Locker" src="/img/locked.png" width={24} height={24} />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="mb-1 text-xs text-gray-600 font-spectral">
          {`Vous pouvez à tout moment réinitialiser le composant "Premiers pas"
            pour vérifier si vous avez correctement effectué le tutoriel. Un rechargement complet de la page peut être nécessaire.`}
        </p>

        <div className="mt-3 ml-auto">
          <button
            onClick={() => {
              setCookie("rsr-get_started", false, {
                path: "/",
                maxAge: 3600 * 24, // Expires after 1day
                sameSite: true,
              });
            }}
            className="btn-gray"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Réactiver
          </button>
        </div>
      </div>
    </div>
  );
};
