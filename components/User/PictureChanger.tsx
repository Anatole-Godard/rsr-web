import { CheckIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useAuth } from "@hooks/useAuth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export const PictureChanger = () => {
  const { user, changePicture } = useAuth();
  const t = useTranslations("PictureChanger");

  const [pictureUrl, setPictureUrl] = useState(null);
  const [pictureFile, setPictureFile] = useState(null);

  const [, setLoading] = useState(false);

  const post = async () => {
    if (pictureFile) {
      setLoading(true);
      const fd = new FormData();
      fd.append("file", pictureFile);
      fd.append("name", pictureFile.name);
      fd.append("type", pictureFile.type);
      fd.append("size", pictureFile.size.toString());

      const toastID = toast.loading(t("toast-loading"));

      const responseFileUpload = await fetch(
        `/api/user/${user.data.uid}/picture`,
        {
          method: "POST",
          body: fd,
        }
      );
      toast.dismiss(toastID);

      if (responseFileUpload.ok) {
        toast.success(t("toast-success"));
        const body = await responseFileUpload.json();
        if (body?.data.attributes.photoURL) {
          changePicture(body.data.attributes.photoURL);
          setPictureUrl(null);
          setPictureFile(null);
        }
      } else toast.error(t("toast-error"));

      setLoading(false);
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
            alt="Superhero"
            src="/img/superhero.png"
            // layout="fill"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="inline-flex items-center justify-center w-full grow">
        <div className="flex flex-col grow">
          <h4 className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300 font-marianne">
            {t("old")}
          </h4>
          <div className="relative w-auto h-24 lg:h-36 grow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.data.photoURL}
              className="object-cover object-center h-24 rounded-lg lg:h-36 aspect-square"
              alt={t("profile")}
            ></img>
          </div>
        </div>

        <label className="flex flex-col grow">
          <h4 className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300 font-marianne">
            {t("new")}
          </h4>
          {pictureUrl && (
            <div className="relative w-full grow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pictureUrl}
                className="object-cover object-center w-auto h-24 rounded-lg lg:h-36 aspect-square"
                alt="Event picture"
              ></img>
              <div
                className="absolute top-0 flex items-center justify-center w-6 h-6 -mt-1 -mr-1 text-red-700 transition duration-300 bg-red-200 rounded-full cursor-pointer left-[5.25rem] lg:left-28 hover:bg-red-300"
                onClick={() => {
                  setPictureUrl(null);
                  setPictureFile(null);
                }}
              >
                <XIcon className="w-3 h-3 stroke-2"></XIcon>
              </div>
            </div>
          )}
          {!pictureUrl && (
            <div className="w-full grow">
              <input
                id="filePicture"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files instanceof FileList
                      ? e.target.files[0]
                      : null;
                  if (file) {
                    setPictureFile(file);
                    setPictureUrl(URL.createObjectURL(file));
                  }
                }}
                className="hidden"
              ></input>
              <label
                htmlFor="filePicture"
                className="relative flex flex-col items-center justify-center w-24 h-24 p-3 duration-300 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600 lg:h-36 lg:w-36 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-12 h-12 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="block text-xs font-medium text-center text-gray-900 dark:text-gray-300">
                  {t("add")}
                </span>
              </label>
            </div>
          )}
        </label>
      </div>
      <div className="inline-flex justify-end w-full pt-3 mt-3">
        <button className="btn-green" onClick={post} disabled={!pictureFile}>
          <CheckIcon className="w-4 h-4 mr-2" />
          {t("send")}
        </button>
      </div>
    </div>
  );
};
