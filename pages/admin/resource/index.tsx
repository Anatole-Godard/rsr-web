import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { GetServerSideProps, NextPage } from "next";
import { CustomTable } from '@components/customTable/CustomTable';


const theadList = [
  { name : 'type', label : 'Type', width : 20 },
  { name : 'name', label : 'Nom', width : 80 }
];

const Dashboard: NextPage<any> = ({
                                    resources,
                                  }: {
  resources: [{
    type: string;
    name: string;
  }];
}) => {
  return (
    <AppLayoutAdmin>
      <CustomTable theadList={theadList} valuesList={resources}/>
    </AppLayoutAdmin>
  );
};

export default Dashboard;

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
