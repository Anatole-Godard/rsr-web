import { GetServerSideProps, NextPage } from "next";
import { AppLayoutAdmin } from "@components/layouts/AppLayoutAdmin";
import { CustomTable } from "@components/customTable/CustomTable";
import { useCallback, useEffect, useState } from "react";
import { User } from "@definitions/User";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "@utils/fetchRSR";
import { SearchIcon, UserIcon } from "@heroicons/react/outline";
import Image from "next/image";

const UserAdmin: NextPage<any> = (props) => {
  const [users, setUsers] = useState<User[]>(props?.data?.attributes);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(2);
  const [totalPages, setTotalPages] = useState<number>(props?.data?.totalPages);
  const { user } = useAuth();

  const beforeSetUsers = () => {
    getUsers();
  };

  const validUser = (id: number, validated: Boolean) => {
    const body = JSON.stringify({ action: "validate", validated });
    fetchRSR(`/api/user/admin/${id}/edit`, user.session, {
      method: "PUT",
      body,
    }).then(() => {
      getUsers();
    });
  };

  const theadList = [
    { name: "email", label: "Email", width: 25 },
    { name: "fullName", label: "Nom", width: 25 },
    {
      name: "role",
      label: "Rôle",
      type: "isRolePopUp",
      getEntity: beforeSetUsers,
      width: 25,
    },
    {
      name: "validated",
      label: "Suspensions",
      type: "validated",
      validEntity: validUser,
      width: 25,
    },
  ];

  const updatePage = (data) => {
    const currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  const getUsers = useCallback(
    (search?) => {
      let filter = "";
      if (search) {
        filter = search;
      }
      fetchRSR(
        "/api/user/admin?limit=" +
          limitPerPage +
          "&page=" +
          currentPage +
          "&search=" +
          filter,
        user.session
      )
        .then((res) => res.json())
        .then((body) => {
          if (body.data?.attributes) {
            console.log(body.data?.attributes);
            setTotalPages(body.data?.totalPages);
            setUsers(body.data?.attributes);
          }
        })
        .catch();
    },
    [currentPage, limitPerPage, user.session]
  );

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const [search, setSearch] = useState<string>("");

  return (
    <>
      <AppLayoutAdmin>
        <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
          <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
            <div className="inline-flex items-end justify-between w-full mb-2">
              <div className="flex flex-col space-y-2">
                {/* <div className="w-auto h-auto">
                  <Image
                    src="/img/books.png"
                    width={64}
                    height={64}
                    alt="Books"
                  />
                </div> */}
                <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                  Liste des
                  <span className="ml-1 text-blue-600 dark:text-blue-400">
                    utilisateurs
                  </span>
                </h3>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                getUsers(search);
              }}
              className="relative flex flex-row justify-between w-full space-x-3 text-sm"
            >
              <label className="relative text-gray-400 focus-within:text-gray-600">
                <UserIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
                <input
                  id="query"
                  name="query"
                  type="text"
                  autoComplete="off"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input px-5 py-2 pl-[2.25rem] placeholder-gray-500   lg:w-96 "
                  placeholder="Rechercher un utilisateur par nom"
                />
              </label>

              <button className="btn-blue" type="submit">
                <SearchIcon className="w-4 h-4 mr-1" />
                Rechercher
              </button>
            </form>
          </div>
          <div className="h-full p-6 bg-gray-100 min-h-max max-h-max dark:bg-gray-900 lg:p-12">
            <CustomTable
              theadList={theadList}
              valuesList={users}
              totalPages={totalPages}
              updateCurrentPage={updatePage}
            />
          </div>
        </div>

        {/* <div className="flex flex-col h-full p-3 bg-gray-100 dark:bg-gray-900">
          <h1 className="pl-1 mb-1 text-3xl font-bold font-marianne ">
            Utilisateurs
          </h1>
          <div className="flex justify-between w-full p-4 mb-1 bg-gray-400 rounded h-fit">
            <div className="inline-flex items-center space-x-2">
              <span>Recherche</span>
              <input
                type="text"
                id="search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
            </div>

            <button
              className="pl-1 btn-blue"
              onClick={() => {
                getUsers(search);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4 mr-1 -mt-1 rotate-45"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                ></path>
              </svg>
              Filtrer
            </button>
          </div>
        </div> */}
      </AppLayoutAdmin>
    </>
  );
};

export default UserAdmin;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  }

  const res = await fetch(
    "http://localhost:3000/api/user/admin?limit=5&page=1"
  );
  const body = await res.json();
  return {
    props: body,
  };
};
