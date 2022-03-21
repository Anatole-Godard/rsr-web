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
import moment from "moment";
import {Popover, Combobox} from "@headlessui/react";
import {types} from "../../constants/resourcesTypes";

const Home: NextPage<any> = ({resources = []}: { resources: Resource[] }) => {
    const [displayChart, setDisplayChart] = useState<boolean>(false);
    const [minPeriod, setMinPeriod] = useState<string>(moment(resources[0]?.createdAt).format('YYYY-MM'));
    const [maxPeriod, setMaxPeriod] = useState<string>(moment(resources[-1]?.createdAt).format('YYYY-MM'));
    const [resourcesFiltered, setResourcesFiltered] = useState<Resource[]>(resources);
    const [selectedType, setSelectedType] = useState<string>('Type');
    const [query, setQuery] = useState<string>('');

    const setDisplayType = () => {
        setDisplayChart(!displayChart);
    };

    const resetFilters = () => {
        setMinPeriod(moment(resources[0]?.createdAt).format('YYYY-MM'));
        setMaxPeriod(moment(resources[-1]?.createdAt).format('YYYY-MM'));
        setResourcesFiltered(resources);
    };

    const getResourcesByPeriod = (min, max) => {
        var filtered = resources.filter(resource => {
            return moment(min).year() <= moment(resource.createdAt).year() && moment(resource.createdAt).year() <= moment(max).year() && moment(min).month() <= moment(resource.createdAt).month() && moment(resource.createdAt).month() <= moment(max).month();
        })
        setResourcesFiltered(filtered);
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
                            <Popover className="relative">
                                <Popover.Button className="btn-blue mr-2">Période</Popover.Button>
                                <Popover.Panel className="absolute p-5 bg-white rounded">
                                    {({close}) => (
                                    <div className="flex flex-col">
                                        <div className="grid grid-rows-2">
                                            <p>De :</p>
                                            <input type="month" value={minPeriod}
                                                   onInput={(e) => setMinPeriod(e.target.value)}/>
                                            <p>à :</p>
                                            <input type="month" value={maxPeriod}
                                                   onInput={(e) => setMaxPeriod(e.target.value)}/>
                                            <button className="btn-blue w-20 my-2" onClick={() => {
                                                getResourcesByPeriod(minPeriod, maxPeriod);
                                                close();
                                            }}>Filtrer
                                            </button>
                                            <button className="btn-red w-20 my-2" onClick={() => {
                                                resetFilters()
                                                close();
                                            }}>Annuler
                                            </button>
                                        </div>
                                    </div>
                                        )}
                                </Popover.Panel>
                            </Popover>
                            <Combobox value={selectedType} onChange={(v) => setSelectedType(v.label)}>
                                <Combobox.Input
                                    onChange={(e) => setQuery(e.target.value)}
                                    displayValue={() => selectedType}
                                />
                                <Combobox.Options>
                                    {/* TODO: Add type filter on resources*/}
                                    {types.map((type) => (
                                        <Combobox.Option
                                            key={type.label}
                                            value={type}
                                        >
                                            {type.label}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            </Combobox>
                            <button className="btn-blue mr-2" onClick={() => setDisplayType()}>Catégorie</button>
                            <button className="btn-blue mr-2" onClick={() => setDisplayType()}>Type de resource</button>
                            <button className="btn-red mr-2" onClick={() => {
                                resetFilters();
                            }}>Supprimer les filtres
                            </button>
                        </div>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="bg-white rounded-lg px-5 py-5">
                            {displayChart ?
                                <ChartDisplay label="Nombre de ressources postées" resources={resourcesFiltered} minPeriod={minPeriod} maxPeriod={maxPeriod}/> :
                                <GlobalDisplay label="Nombre de ressources postées" data={resourcesFiltered.length}/>}
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
