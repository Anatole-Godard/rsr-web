import React, { createContext, Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { useEventListener } from '@hooks/useEventListener';
import { Dialog, Transition } from '@headlessui/react';
import { CloudUploadIcon, XIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { fetchRSR } from '@utils/fetchRSR';
import { useAuth } from '@hooks/useAuth';

const ReportContext = createContext({});

function ReportProvider({
                          children
                        }: {
  children: React.ReactNode;
}): JSX.Element {

  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<boolean>(false);

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Escape') setIsOpen(false);
  });

  const openReport = (reportInfos: { type, label }) => {
    setType(reportInfos.label);
    setIsOpen(true);
  };

  const closeReport = ({}) => {
    setIsOpen(false);
  };

  const sendReport = async () => {
    const toastID = toast.loading('Signalement en cours...');
    const res = await fetchRSR(`/api/report/create`, user?.session, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        appsource: 'web'
      },
      body: JSON.stringify({
        type: 'resource',
        documentUid: slug,
        context: slug
      })
    });
    toast.dismiss(toastID);
    if (res.ok) {
      toast.success('Signalement envoyé');
      const body = await res.json();
      console.log(body);
    } else {
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <ReportContext.Provider
      value={{ openReport, closeReport }}
    >
      {children}

      {isOpen && (
        <Transition appear show={true} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-10'
            onClose={() => setIsOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 z-10 bg-black bg-opacity-25' />
            </Transition.Child>

            <div className='fixed inset-0 z-20 overflow-y-auto'>
              <div className='flex items-center justify-center min-h-full p-4 text-center'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <Dialog.Panel
                    className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                    <Dialog.Title
                      as='h3'
                      className='inline-flex items-center justify-center w-full text-xl font-medium text-gray-900 font-marianne'
                    >
                      <CloudUploadIcon className='w-6 h-6 mt-1 mr-2 stroke-2' />
                      Signaler {type}
                    </Dialog.Title>
                    <div className='mt-4'>
                      {/*<div className='w-full grow'>*/}
                      {/*  <input*/}
                      {/*    id='file'*/}
                      {/*    type='file'*/}
                      {/*    accept='image/*,video/*,.pdf,audio/*'*/}
                      {/*    onChange={(e) => {*/}
                      {/*      let file =*/}
                      {/*        e.target.files instanceof FileList*/}
                      {/*          ? e.target.files[0]*/}
                      {/*          : null;*/}
                      {/*      if (*/}
                      {/*        file &&*/}
                      {/*        file.size <= 5_000_000 &&*/}
                      {/*        files.length < 3*/}
                      {/*      ) {*/}
                      {/*        setFiles([...files, file as any]);*/}
                      {/*        setHasChanges(true);*/}
                      {/*      } else {*/}
                      {/*        // alert("Votre fichier est trop lourd");*/}
                      {/*        //TODO: react-hot-toast*/}
                      {/*      }*/}
                      {/*      setIsOpen(false);*/}
                      {/*    }}*/}
                      {/*    className='hidden'*/}
                      {/*  ></input>*/}
                      {/*  <label*/}
                      {/*    htmlFor='file'*/}
                      {/*    className='relative flex flex-col items-center justify-center w-full h-full p-12 duration-300 border-2 border-gray-300 border-dashed rounded-lg group hover:border-gray-500 focus:outline-none active:border-bleuFrance-500 active:ring-4 ring-opacity-60 ring-bleuFrance-300'*/}
                      {/*  >*/}
                      {/*    <div*/}
                      {/*      className='inline-flex items-center justify-center w-full text-lg text-gray-500 duration-150 group-hover:text-gray-600'>*/}
                      {/*      <VolumeUpIcon className='w-6 h-6 mx-2' />*/}
                      {/*      <span>/</span>*/}
                      {/*      <PhotographIcon className='w-6 h-6 mx-2' />*/}
                      {/*      <span>/</span>*/}
                      {/*      <VideoCameraIcon className='w-6 h-6 mx-2' />*/}
                      {/*      <span>/</span>*/}
                      {/*      <DocumentIcon className='w-6 h-6 mx-2' />*/}
                      {/*    </div>*/}
                      {/*    <span className='text-sm text-gray-600 duration-300 group-hover:text-gray-700 font-spectral'>*/}
                      {/*      Fichier audio, image, vidéo, pdf accepté*/}
                      {/*    </span>*/}
                      {/*    <span className='text-xs text-gray-500 duration-300 group-hover:text-gray-600 font-spectral'>*/}
                      {/*      Maximum 5 Mo par fichier ({'jusqu\'à 3 fichiers'})*/}
                      {/*    </span>*/}
                      {/*    <span className='text-xs text-gray-500 duration-300 group-hover:text-gray-600 font-spectral'>*/}
                      {/*      {3 - files.length} fichiers restants*/}
                      {/*    </span>*/}
                      {/*  </label>*/}
                      {/*</div>*/}
                    </div>

                    <div className='inline-flex justify-end w-full mt-4'>
                      <button
                        type='button'
                        className='btn-red'
                        onClick={() => setIsOpen(false)}
                      >
                        <XIcon className='w-4 h-4 mr-2' />
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
    </ReportContext.Provider>
  );
}

interface ReportContextType {
  openReport: ({ type, label, documentId, content }) => void;
}

/**
 * It returns the value of the NotificationContext
 */
const useReport = () =>
  useContext(ReportContext) as ReportContextType;

export { ReportProvider, useReport };