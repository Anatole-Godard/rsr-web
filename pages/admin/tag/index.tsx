import { useState } from "react";
import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import type { NextPage } from "next";
import { GetServerSideProps } from 'next';
import { CustomTable } from '@components/customTable/CustomTable';
import Link from 'next/link';

const theadList = [
  { name : 'type', label : 'Type', width : 50 },
  { name : 'name', label : 'Nom', width : 50 }
];

const Tags: NextPage<any> = ({ resources }: { resources: any }) => {

  const deleteTag                     = (element: number) => {
    //TODO: do DELETE call to back
    console.log(element)
  }

  const submitFilterForm                     = () => {

  }

  const [type, setType] = useState<string>("")

  return (
    <AppLayoutAdmin>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 p-3">
        <h1 className="pl-1 mb-1 text-2xl font-bold ">Catégories</h1>
        <div className="flex justify-between h-full w-full bg-gray-400 p-4 mb-1 rounded">
          <div className="inline-flex items-center space-x-2">
                  <span>
                    Type
                  </span>
            <input
                type="text"
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input"
            />
          </div>

          <button className="btn-blue pl-1" onClick={submitFilterForm}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            Filtrer
          </button>
        </div>
        <CustomTable theadList={theadList}
                     valuesList={resources}
                     deleteEntity={deleteTag}
                     editUrl="tag/edit"
                     totalPages={5}
                     updateCurrentPage={() => {
                     }}/>
        <div className="inline-flex justify-end w-full p-3 px-6">
          <Link href="tag/create">
            <button className="btn-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Créer
            </button>
          </Link>
        </div>
      </div>
    </AppLayoutAdmin>
  );
};

export default Tags;


export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props : {
      resources : [
        {
          id   : 1,
          type : "general",
          name : "General",
        },
        {
          id   : 2,
          type : "random",
          name : "Random",
        },
        {
          id   : 3,
          type : "cool",
          name : "Cool",
        },
        {
          id   : 4,
          type : "fun",
          name : "Fun",
        },
        {
          id   : 5,
          type : "programming",
          name : "Programming",
        },
        {
          id   : 6,
          type : "javascript",
          name : "Javascript",
        },
        {
          id   : 7,
          type : "typescript",
          name : "Typescript",
        },
        {
          id   : 8,
          type : "react",
          name : "React",
        },
        {
          id   : 9,
          type : "node",
          name : "Node",
        },
        {
          id   : 10,
          type : "express",
          name : "Express",
        },
        {
          id   : 11,
          type : "mongodb",
          name : "MongoDB",
        },
        {
          id   : 12,
          type : "mysql",
          name : "MySQL",
        },
        {
          id   : 13,
          type : "postgresql",
          name : "PostgreSQL",
        },
      ],
    },
  };
};

