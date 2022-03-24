import { GetServerSideProps, NextPage } from "next";
import { AppLayoutAdmin } from "@components/layouts/AppLayoutAdmin";
import { CustomTable } from "@components/customTable/CustomTable";
import { useCallback, useEffect, useState } from "react";
import { User } from "@definitions/User";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "@utils/fetchRSR";
import { SearchIcon, UserIcon } from "@heroicons/react/outline";

const UserAdmin: NextPage<any> = (props) => {
  const [users, setUsers] = useState<User[]>(props?.data?.attributes);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(
    parseInt(process.env.NEXT_PUBLIC_BACK_OFFICE_MAX_ENTITIES)
  );
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
            setTotalPages(body.data?.totalPages);
            setUsers(body.data?.attributes);
          }
        })
        .catch();
    },
    [currentPage, limitPerPage, user?.session]
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

              <button className="btn-bleuFrance" type="submit">
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
      </AppLayoutAdmin>
    </>
  );
};

export default UserAdmin;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    cookies: { user },
  } = context.req;

  let parseUser = JSON.parse(user);

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/login",
      },
    };
  } else if (
    parseUser?.session?.role === "user" ||
    parseUser?.session?.role === "moderator"
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const limit = parseInt(process.env.NEXT_PUBLIC_BACK_OFFICE_MAX_ENTITIES);
  const res = await fetch(
    "http://localhost:3000/api/user/admin?limit=" + limit + "&page=1"
  );
  const body = await res.json();
  return {
    props: body,
  };
};
