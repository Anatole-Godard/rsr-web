import {
  PlusCircleIcon,
  XIcon,
  VolumeUpIcon,
  PhotographIcon,
  VideoCameraIcon,
  DocumentIcon,
  CloudUploadIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import { Dispatch, useState, Fragment, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { formatBytes } from "libs/formatBytes";
import { useRouter } from "next/router";
import { useEventListener } from "@hooks/useEventListener";
import { Media } from "@definitions/Resource/Media";

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

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.code === "Escape") setIsOpen(false);
  });

  useEffect(() => {
    if (isOpen) setHasChanges(false);
  }, [isOpen]);

  console.log({ isOpen, hasChanges });

  return (
    <>
      <div className="flex flex-col h-full max-h-full p-2 space-y-1 bg-gray-200 rounded-lg">
        {router.pathname.includes("edit") && (
          <div className="inline-flex items-center">
            <small className="inline-flex items-center w-full text-sm font-spectral">
              <ExclamationIcon className="w-4 h-4 mr-1 " />
              Éditer la ressource réinitialisera vos médias.
            </small>
            <a
              className="px-2 py-0.5 btn-text-bleuFrance"
              href={router.asPath.replace("/edit", "")}
            >
              Annuler
            </a>
          </div>
        )}
        <div className="flex flex-col space-y-1 overflow-y-scroll grow">
          {files.map((media, i) => (
            <div
              className="inline-flex items-center w-full p-2 text-sm rounded-md font-spectral h-fit bg-bleuFrance-100 text-bleuFrance-500"
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
                onClick={(e) => {
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
          className="rounded-md btn-gray w-fit"
          disabled={files.length >= 3}
        >
          {files.length < 3 ? (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Ajouter un média
            </>
          ) : (
            <>
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Vous avez atteint le nombre maximum de médias
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
              <div className="fixed inset-0 z-10 bg-black bg-opacity-25" />
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
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <Dialog.Title
                      as="h3"
                      className="inline-flex items-center justify-center w-full text-xl font-medium text-gray-900 font-marianne"
                    >
                      <CloudUploadIcon className="w-6 h-6 mt-1 mr-2 stroke-2" />
                      Ajouter un média
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className="w-full grow">
                        <input
                          id="file"
                          type="file"
                          accept="image/*,video/*,.pdf,audio/*"
                          onChange={(e) => {
                            let file =
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
                          className="relative flex flex-col items-center justify-center w-full h-full p-12 duration-300 border-2 border-gray-300 border-dashed rounded-lg group hover:border-gray-500 focus:outline-none active:border-bleuFrance-500 active:ring-4 ring-opacity-60 ring-bleuFrance-300"
                        >
                          <div className="inline-flex items-center justify-center w-full text-lg text-gray-500 duration-150 group-hover:text-gray-600">
                            <VolumeUpIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <PhotographIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <VideoCameraIcon className="w-6 h-6 mx-2" />
                            <span>/</span>
                            <DocumentIcon className="w-6 h-6 mx-2" />
                          </div>
                          <span className="text-sm text-gray-600 duration-300 group-hover:text-gray-700 font-spectral">
                            Fichier audio, image, vidéo, pdf accepté
                          </span>
                          <span className="text-xs text-gray-500 duration-300 group-hover:text-gray-600 font-spectral">
                            Maximum 5 Mo par fichier ({"jusqu'à 3 fichiers"})
                          </span>
                          <span className="text-xs text-gray-500 duration-300 group-hover:text-gray-600 font-spectral">
                            {3 - files.length} fichiers restants
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
                        Annuler
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