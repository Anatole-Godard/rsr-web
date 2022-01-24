import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { NextPage } from "next";
import { CustomTable } from '@components/customTable/CustomTable';
import { useEffect, useState } from 'react';
import { fetchRSR } from '@utils/fetchRSR'
import { useAuth } from '@hooks/useAuth';
import { Resource } from '@definitions/Resource/Resource';


const Resources: NextPage<any> = () => {
    const [resources, setResources]       = useState<Resource[]>([]);
    const [currentPage, setCurrentPage]   = useState<number>(1);
    const [limitPerPage, setLimitPerPage] = useState<number>(2);
    const [totalPages, setTotalPages]     = useState<number>(0);
    const { user }                        = useAuth();

    const validResource = (id: number, validated: Boolean) => {
        const body = JSON.stringify({ action : 'validate', validated })
        fetchRSR(`/api/resource/admin/${id}/edit`, user.session, {
                method : "PUT",
                body
            }
        ).then((res) => res.json()).then(() => {
            getRessources()
        })
    }

    const theadList     = [
        { name : 'owner', subName : 'fullName', label : 'Créateur', type : 'isObject', width : 20 },
        { name : 'slug', label : 'Identifiant', width : 20 },
        { name : 'data', subName : 'type', label : 'Type', type : 'isObject', width : 20 },
        { name : 'likes', label : 'Likes', type : 'isLikeNumber', width : 20 },
        { name : 'validated', label : 'Validation', type : 'validated', validEntity : validResource, width : 25 },
    ];
    const getRessources = (search?) => {
        let filter = ''
        if (search) {
            filter = search
        }

        fetchRSR("/api/resource/admin?limit=" + limitPerPage + '&page=' + currentPage + '&search=' + filter, user.session).then((res) => res.json()).then((body) => {
            if (body.data?.attributes) {
                setResources(body.data?.attributes)
                setTotalPages(body.data?.totalPages)
            }
        }).catch()
    }
    useEffect(() => {
        getRessources()
    }, [])

    const updatePage = (data) => {
        const currentPage = data.selected + 1;
        setCurrentPage(currentPage);
    };

    const deleteResource = (id: number) => {
        //TODO: do DELETE call to back
    }

    const [search, setSearch] = useState<string>("")

    return (
        <AppLayoutAdmin>
            <div className="flex flex-col bg-gray-100 dark:bg-gray-900 p-3">
                <h1 className="pl-1 mb-1 text-2xl font-bold ">Ressources</h1>
                <div className="flex justify-between h-full w-full bg-gray-400 p-4 mb-1 rounded">
                    <div className="inline-flex items-center space-x-2">
                  <span>
                    Recherhe
                  </span>
                        <input
                            type="text"
                            id="search"
                            name="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input"
                        />
                    </div>

                    <button className="btn-blue pl-1" onClick={() => {
                        getRessources(search)
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                        Filtrer
                    </button>
                </div>
                <CustomTable theadList={theadList}
                             valuesList={resources}
                             deleteEntity={deleteResource}
                             editUrl="/resource"
                             totalPages={totalPages}
                             updateCurrentPage={updatePage}/>
            </div>
        </AppLayoutAdmin>
    );
};

export default Resources;
