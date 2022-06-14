import {AdminLayout} from "@components/Layout/AdminLayout";
import type {NextPage} from "next";
import {GetServerSideProps} from 'next';
import {useEffect, useState, Fragment, FormEvent} from "react";
import {ChartSquareBarIcon, SearchIcon as HISearchIcon, CalculatorIcon, CodeIcon} from "@heroicons/react/outline";
import {SelectorIcon, CheckIcon, ChevronDownIcon} from "@heroicons/react/solid";
import {ChartDisplay} from "@components/Statistic/ChartDisplay";
import {GlobalDisplay} from "@components/Statistic/GlobalDisplay";
import {useAuth} from "@hooks/useAuth";
import {fetchRSR} from "libs/fetchRSR";
import {Resource} from "@definitions/Resource";
import ResourceModel from '@models/Resource';
import moment from "moment";
import {Popover, Combobox, Transition, Menu} from "@headlessui/react";
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
        setQuery('');
        setSelectedType('Type');
    };

    const getResourcesByPeriod = (min, max) => {
        var filtered = resources.filter(resource => {
            return moment(min).year() <= moment(resource.createdAt).year() && moment(resource.createdAt).year() <= moment(max).year() && moment(min).month() <= moment(resource.createdAt).month() && moment(resource.createdAt).month() <= moment(max).month();
        })
        setResourcesFiltered(filtered);
    };

    const getResourcesByType = (type) => {
        var filtered = resources.filter(resource => {
            return resource.data.type === type;
        })
        setResourcesFiltered(filtered);
    };

    const getResourcesByTag = (tag) => {
        var filtered = resources.filter(resource => {
            return resource.tags.some(t => t.name.toLowerCase() === tag.toLowerCase())
        })
        setResourcesFiltered(filtered);
    };

    const exportJSONStatistics = () => {
        const data = {
            filters: [
                {
                    name: 'Period',
                    value: `${minPeriod} - ${maxPeriod}`
                },
                {
                    name: 'Type',
                    value: selectedType
                },
                {
                    name: 'Tag',
                    value: query
                }
            ],
            data: {
                length: resourcesFiltered.length,
                resources: resourcesFiltered
            }
        }
        let dataStr = JSON.stringify(data, null, 2);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        let exportFileDefaultName = 'resourcesStatistics.json';
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    return (
        <AdminLayout>
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
                    <div className="px-5 py-5 mb-2 bg-white rounded-lg">
                        <h6 className="font-bold text-gray-900 font-marianne">
                            Filtres
                        </h6>
                        <div className="inline-flex w-full mt-2">
                            <Popover className="relative mr-2">
                                <Popover.Button className="mr-2 btn-blue">Période</Popover.Button>
                                <Popover.Panel className="absolute p-5 bg-white rounded">
                                    {({close}) => (
                                        <div className="flex flex-col">
                                            <div className="grid grid-rows-2">
                                                <p>De :</p>
                                                <input type="month" value={minPeriod}
                                                       onInput={(e) => setMinPeriod(e.currentTarget.value)}/>
                                                <p>à :</p>
                                                <input type="month" value={maxPeriod}
                                                       onInput={(e) => setMaxPeriod(e.currentTarget.value)}/>
                                                <button className="btn-blue w-20 my-2" onClick={() => {
                                                    getResourcesByPeriod(minPeriod, maxPeriod);
                                                    close();
                                                }}>Filtrer
                                                </button>
                                                <button className="w-20 my-2 btn-red" onClick={() => {
                                                    resetFilters()
                                                    close();
                                                }}>Annuler
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popover.Panel>
                            </Popover>
                            <div className="w-72 mr-2">
                                <Combobox value={selectedType} onChange={(v: any) => {
                                    setSelectedType(v.label);
                                    getResourcesByType(v.value);
                                }}>
                                    <div className="relative mt-1">
                                        <div
                                            className="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm">
                                            <Combobox.Input
                                                onChange={(e) => setQuery(e.target.value)}
                                                displayValue={() => selectedType}
                                                className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center pr-2">
                                                <SelectorIcon
                                                    className="w-5 h-5 text-gray-400 align-middle"
                                                    aria-hidden="true"
                                                />
                                            </Combobox.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                            afterLeave={() => setQuery('')}
                                        >
                                            <Combobox.Options
                                                className="absolute w-full p-5 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {types.length === 0 && query !== '' ? (
                                                        <div
                                                            className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                                                            Nothing found.
                                                        </div>
                                                    ) :
                                                    (types.map((type) => (
                                                        <Combobox.Option key={type.label} value={type}>
                                                            {({active, selected}) => (
                                                                <li className={`${
                                                                    active ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                                                                    {selected && <CheckIcon/>}
                                                                    {type.label}
                                                                </li>
                                                            )}
                                                        </Combobox.Option>
                                                    )))}
                                            </Combobox.Options>
                                        </Transition>
                                    </div>
                                </Combobox>
                            </div>
                            <div className="mr-2">
                                <label className="relative w-full text-gray-400 focus-within:text-gray-600 md:w-3/5">
                                    <HISearchIcon
                                        className="absolute w-4 h-4 duration-300 transform -translate-y-1/2 pointer-events-none top-1/2 left-3"/>
                                    <input
                                        id="search"
                                        name="search"
                                        type="text"
                                        autoComplete="off"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        required
                                        className="input px-5 py-2 h-9 pl-[2.25rem] placeholder-gray-500 w-full text-ellipsis"
                                        placeholder="Filtrer par tag"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                getResourcesByTag(query);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <button className="mr-2 btn-red" onClick={() => {
                                resetFilters();
                            }}>Supprimer les filtres
                            </button>
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button
                                        className="inline-flex justify-center w-full px-4 py-2 text-sm text-green-500 bg-green-100 rounded-md hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                        Exporter
                                        <ChevronDownIcon
                                            className="w-5 h-5 ml-2 -mr-1 text-green-500 hover:text-green-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items
                                        className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-1 py-1 ">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${
                                                            active ? 'bg-green-100 text-green-500' : 'text-gray-900'
                                                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`} onClick={() => exportJSONStatistics()}>
                                                        <CodeIcon
                                                            className="w-5 h-5 mr-2"
                                                            aria-hidden="true"/>
                                                        JSON
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item disabled>
                                                {({ active }) => (
                                                    <span
                                                        className='flex items-center w-full px-2 py-2 text-sm text-gray-500 rounded-md group'>
                                                        <CalculatorIcon
                                                            className="w-5 h-5 mr-2"
                                                            aria-hidden="true"/>
                                                        CSV (bientôt disponible)
                                                    </span>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="px-5 py-5 bg-white rounded-lg">
                            {displayChart ?
                                <ChartDisplay label="Nombre de ressources postées" resources={resourcesFiltered}
                                              minPeriod={minPeriod} maxPeriod={maxPeriod}/> :
                                <GlobalDisplay label="Nombre de ressources postées" data={resourcesFiltered.length}/>}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
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

    const response = await fetchRSR(`http://localhost:3000/api/resource/admin?limit=0`, parseUser?.session)
    const body = await response.json();


    return {
        props: {parseUser, resources: body.data.attributes},
    }
};
