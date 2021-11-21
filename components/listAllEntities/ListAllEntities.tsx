import { CustomTable } from '@components/customTable/CustomTable';
import Link from 'next/link';

export const ListAllEntities = ({
                                  valuesList,
                                  theadList,
                                  title,
                                  url,
                                  deleteEntity,
                                  totalPages,
                                  updateCurrentPage
                                }: {
  valuesList: [{}],
  theadList: [{}],
  title: string,
  url: string,
  deleteEntity: any,
  totalPages: number,
  updateCurrentPage: any;
}) => {

  return (
    <>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 p-3">
        <h1 className="pl-1 mb-1 text-2xl font-bold ">{title}</h1>
        <CustomTable theadList={theadList}
                     valuesList={valuesList}
                     deleteEntity={deleteEntity}
                     totalPages={totalPages}
                     updateCurrentPage={updateCurrentPage}/>
        <div className="inline-flex justify-end w-full p-3 px-6">
          <Link href={url}>
            <button className="btn-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Créer
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

