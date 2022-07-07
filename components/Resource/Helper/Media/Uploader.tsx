import {
  CloudUploadIcon,
  DocumentIcon,
  ExclamationIcon,
  PhotographIcon,
  PlusCircleIcon,
  VideoCameraIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Dispatch, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatBytes } from "libs/formatBytes";
import { useRouter } from "next/router";
import { useEventListener } from "@hooks/useEventListener";
import { Media } from "@definitions/Resource/Media";
import { useTranslations } from "next-intl";

export const MediaUploader = ({
  files,
  setFiles,
}: {
  files: Media[];
  setFiles: Dispatch<Media[]>;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const t = useTranslations("MediaUploader");

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Escape") setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) setHasChanges(false);
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col h-full max-h-full p-2 space-y-1 bg-gray-200 rounded-lg dark:bg-gray-800">
        {router.pathname.includes("edit") && (
          <div className="inline-flex items-center">
            <small className="inline-flex items-center w-full text-sm font-spectral">
              <ExclamationIcon className="w-4 h-4 mr-1 " />
              {t("edit-warn")}
            </small>
            <a
              className="px-2 py-0.5 btn-text-gray"
              href={router.asPath.replace("/edit", "")}
            >
              {t("cancel")}
            </a>
          </div>
        )}
        <div className="flex flex-col space-y-1 overflow-y-scroll grow">
          {files.map((media, i) => (
            <div
              className="inline-flex items-center w-full p-2 text-sm rounded-md font-spectral h-fit dark:bg-bleuFrance-800 dark:text-bleuFrance-100 bg-bleuFrance-100 text-bleuFrance-500"
              key={media.name + i}
            >
              {media.type.includes("audio") && (
                <VolumeUpIcon className="w-4 h-4 mx-2" />
              )}
              {media.type.includes("image") && (
                <PhotographIcon className="w-4 h-4 mx-2" />
              )}
              {media.type.includes("video") && (
                <VideoCameraIcon className="w-4 h-4 mx-2" />
              )}
              {media.type.includes("application/pdf") && (
                <DocumentIcon className="w-4 h-4 mx-2" />
              )}

              {media.name}

              <span className="ml-2 text-xs">
                {formatBytes(parseInt(media.size))}
              </span>
              <button
                id={"btn-" + media.name + i}
                key={"btn-" + media.name + i}
                onClick={() => {
                  setFiles([
                    ...files.filter((m: Media) => m.name !== media.name),
                  ]);
                }}
                className="px-1 py-1 ml-auto btn-red"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          key="add-media"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
          className="ml-auto rounded-md btn-gray dark:bg-gray-700 w-fit"
          disabled={files.length >= 3}
        >
          {files.length < 3 ? (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              {t("add")}
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              {t("limit-reached")}
            </>
          )}
        </button>
      </div>
      {isOpen && !hasChanges && (
        <Transition appear show={true} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 z-10 bg-black bg-opacity-25 dark:bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-20 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl dark:bg-gray-900 rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="inline-flex items-center justify-center w-full text-xl font-medium text-gray-900 dark:text-gray-200 font-marianne"
                    >
                      <CloudUploadIcon className="w-6 h-6 mt-1 mr-2 stroke-2" />
                      {t("add")}
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className="w-full grow">
                        <input
                          id="file"
                          type="file"
                          accept="image/*,video/*,.pdf,audio/*"
                          onChange={(e) => {
                            const file =
                              e.target.files instanceof FileList
                                ? e.target.files[0]
                                : null;
                            if (
                              file &&
                              file.size <= 5_000_000 &&
                              files.length < 3
                            ) {
                              setFiles([...files, file as any]);
                              setHasChanges(true);
                            } else {
                              // alert("Votre fichier est trop lourd");
                              //TODO: react-hot-toast
                            }
                            setIsOpen(false);
                          }}
                          className="hidden"
                        ></input>
                        <label
                          htmlFor="file"
                          className="relative flex flex-col items-center justify-center w-full h-full p-12 duration-300 border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-700 group hover:border-gray-500 focus:outline-none active:border-bleuFrance-500 active:ring-4 ring-opacity-60 ring-bleuFrance-300"
                        >
                          <div className="inline-flex items-center justify-center w-full text-lg text-gray-500 duration-150 group-hover:text-gray-600 dark:group-hover:text-gray-400">
                            <VolumeUpIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <PhotographIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <VideoCameraIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <DocumentIcon className="w-6 h-6 mx-2" />
                          </div>
                          <span className="text-sm text-gray-600 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-700 font-spectral">
                            {t("accepted-files-types")}
                          </span>
                          <span className="text-xs text-gray-500 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-600 font-spectral">
                            {t("limit-file-size")}
                          </span>
                          <span className="text-xs text-gray-500 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-600 font-spectral">
                            {t("limit-file-remaining", {
                              remaining: 3 - files.length,
                            })}
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="inline-flex justify-end w-full mt-4">
                      <button
                        type="button"
                        className="btn-red"
                        onClick={() => setIsOpen(false)}
                      >
                        <XIcon className="w-4 h-4 mr-2" />
                        {t("cancel")}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
