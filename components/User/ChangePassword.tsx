import { CheckIcon } from "@heroicons/react/outline";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "libs/fetchRSR";
import { useTranslations } from "next-intl";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";

export const ChangePassword = () => {
  const { user, removeUser } = useAuth();
  // const router = useRouter();
  const t = useTranslations("ChangePassword");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disconnectAll, setDisconnectAll] = useState(false);

  const [passwordScore, setPasswordScore] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newPassword) {
      const score = zxcvbn(newPassword).score;
      setPasswordScore(score);
    }
  }, [newPassword]);

  const post = async () => {
    if (
      oldPassword &&
      newPassword &&
      confirmPassword &&
      newPassword !== "" &&
      newPassword === confirmPassword &&
      newPassword !== oldPassword
    ) {
      setLoading(true);

      const toastID = toast.loading(t("toast-loading"));

      const res = await fetchRSR("/api/auth/change-password", user.session, {
        method: "POST",
        body: JSON.stringify({
          oldPassword,
          newPassword,
          disconnectAll,
        }),
      });

      toast.dismiss(toastID);

      if (res.ok) {
        toast.success(t("toast-success"));
        if (disconnectAll) removeUser("/");
      } else toast.error(t("toast-error"));
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col row-span-2 p-4 space-y-3 bg-white rounded-lg shadow dark:bg-gray-800">
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
      <label>
        <h4 className="mb-1 after:content-['*'] dark:text-gray-300 after:ml-0.5 after:text-red-500 text-xs font-medium text-gray-700 font-marianne">
          {t("old")}
        </h4>
        <input
          type="password"
          className="bg-gray-200 input dark:bg-gray-700"
          placeholder={t("old")}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        ></input>
      </label>
      <label>
        <h4 className="mb-1 after:content-['*'] dark:text-gray-300 after:ml-0.5 after:text-red-500 text-xs font-medium text-gray-700 font-marianne">
          {t("new")}
        </h4>
        <input
          type="password"
          className="bg-gray-200 input dark:bg-gray-700"
          placeholder={t("new")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
      </label>
      <div className="h-2 mt-2 bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className={[
            " h-2 rounded-l-full transition-all duration-500 ease-in-out",
            passwordScore === 0 && newPassword !== ""
              ? "w-10 bg-red-500"
              : passwordScore === 1
              ? "w-1/4 bg-yellow-500"
              : passwordScore === 2
              ? "w-1/2 bg-green-500"
              : passwordScore === 3
              ? "w-3/4 bg-green-500"
              : passwordScore === 4
              ? "w-full bg-blue-500 animate-pulse rounded-r-full"
              : "w-0",
          ].join(" ")}
        ></div>
      </div>
      <label>
        <h4 className="mb-1 after:content-['*'] dark:text-gray-300 after:ml-0.5 after:text-red-500 text-xs font-medium text-gray-700 font-marianne">
          {t("new-confirm")}
        </h4>
        <input
          type="password"
          className="bg-gray-200 input dark:bg-gray-700"
          placeholder={t("new-confirm")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
      </label>
      <label className="flex flex-col">
        <h4 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300 font-marianne">
          {t("security")}
        </h4>
        <div className="inline-flex items-center my-2 space-x-3">
          <input
            type="checkbox"
            value={disconnectAll as unknown as string}
            onChange={(e) => setDisconnectAll(e.target.checked)}
            className="w-4 h-4 duration-200 bg-green-200 border-0 rounded-md appearance-none form-checkbox hover:bg-green-400 dark:bg-green-800 dark:hover:bg-green-700 checked:bg-green-600 checked:border-transparent focus:outline-none focus:bg-green-400 dark:focus:bg-green-900 ring-green-500"
          />
          <span className="mb-0.5 text-xs font-normal text-gray-700 font-marianne dark:text-gray-300">
            {t("disconnect")}
          </span>
        </div>
      </label>
      <div className="inline-flex justify-end w-full pt-3 mt-3">
        <button
          className="btn-green"
          onClick={post}
          disabled={!oldPassword && !newPassword && !confirmPassword}
        >
          {loading ? (
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx={12}
                cy={12}
                r={10}
                stroke="currentColor"
                strokeWidth={4}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <>
              <CheckIcon className="w-4 h-4 mr-2" />
              {t("send")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
