import { AppLayoutAdmin } from "components/layouts/AppLayoutAdmin";
import { GetServerSideProps, NextPage } from "next";
import { CustomTable } from "@components/customTable/CustomTable";
import { useState } from "react";
import { fetchRSR } from "@utils/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { Resource } from "@definitions/Resource";
import { LibraryIcon, SearchIcon } from "@heroicons/react/outline";

const Resources: NextPage<any> = (props) => {
  const [resources, setResources] = useState<Resource[]>(
    props?.data?.attributes
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(2);
  const [totalPages, setTotalPages] = useState<number>(props?.data?.totalPages);
  const { user } = useAuth();

  const validResource = (id: number, validated: Boolean) => {
    const body = JSON.stringify({ action: "validate", validated });
    fetchRSR(`/api/resource/admin/${id}/edit`, user.session, {
      method: "PUT",
      body,
    })
      .then((res) => res.json())
      .then(() => {
        getRessources();
      });
  };

  const theadList = [
    {
      name: "owner",
      subName: "fullName",
      label: "Créateur",
      type: "isUser",
      width: 20,
    },
    { name: "slug", label: "Identifiant", width: 20 },
    {
      name: "data",
      subName: "type",
      label: "Type",
      type: "isObject",
      width: 20,
    },
    { name: "likes", label: "Likes", type: "isLikeNumber", width: 20 },
    {
      name: "validated",
      label: "Validation",
      type: "validated",
      validEntity: validResource,
      width: 25,
    },
  ];

  const getRessources = (search?) => {
    let filter = "";
    if (search) {
      filter = search;
    }

    fetchRSR(
      "/api/resource/admin?limit=" +
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
          setResources(body.data?.attributes);
          setTotalPages(body.data?.totalPages);
        }
      })
      .catch();
  };

  const updatePage = (data) => {
    const currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };

  const deleteResource = (id: number) => {
    //TODO: do DELETE call to back
  };

  const [search, setSearch] = useState<string>("");

  return (
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
                  ressources
                </span>
              </h3>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              getRessources(search);
            }}
            className="relative flex flex-row justify-between w-full space-x-3 text-sm"
          >
            <label className="relative text-gray-400 focus-within:text-gray-600">
              <LibraryIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
              <input
                id="query"
                name="query"
                type="text"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input px-5 py-2 pl-[2.25rem] placeholder-gray-500   lg:w-96 "
                placeholder="Rechercher une ressource par nom"
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
            valuesList={resources}
            deleteEntity={deleteResource}
            editUrl="/resource"
            totalPages={totalPages}
            updateCurrentPage={updatePage}
          />
        </div>
      </div>
    </AppLayoutAdmin>
  );
};

export default Resources;
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
    "http://localhost:3000/api/resource/admin?limit=5&page=1"
  );
  const body = await res.json();
  return {
    props: body,
  };
};
