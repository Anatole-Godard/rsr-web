import React, { createContext, Fragment, useContext, useState } from 'react';
import { useEventListener } from '@hooks/useEventListener';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, CloudUploadIcon, XIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { fetchRSR } from '@utils/fetchRSR';
import { useAuth } from '@hooks/useAuth';

const ReportContext = createContext({});

function ReportProvider({
                          children
                        }: {
  children: React.ReactNode;
}): JSX.Element {

  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [reportInfos, setReportInfos] = useState<{ type, label, uid, link, context }>(null);
  const [message, setMessage] = useState<string>(null);

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Escape') unsetValues();
  });

  const openReport = (reportInfos: { type, label, uid, link, context }) => {
    setReportInfos(reportInfos);
    setIsOpen(true);
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
        type: reportInfos.type,
        documentUid: reportInfos.uid,
        context: reportInfos.context,
        message,
        link: reportInfos.link
      })
    });
    unsetValues();
    toast.dismiss(toastID);
    if (res?.ok) {
      toast.success('Signalement envoyé');
      const body = await res.json();
      console.log(body);
    } else {
      console.log(res);
      toast.error('Une erreur est survenue');
    }
  };

  const unsetValues = () => {
    setIsOpen(false);
    setReportInfos(null);
    setMessage(null);
  };

  return (
    <ReportContext.Provider
      value={{ openReport }}
    >
      {children}

      {isOpen && (
        <Transition appear show={true} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-10'
            onClose={() => unsetValues()}
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
                    className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-900 dark:text-white'>
                    <Dialog.Title
                      as='h3'
                      className='inline-flex items-center justify-center w-full text-xl font-medium text-gray-900 font-marianne dark:text-white'
                    >
                      <CloudUploadIcon className='w-6 h-6 mt-1 mr-2 stroke-2' />
                      Signaler {reportInfos.label}
                    </Dialog.Title>
                    <div className='mt-4'>
                      <div className='flex items-center justify-center w-full resize-none'>
                        <textarea className='resize w-full p-2 text-gray-700 border-2 rounded border-gray-300 input'
                                  style={{ resize: 'none' }}
                                  id='report-message' rows={4}
                                  placeholder='Votre message'
                                  onChange={(event) => {
                                    setMessage(event.target.value);
                                  }} />
                      </div>
                    </div>

                    <div className='inline-flex justify-end w-full mt-4'>
                      <button
                        type='button'
                        className='btn-red'
                        onClick={() => unsetValues()}
                      >
                        <XIcon className='w-4 h-4 mr-2' />
                        Annuler
                      </button>
                      <button
                        type='button'
                        className='btn-green ml-3'
                        onClick={() => sendReport()}
                      >
                        <CheckIcon className='w-4 h-4 mr-2' />
                        Valider
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
  openReport: ({ type, label, uid, link, context }) => void;
}

/**
 * It returns the value of the NotificationContext
 */
const useReport = () =>
  useContext(ReportContext) as ReportContextType;

export { ReportProvider, useReport };