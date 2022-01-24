import { NextPage } from 'next';
import { AppLayoutAdmin } from '@components/layouts/AppLayoutAdmin';
import { CustomTable } from '@components/customTable/CustomTable';
import { useEffect, useState } from 'react';
import { User } from '@definitions/User';
import { useAuth } from '@hooks/useAuth';
import { fetchRSR } from '@utils/fetchRSR';

const UserAdmin: NextPage = () => {
    const [users, setUsers]               = useState<User[]>([]);
    const [currentPage, setCurrentPage]   = useState<number>(1);
    const [limitPerPage, setLimitPerPage] = useState<number>(2);
    const [totalPages, setTotalPages]     = useState<number>(0);
    const { user }                        = useAuth();

    const beforeSetUsers = () => {
        getUsers()
    }

    const validUser = (id: number, validation: Boolean) => {
        const body = JSON.stringify({ action : 'validate', validation })
        fetchRSR(`/api/user/admin/${id}/edit`, user.session, {
                method : "PUT",
                body
            }
        ).then((res) => res.json()).then(() => {
            getUsers()
        })
    }

    const theadList = [
        { name : 'email', label : 'Email', width : 25 },
        { name : 'fullName', label : 'Nom', width : 25 },
        { name : 'role', label : 'Rôle', type : 'isRolePopUp', getEntity : beforeSetUsers, width : 25 },
        { name : 'validation', label : 'Suspensions', type : 'validation', validEntity : validUser, width : 25 },
    ];

    const updatePage = (data) => {
        const currentPage = data.selected + 1;
        setCurrentPage(currentPage);
    };

    const getUsers = (search?) => {
        let filter = ''
        if (search) {
            filter = search
        }
        fetchRSR("/api/user/admin?limit=" + limitPerPage + '&page=' + currentPage + '&search=' + filter, user.session)
            .then((res) => res.json()).then((body) => {
            if (body.data?.attributes) {
                console.log(body.data?.attributes)
                setTotalPages(body.data?.totalPages)
                setUsers(body.data?.attributes)
            }
        }).catch()
    }

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        getUsers()
    }, [currentPage])

    const [search, setSearch] = useState<string>("")

    return (
        <>
            <AppLayoutAdmin>
                <div className="flex flex-col bg-gray-100 dark:bg-gray-900 p-3">
                    <h1 className="pl-1 mb-1 text-2xl font-bold ">Utilisateurs</h1>
                    <div className="flex justify-between h-full w-full bg-gray-400 p-4 mb-1 rounded">
                        <div className="inline-flex items-center space-x-2">
                  <span>
                    Type
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
                            getUsers(search)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" className="w-4 h-4 mr-1 -mt-1 rotate-45">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                            Filtrer
                        </button>
                    </div>
                        <CustomTable theadList={theadList}
                                     valuesList={users}
                                     totalPages={totalPages}
                                     updateCurrentPage={updatePage}/>
                </div>
            </AppLayoutAdmin>
        </>
    )
};

export default UserAdmin;
