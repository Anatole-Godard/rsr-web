import {AppLayoutAdmin} from "components/layouts/AppLayoutAdmin";
import type {NextPage} from "next";
import {GetServerSideProps} from 'next';
import {useEffect, useState} from "react";
import {ChartSquareBarIcon} from "@heroicons/react/outline";
import {ChartDisplay} from "@components/statistics/ChartDisplay";
import {GlobalDisplay} from "@components/statistics/GlobalDisplay";
import {useAuth} from "@hooks/useAuth";
import {fetchRSR} from "@utils/fetchRSR";
import {Resource} from "@definitions/Resource";
import ResourceModel from '@models/Resource';

const Home: NextPage<any> = ({resources = []}: { resources: Resource[] }) => {
    const [displayChart, setDisplayChart] = useState<boolean>(false);
    const {user} = useAuth();

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
                    <div className="bg-white rounded-lg px-5 py-5 mb-2">
                        <h6 className="font-bold text-gray-900 font-marianne">
                            Filtres
                        </h6>
                        <div className="inline-flex w-full mt-2">
                            <button className="btn-blue mr-2" onClick={() => setDisplayType()}>Catégorie</button>
                            <button className="btn-blue mr-2" onClick={() => setDisplayType()}>Période</button>
                            <button className="btn-blue mr-2" onClick={() => setDisplayType()}>Type de resource</button>
                        </div>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-white rounded-lg px-5 py-5">
                            {displayChart ? <ChartDisplay label="Nombre de ressources postées" resources={resources}/> :
                                <GlobalDisplay label="Nombre de ressources postées" data={resources.length}/>}
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
        cookies: {user},
    } = context.req;

    let parseUser = JSON.parse(user)

    if (!user) {
        return {
            redirect: {
                permanent: false,
                destination: "/auth/login",
            },
        };
    } else if (parseUser?.session?.role === 'user') {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const response = await fetchRSR(`http://localhost:3000/api/resource/admin`, parseUser?.session)
    const body = await response.json();


    return {
        props: {parseUser, resources: body.data.attributes},
    }
};
