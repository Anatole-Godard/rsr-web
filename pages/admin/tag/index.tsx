import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import type { NextPage } from "next";
import { CustomTable } from '@components/customTable/CustomTable';
import Link from 'next/link';
import { GetServerSideProps } from 'next';

const theadList = [
  { name : 'type', label : 'Type', width : 20 },
  { name : 'name', label : 'Nom', width : 80 }
];


const Tags: NextPage<any> = ({
                               resources,
                             }: {
  resources: [{
    type: string;
    name: string;
  }];
}) => {
  return (
    <AppLayoutAdmin>
      <div className="flex flex-col bg-gray-100 dark:bg-gray-900 h-full w-full p-3">
        <h1 className="pl-1 mb-1 text-2xl font-bold ">Catégories</h1>
        <CustomTable theadList={theadList} valuesList={resources}/>
        <div className="inline-flex justify-end w-full p-3 px-6">
          <Link href="tag/create">
            <button className="btn-blue">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
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
          type : "general",
          name : "General",
        },
        {
          type : "random",
          name : "Random",
        },
        {
          type : "cool",
          name : "Cool",
        },
        {
          type : "fun",
          name : "Fun",
        },
        {
          type : "programming",
          name : "Programming",
        },
        {
          type : "javascript",
          name : "Javascript",
        },
        {
          type : "typescript",
          name : "Typescript",
        },
        {
          type : "react",
          name : "React",
        },
        {
          type : "node",
          name : "Node",
        },
        {
          type : "express",
          name : "Express",
        },
        {
          type : "mongodb",
          name : "MongoDB",
        },
        {
          type : "mysql",
          name : "MySQL",
        },
        {
          type : "postgresql",
          name : "PostgreSQL",
        },
      ],
    },
  };
};

