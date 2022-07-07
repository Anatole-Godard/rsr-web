import {
  CloudUploadIcon,
  DocumentIcon,
  PhotographIcon,
  PlusCircleIcon,
  VideoCameraIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Dispatch, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatBytes } from "libs/formatBytes";
import { useEventListener } from "@hooks/useEventListener";
import { Media } from "@definitions/Resource/Media";
import { useTranslations } from "next-intl";

export const MediaUploader = ({
  files,
  setFiles,
  limit = 3,
  accepted = ["image/*", "video/*", "audio/*", "application/pdf"],
}: {
  files: Media[];
  setFiles: Dispatch<Media[]>;
  limit: number;
  accepted: ("image/*" | "video/*" | "audio/*" | "application/pdf")[];
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const t = useTranslations("ChannelMediaUploader");

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Escape") setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) setHasChanges(false);
  }, [isOpen]);

  return (
    <>
      <div className="flex flex-col p-2 space-y-1 bg-gray-200 rounded-lg dark:bg-gray-800">
        <div className="flex flex-col space-y-1 overflow-y-scroll">
          {files.map((media, i) => (
            <div
              className="flex flex-col rounded-md h-max dark:bg-bleuFrance-800 dark:text-bleuFrance-100 bg-bleuFrance-100 text-bleuFrance-500"
              key={media.name + i}
            >
              <div className="inline-flex items-center w-full p-2 text-sm font-spectral">
                <PhotographIcon className="w-4 h-4 mx-2" />
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="media"
                src={media.url || URL.createObjectURL(media as unknown as Blob)}
                className="object-contain w-full p-4 h-96 aspect-square rounded-b-md"
              />
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
          disabled={files.length >= limit}
        >
          {files.length < limit ? (
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
                          accept={accepted.join(",")}
                          onChange={(e) => {
                            const file =
                              e.target.files instanceof FileList
                                ? e.target.files[0]
                                : null;
                            if (
                              file &&
                              file.size <= 5_000_000 &&
                              files.length < 3 &&
                              accepted.some((a) =>
                                file.type.includes(a.split("/")[0])
                              )
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
                            {accepted.includes("audio/*") && (
                              <>
                                <VolumeUpIcon className="w-6 h-6 mx-2" />
                                <span>/</span>
                              </>
                            )}
                            {accepted.includes("image/*") && (
                              <>
                                <PhotographIcon className="w-6 h-6 mx-2" />
                                <span>/</span>
                              </>
                            )}
                            {accepted.includes("video/*") && (
                              <>
                                <VideoCameraIcon className="w-6 h-6 mx-2" />
                                <span>/</span>
                              </>
                            )}
                            {accepted.includes("application/pdf") && (
                              <>
                                <DocumentIcon className="w-6 h-6 mx-2" />
                              </>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-700 font-spectral">
                            {t("accepted-files-types")}
                          </span>
                          <span className="text-xs text-gray-500 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-600 font-spectral">
                            {t("limit-file-size", { limit })}
                          </span>
                          <span className="text-xs text-gray-500 duration-300 dark:group-hover:text-gray-400 group-hover:text-gray-600 font-spectral">
                            {t("limit-file-remaining", {
                              remaining: limit - files.length,
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
