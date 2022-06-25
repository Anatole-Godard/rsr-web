import { AdminLayout } from "@components/Layout/AdminLayout";
import { GetServerSideProps, NextPage } from "next";
import { CustomTable } from "@components/UI/CustomTable";
import { useCallback, useEffect, useState } from "react";
import { fetchRSR } from "libs/fetchRSR";
import { useAuth } from "@hooks/useAuth";
import { SearchIcon, TagIcon } from "@heroicons/react/outline";
import { TagDocument } from "@definitions/Resource/Tag";
import toast from "react-hot-toast";

const TagManager: NextPage<any> = (props) => {
  console.log(props);
  const [tags, setTags] = useState<TagDocument[]>(props?.data?.attributes);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limitPerPage, setLimitPerPage] = useState<number>(
    parseInt(process.env.NEXT_PUBLIC_BACK_OFFICE_MAX_ENTITIES)
  );
  const [totalPages, setTotalPages] = useState<number>(props?.data?.totalPages);
  const { user } = useAuth();

  const validate = async (_id: string, validated: Boolean) => {
    const body = JSON.stringify({ action: "validate", validated, _id });
    const toastID = toast.loading(
      validated
        ? "Validation de l'étiquette en cours..."
        : "Suspension de l'étiquette en cours..."
    );
    const res = await fetchRSR(`/api/resource/admin/tags`, user.session, {
      method: "PUT",
      body,
    });
    toast.dismiss(toastID);
    if (res.ok)
      toast.success(
        validated
          ? "Validation de l'étiquette réussie"
          : "Suspension de l'étiquette réussie"
      );

    getTags();
  };
  const deleteTag = async (_id: string) => {
    const toastID = toast.loading("Suppression de l'étiquette en cours...");
    const res = await fetchRSR(`/api/resource/admin/tags/`, user.session, {
      method: "DELETE",
      body: JSON.stringify({ _id }),
    });
    toast.dismiss(toastID);
    if (res.ok) toast.success("Suppression de l'étiquette réussie");
    else toast.error("Une erreur est survenue");
    getTags();
  };

  const theadList = [
    {
      name: "owner",
      subName: "fullName",
      label: "Créateur",
      type: "isUser",
      width: 20,
    },
    { name: "name", label: "Nom de l'étiquette" },

    {
      name: "validated",
      label: "Validation",
      type: "validated",
      isTag: true,
      validEntity: validate,
      width: 25,
    },
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getTags = useCallback(
    async (search?) => {
      let filter = "";
      if (search) {
        filter = search;
      }

      const res = await fetchRSR(
        "/api/resource/admin/tags?limit=" +
          limitPerPage +
          "&page=" +
          currentPage +
          "&search=" +
          filter,
        user.session
      );
      if (res.ok) {
        const body = await res.json();
        if (body.data?.attributes) {
          setTags(body.data?.attributes);
          setTotalPages(body.data?.totalPages);
        }
        toast.success("Récupération des étiquettes réussie");
      } else {
        toast.error("Une erreur est survenue");
      }
    },
    [currentPage, limitPerPage, user?.session]
  );

  useEffect(() => {
    getTags();
  }, [currentPage, limitPerPage, getTags]);

  const updatePage = (data: { selected: number }) => {
    const currentPage = data.selected + 1;
    setCurrentPage(currentPage);
  };
  const [search, setSearch] = useState<string>("");

  return (
    <AdminLayout title="Tags - Admin.">
      <div className="flex flex-col w-full h-full bg-white dark:bg-black grow">
        <div className="flex flex-col w-full px-6 py-6 bg-white shrink-0 lg:px-12 dark:bg-black dark:border-gray-800">
          <div className="inline-flex items-end justify-between w-full mb-2">
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-800 font-marianne dark:text-gray-200">
                Liste des
                <span className="ml-1 text-blue-600 dark:text-blue-400">
                  étiquettes
                </span>
              </h3>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              getTags(search);
            }}
            className="relative flex flex-row justify-between w-full space-x-3 text-sm"
          >
            <label className="relative text-gray-400 focus-within:text-gray-600">
              <TagIcon className="absolute w-4 h-4 transform -translate-y-1/2 pointer-events-none top-1/2 left-3" />
              <input
                id="query"
                name="query"
                type="text"
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input px-5 py-2 pl-[2.25rem] placeholder-gray-500   lg:w-96 "
                placeholder="Rechercher une étiquette par nom"
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
            valuesList={tags}
            totalPages={totalPages}
            updateCurrentPage={updatePage}
            deleteEntity={deleteTag}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default TagManager;
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
  } else if (parseUser?.session?.role === "user") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const limit = parseInt(process.env.NEXT_PUBLIC_BACK_OFFICE_MAX_ENTITIES);
  const res = await fetchRSR(
    "http://localhost:3000/api/resource/admin/tags?limit=" + limit + "&page=1",
    parseUser.session
  );
  const body = await res.json();
  return {
    props: body,
  };
};
