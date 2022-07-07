import { Dialog, Transition } from "@headlessui/react";
import { BanIcon, XIcon } from "@heroicons/react/outline";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";

export const DisableAccount = () => {
  const t = useTranslations("DisableAccount");

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const disable = async () => {
    toast.success(t("toast-success"));
    closeModal();
  };

  return (
    <>
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
        <div className="flex flex-col">
          <p className="mb-2 text-gray-600 dark:text-gray-300 font-spectral">
            {t("subtitle")}
          </p>
          <p className="mb-1 text-xs text-gray-600 dark:text-gray-300 font-spectral">
            {t("text")}
          </p>
          <p className="mb-3 text-xs text-gray-600 dark:text-gray-300 font-spectral">
            {t("text2")}
          </p>
          <div className="ml-auto">
            <button className="btn-red" onClick={openModal}>
              <BanIcon className="w-4 h-4 mr-2" />
              {t("button")}
            </button>
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 font-marianne"
                >
                  {t("title")}
                </Dialog.Title>
                <div className="mt-6">
                  <p className="text-sm text-gray-500 font-spectral">
                    {t("modal-text")}
                  </p>
                </div>

                <div className="inline-flex items-center justify-end w-full mt-4 space-x-3">
                  <button type="button" className="btn-red" onClick={disable}>
                    <BanIcon className="w-4 h-4 mr-2" />
                    {t("button")}
                  </button>
                  <button
                    type="button"
                    className="btn-gray"
                    onClick={closeModal}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    {t("cancel")}
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
