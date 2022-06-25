import { DownloadIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "libs/fetchRSR";
import { useTranslations } from "next-intl";
import Image from "next/image";
import toast from "react-hot-toast";

export const RetrieveAccount = () => {
  const { user } = useAuth();
  const t = useTranslations("RetrieveAccount");
  const fetchExport = async () => {
    if (user) {
      let toastID = toast.loading("Récupération de votre compte...");
      const res = await fetchRSR("/api/auth/export", user.session);
      toast.dismiss(toastID);

      if (res.status === 200) {
        toast.success("Votre compte a été récupéré avec succès");

        const blob = await res.blob();
        let url = window.URL.createObjectURL(blob);
        let aDOM = document.createElement("a");
        aDOM.href = url;
        aDOM.download = `export_rsr-${
          user.data.uid
        }-${new Date().toISOString()}.json`;
        document.body.appendChild(aDOM);
        aDOM.click();
        aDOM.remove();
      } else {
        toast.error(
          "Une erreur est survenue lors de la récupération de votre compte"
        );
      }
    }
  };
  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="inline-flex items-center justify-between w-full mb-3">
        <h5 className="font-bold text-gray-900 dark:text-gray-200 font-marianne">{t("title")}</h5>
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
      <div className="flex flex-col">
        <p className="mb-1 text-xs text-gray-600 dark:text-gray-300 font-spectral">{t("text")}</p>

        <div className="ml-auto">
          <button onClick={fetchExport} className="btn-gray dark:bg-gray-700">
            <DownloadIcon className="w-4 h-4 mr-2" />
            {t("button")}
          </button>
        </div>
      </div>
    </div>
  );
};
