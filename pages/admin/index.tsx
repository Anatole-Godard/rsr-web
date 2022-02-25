import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import type { NextPage } from "next";
import { GetServerSideProps } from 'next';

const Home: NextPage = () => {
    const [displayChart, setDisplayChart] = useState<boolean>(false);

    const setDisplayType = () => {
        setDisplayChart(!displayChart);
    };

    return (
        <AppLayoutAdmin>
            <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
                <div
                    className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
                    <div className="inline-flex items-end justify-between w-full mb-2">
                        <div className="flex flex-col space-y-2">
                            <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                                Tableau de bord
                            </h3>
                            <div className="inline-flex w-full">
                                {!displayChart ?
                                    (<button className="btn-blue" onClick={() => setDisplayType()}>
                                        Graphiques
                                        <ChartSquareBarIcon className="w-4 h-4 ml-2"/>
                                    </button>) : (<button className="btn-green" onClick={() => setDisplayType()}>
                                        Global
                                        <ChartSquareBarIcon className="w-4 h-4 ml-2"/>
                                    </button>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 overflow-y-auto bg-gray-100 grow xl:rounded-tl-xl">
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-white rounded-lg px-5 py-5">
                            {displayChart ? <ChartDisplay label="Nombre de visites"/> :
                                <GlobalDisplay label="Nombre de visites"/>}
                        </div>
                        <div className="bg-white rounded-lg px-5 py-5">
                            {displayChart ? <ChartDisplay label="Nombre de ressources postées"/> :
                                <GlobalDisplay label="Nombre de ressources postées"/>}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayoutAdmin>
    );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
          cookies: { user },
        } = context.req;

  let parseUser= JSON.parse(user)

  if (!user ){
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }else if (parseUser?.session?.role === 'user'){
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: { parseUser },
  }
};
