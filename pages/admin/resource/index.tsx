import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { NextPage } from "next";
import { CustomTable } from '@components/customTable/CustomTable';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchRSR } from '@utils/fetchRSR'
import { useAuth } from '@hooks/useAuth';
import { Resource } from '@definitions/Resource/Resource';


const theadList = [
    { name : 'owner', label : 'Créateur', width : 20 },
    { name : 'slug', label : 'Identifiant', width : 20 },
    { name : 'data', subName: 'type', label : 'Type', type:'isObject', width : 20 },
    { name : 'likes', label : 'Likes', type:'isLikeNumber', width : 20 },
];

const Resources: NextPage<any> = () => {
    const [resources, setResources] = useState<Resource[]>([]);
    const { user }                  = useAuth();

    useEffect(() => {
            fetchRSR("/api/resource/all", user.session).then((res) => res.json()).then((body) => {
                if (body.data.attributes) {
                    setResources(body.data.attributes)
                }
            }).catch()
        }, [])

    const deleteResource = (id: number) => {
        //TODO: do DELETE call to back
    }

    const submitFilterForm = () => {

    }

    const [type, setType] = useState<string>("")

    return (
        <AppLayoutAdmin>
            <div className="flex flex-col bg-gray-100 dark:bg-gray-900 p-3">
                <h1 className="pl-1 mb-1 text-2xl font-bold ">Ressources</h1>
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
                             deleteEntity={deleteResource}
                             editUrl="resource/edit"
                             totalPages={5}
                             updateCurrentPage={() => {
                             }}/>
                <div className="inline-flex justify-end w-full p-3 px-6">
                    <Link href="resource/create">
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

export default Resources;
