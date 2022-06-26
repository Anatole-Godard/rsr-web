import { Comment } from '@definitions/Resource/Comment';
import { ExclamationIcon, TrashIcon } from '@heroicons/react/outline';
import { useAuth } from '@hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';
import { useReport } from '@hooks/useReport';
import { useRouter } from 'next/router';

interface CommentViewProps {
  comment: Comment;
  slug: string;
}

export const CommentView = ({ comment, slug }: CommentViewProps) => {
  const { owner, content, createdAt } = comment;
  const { user } = useAuth();
  const { asPath } = useRouter();
  const { openReport } = useReport();
  return (
    <li className='relative mb-6 last:pb-6'>
      <span
        className='absolute  flex items-center justify-center w-[2.25rem] h-[2.25rem] bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-800 dark:bg-blue-900'>
        <Image
          className='z-10 rounded-full'
          src={owner.photoURL || '/uploads/user/default.png'}
          alt={owner.fullName}
          layout='fill'
        />
      </span>
      <div className='relative flex flex-col mr-12 left-12'>
        <div
          className='flex items-center justify-between p-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm w-fit font-spectral dark:bg-gray-700 dark:border-gray-600'>
          {content}
        </div>
        <div className='inline-flex items-center mt-px ml-1 space-x-1 text-gray-500'>
          <span className='text-xs font-spectral'>{owner.fullName} &bull;</span>

          <time className='text-xs font-spectral'>
            {format(new Date(createdAt), 'HH:mm, dd MMM yyyy', { locale: fr })}{' '}
            &bull;
          </time>
          {user?.data && (
            <>
              <button
                // todo
                onClick={() => {
                  openReport({
                    type: 'comment',
                    label: 'Commentaire',
                    uid: slug,
                    link: asPath,
                    context: content
                  });
                }}
                className='inline-flex items-center text-xs text-yellow-600 duration-300 hover:text-yellow-800 font-spectral'
              >
                <ExclamationIcon className='w-3 h-3 mr-1 shrink-0' />
                Signaler
              </button>
              {owner.uid === user?.data.uid && (
                <>
                  <span>&bull;</span>
                  <button
                    // todo
                    className='inline-flex items-center text-xs text-red-600 duration-300 hover:text-red-800 font-spectral'
                  >
                    <TrashIcon className='w-3 h-3 mr-1 shrink-0' />
                    Supprimer
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
};
