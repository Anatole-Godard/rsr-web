import { GetServerSideProps, NextPage } from "next";
import { AdminLayout } from "@components/Layout/AdminLayout";
import { CustomTable } from "@components/UI/CustomTable";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { fetchRSR } from "libs/fetchRSR";
import { SearchIcon, UserIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Log } from "@definitions/Log";

const LogAdmin: NextPage<any> = (props) => {
  const [logs, setLogs] = useState<Log[]>(props?.data?.attributes);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limitPerPage = parseInt(
    process.env.NEXT_PUBLIC_BACK_OFFICE_MAX_ENTITIES
  );
  const [totalPages, setTotalPages] = useState<number>(props?.data?.totalPages);
  const [search, setSearch] = useState<string>("");

  const { user } = useAuth();
  const router = useRouter();

  const theadList = [
    {
      name: "user",
      subName: "fullName",
      label: "Utilisateur",
      type: "isUser",
      width: 20,
    },
    { name: "type", label: "Type", width: 5 },
    { name: "method", label: "Méthode", width: 5 },
    { name: "url", label: "URL", width: 20 },
    { name: "createdAt", label: "Date", width: 20, type: "isDate" },
  ];

  const updatePage = (data) => {
    const currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  const getLogs = useCallback(
    async (search?) => {
      let filter = "";
      if (search) {
        filter = search;
      }

      if (!user?.session) {
        await router.push("/");
        return;
      }

      const res = await fetchRSR(
        "/api/log/admin?limit=" +
          limitPerPage +
          "&page=" +
          currentPage +
          "&search=" +
          filter,
        user.session
      );
      if (res?.ok) {
        const body = await res.json();
        if (body.data?.attributes) {
          toast.success("Récupération des logs réussie");
          setTotalPages(body.data?.totalPages);
          setLogs(body.data?.attributes);
        }
      } else {
        toast.error("Une erreur est survenue");
      }
    },
    [currentPage, limitPerPage, router, user?.session]
  );

  useEffect(() => {
    getLogs();
  }, [currentPage, getLogs]);

  return (
    <>
      <AdminLayout title="Utilisateurs - Admin.">
        <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
          <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
            <div className="inline-flex items-end justify-between w-full mb-2">
              <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                Logs -
                <span className="ml-1 text-blue-600 dark:text-blue-400">
                  Routes
                </span>
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                getLogs(search);
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
              valuesList={logs}
              totalPages={totalPages}
              updateCurrentPage={updatePage}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default LogAdmin;
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
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
      "http://localhost:3000/api/log/admin?limit=" + limit + "&page=1"
    );
    const body = await res.json();
    return {
      props: {
        ...body,
        i18n: (await import(`../../i18n/${context.locale}.json`)).default,
      },
    };
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
