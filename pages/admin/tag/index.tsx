import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { ListAllEntities } from "components/listAllEntities/ListAllEntities";
import type { NextPage } from "next";
import { GetServerSideProps } from 'next';

const theadList = [
  { name : 'type', label : 'Type', width : 50 },
  { name : 'name', label : 'Nom', width : 50 }
];


const Tags: NextPage<any> = ({ resources }: { resources: any }) => {
  const deleteTag = (element: number) => {
    //TODO: do DELETE call to back
    console.log(element)
  }

  return (
    <AppLayoutAdmin>
      <ListAllEntities title="Catégories"
                       url="tag/create"
                       valuesList={resources}
                       theadList={theadList}
                       deleteEntity={deleteTag}
                       totalPage={5}
                       updateCurrentPage={() => {
                       }}
      />
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

