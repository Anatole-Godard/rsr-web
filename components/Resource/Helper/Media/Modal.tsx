import { Media } from "@definitions/Resource/Media";
import { Dialog, Transition } from "@headlessui/react";
import { DownloadIcon, XIcon } from "@heroicons/react/outline";
import { useEventListener } from "@hooks/useEventListener";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";

export const MediaModal = ({
  onClose,
  media: { name, url, type },
  updatedAt,
}: {
  onClose: () => void;
  media: Media;
  updatedAt: string;
}) => {
  const download = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    link.remove();
  };

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  });

  const t = useTranslations("ResourceView");
  const { locale } = useRouter();

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full absolute  top-0 left-0  z-[61]">
                <div className="relative z-[61] top-0 left-0 w-full h-full">
                  {type.includes("image") && (
                    <Image
                      src={url}
                      alt={name}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  {type.includes("audio") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <audio controls>
                        <source src={url} type={type} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                  {type.includes("video") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <video controls className="w-full aspect-video">
                        <source src={url} type={type} />
                        Your browser does not support the audio element.
                      </video>
                    </div>
                  )}
                  {type.includes("application/pdf") && (
                    <div className="relative flex items-center justify-center w-full h-full">
                      <iframe className="w-3/4 aspect-[16/9]" src={url} />
                    </div>
                  )}
                </div>
                <div className="absolute top-0 w-full left-0 z-[62] bg-gradient-to-b from-black to-transparent opacity-50 h-48"></div>
                <div className="absolute top-0 w-full inline-flex items-center justify-between left-0 z-[62]  p-6">
                  <div className="inline-flex items-center grow">
                    <button
                      onClick={onClose}
                      className="justify-center w-10 h-10 px-0 py-0 mt-1 mr-3 rounded-full btn-gray"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col">
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-extrabold text-white font-marianne"
                      >
                        {name}
                      </Dialog.Title>
                      <div className="">
                        <p className="text-gray-200 text-md font-spectral">
                          {t("updatedAt", {
                            relative: formatRelative(
                              new Date(updatedAt),
                              new Date(),
                              {
                                locale: locale === "fr" ? fr : undefined,
                              }
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={download}
                    className="justify-center w-10 h-10 px-0 py-0 mt-1 rounded-full btn-gray"
                  >
                    <DownloadIcon className="w-5 h-5" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
