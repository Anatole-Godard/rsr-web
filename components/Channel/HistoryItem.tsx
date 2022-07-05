import { Iframe } from '@components/Channel/Iframe';
import { Activity } from '@definitions/Activity';
import { Message } from '@definitions/Message';
import {
  ChatAlt2Icon,
  ChatIcon,
  UserAddIcon,
  ExclamationIcon
} from '@heroicons/react/outline';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { useReport } from '@hooks/useReport';

type History = (Message | Activity) & {
  context: { name: string };
};

export const HistoryItem = ({ user, data, createdAt, context }: History) => {
  const t = useTranslations('HistoryItem');
  const { locale } = useRouter();
  const { asPath } = useRouter();
  const { openReport } = useReport();

  return (
    <li className='mb-6 ml-6 last:pb-6'>
      <span
        className='absolute flex items-center justify-center w-6 h-6 bg-blue-200 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900'>
        <Image
          className='rounded-full shadow-lg'
          src={user.photoURL || '/uploads/user/default.png'}
          alt={user.fullName}
          layout='fill'
        />
      </span>
      {data.type === 'invite' && (
        <div
          className='flex items-center justify-between p-2 pr-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
          <time className='order-last mb-0 text-xs font-normal text-gray-400'>
            {formatDistance(new Date(createdAt), new Date(), { locale: fr })}
          </time>
          <div className='inline-flex items-center'>
            <span className='flex items-center justify-center w-8 h-8 mr-2 text-indigo-700 bg-indigo-100 rounded-md'>
              <UserAddIcon className='w-4 h-4' />
            </span>
            <div className='text-sm font-normal text-gray-500 dark:text-gray-300'>
              {t('invite', { name: user.fullName })}
              <a
                href='#'
                className='mx-2 font-semibold text-indigo-600 underline dark:text-indigo-500 decoration-dotted'
              >
                {data.user.fullName}
              </a>
              {t('in')}
              <span
                className='bg-gray-100 text-gray-800 text-xs font-normal mx-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300'>
                {context.name}
              </span>
            </div>
          </div>
        </div>
      )}
      {data.type === 'comment' && (
        <div
          className='p-2 pr-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
          <div className='flex items-center justify-between mb-3'>
            <time className='order-last mb-0 text-xs font-normal text-gray-400'>
              {formatDistance(new Date(createdAt), new Date(), {
                locale: locale === 'fr' ? fr : undefined
              })}
            </time>
            <button
              onClick={() => {
                openReport({
                  type: 'user',
                  label: 'un utilisateur',
                  context: user.fullName + (': ' + data?.text) || '',
                  uid: user.uid,
                  link: asPath
                });
              }}
              className='order-last px-2 m-0 ml-1 text-gray-700 bg-gray-100 btn-text-yellow'
            >
              <ExclamationIcon className='w-4 h-4' />
            </button>
            <div className='inline-flex items-center'>
              <span className='flex items-center justify-center w-8 h-8 mr-2 text-green-700 bg-green-100 rounded-md'>
                <ChatIcon className='w-4 h-4' />
              </span>
              <div className='text-sm font-normal text-gray-500 lex dark:text-gray-300'>
                {t('comment', { name: user.fullName })}
                <a
                  href='#'
                  className='ml-2 font-semibold text-green-600 underline dark:text-green-500 decoration-dotted'
                >
                  {data.resource.data.attributes.properties.name}
                </a>
              </div>
            </div>
          </div>
          <div
            className='p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 w-fit'>
            {data.text}
          </div>
        </div>
      )}
      {data.type === 'message' && (
        <div
          className='p-2 pr-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
          <div className='inline-flex items-center justify-between w-full'>
            <time className='order-last mb-0 text-xs font-normal text-gray-400'>
              {formatDistance(new Date(createdAt), new Date(), {
                locale: locale === 'fr' ? fr : undefined
              })}
            </time>
            <button
              onClick={() => {
                openReport({
                  type: 'user',
                  label: 'un utilisateur',
                  context: user.fullName + (': ' + data?.text) || '',
                  uid: user.uid,
                  link: asPath
                });
              }}
              className='order-last px-2 m-0 ml-1 text-gray-700 bg-gray-100 btn-text-yellow'
            >
              <ExclamationIcon className='w-4 h-4' />
            </button>
            <div className='inline-flex items-center grow'>
              <span
                className='flex items-center justify-center w-8 h-8 mr-2 rounded-md shrink-0 text-amber-700 bg-amber-100'>
                <ChatAlt2Icon className='w-4 h-4' />
              </span>
              <div className='min-w-full text-sm font-normal text-gray-500 dark:text-gray-300'>
                <span className='mr-2 w-72'>{user.fullName}</span>
                <span
                  className='bg-gray-100 text-gray-800 text-xs font-normal mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-300'>
                  {data.text?.match(/(\/resource\/[\S]*)/) ? (
                    <a className='underline' href={data.text}>
                      {data.text}
                    </a>
                  ) : (
                    data.text
                  )}
                </span>
              </div>
            </div>
          </div>
          {data.text?.match(/(\/resource\/[\S]*)/) && (
            <>
              {/* TODO: why not change to ResourceView component ? */}
              <div
                className='hidden p-3 mt-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg md:block bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 w-fit'>
                <Iframe
                  src={data.text?.match(/(\/resource\/[\S]*)/)[0]}
                  height={400}
                  width={600}
                />
              </div>
              <div
                className='block p-3 mt-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg md:hidden bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 w-fit'>
                {t('mobile-disabled')}
              </div>
            </>
          )}
        </div>
      )}
      {data.type === 'resource_create' && (
        <div
          className='p-2 pr-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600'>
          <div className='flex items-center justify-between mb-3'>
            <time className='order-last mb-0 text-xs font-normal text-gray-400'>
              {formatDistance(new Date(createdAt), new Date(), {
                locale: locale === 'fr' ? fr : undefined
              })}
            </time>
            <div className='inline-flex items-center'>
              <span className='flex items-center justify-center w-8 h-8 mr-2 text-blue-700 bg-blue-100 rounded-md'>
                <UserAddIcon className='w-4 h-4' />
              </span>
              <div className='text-sm font-normal text-gray-500 dark:text-gray-300'>
                {t('resource-created', { name: user.fullName })}
                <a
                  href='#'
                  className='ml-2 font-semibold text-blue-600 underline dark:text-blue-500 decoration-dotted'
                >
                  {data.resource.data.attributes.properties.name}
                </a>
              </div>
            </div>
          </div>
          <div
            className='p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 w-fit'>
            <Iframe
              src={`/resource/${data.resource.slug}`}
              height={400}
              width={800}
            />
          </div>
        </div>
      )}
    </li>
  );
};
