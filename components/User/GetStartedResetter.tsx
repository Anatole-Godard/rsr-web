import { RefreshIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export const GetStartedResetter = () => {
  const [cookie, setCookie] = useCookies(["rsr-get_started"]);
  const [show, setShow] = useState<boolean>(
    cookie["rsr-get_started"] !== "true"
  );

  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="inline-flex items-center justify-between w-full">
        <h5 className="font-bold text-gray-900 dark:text-gray-200 font-marianne">
          {`Réinitialisation de votre progression "Premiers pas"`}
        </h5>
        <div className="w-6 h-6">
          <Image alt="Locker" src="/img/superhero.png" width={24} height={24} />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="mb-1 text-xs text-gray-600 dark:text-gray-300 font-spectral">
          {`Vous pouvez à tout moment réinitialiser votre progression "Premiers pas"
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
              toast.success("Premiers pas réinitialisés");
            }}
            className="btn-gray dark:bg-gray-700"
          >
            <RefreshIcon className="w-4 h-4 mr-2" />
            Réactiver
          </button>
        </div>
      </div>
    </div>
  );
};
