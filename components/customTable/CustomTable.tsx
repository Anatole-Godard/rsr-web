import { v4 as uuidv4 } from "uuid";
import {
  BanIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilAltIcon,
  ThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import ReactPaginate from "react-paginate";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { ChipList } from "@components/ui/ChipList";
import { classes } from "@utils/classes";
import { fetchRSR } from "@utils/fetchRSR";
import { useAuth } from "@hooks/useAuth";

const roleType = [
  { label: "Utilisateur", value: "user" },
  { label: "Modérateur", value: "moderator" },
  { label: "Administrateur", value: "admin" },
  { label: "Super-administrateur", value: "superadmin" },
];

export const CustomTable = ({
  theadList,
  valuesList,
  deleteEntity,
  readUrl,
  editUrl,
  totalPages,
  updateCurrentPage,
}: {
  theadList: object[];
  valuesList: any[];
  deleteEntity?: any;
  readUrl?: string;
  editUrl?: string;
  totalPages: number;
  updateCurrentPage: any;
}) => {
  // DISPLAY TABLE HEADERS LIST
  const displayTableHeader = (list: object[]) => {
    if (list) {
      return list.map((value: any) => (
        <th
          key={uuidv4()}
          style={{ width: `${value.width - 10 / list.length}%` }}
          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400 font-marianne"
        >
          {value.label}
        </th>
      ));
    }
    return <></>;
  };

  const displayValue = (theadValue: any, value: any) => {
    let displayedValue: any = "";
    let displayedFullValue: string = "";
    let isJsx: boolean = false;

    // TODO add other type like date, dateTime...
    switch (theadValue.type) {
      case "isUser":
        isJsx = true;
        displayedValue = (
          <div className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value[theadValue.name].photoURL}
              alt={value[theadValue.name].fullName}
              className="w-6 h-6 mr-2 rounded-full"
            ></img>
            <span>{value[theadValue.name].fullName}</span>
          </div>
        );
        break;

      case "isArray":
        displayedValue = value[theadValue.name]
          .map((v: { label: string }) => v.label)
          .join(", ");
        break;
      case "isObject":
        const object = value[theadValue.name];
        displayedValue = object[theadValue.subName];
        break;
      case "isArray":
        const length = value[theadValue.name].length;
        displayedValue = length;
        break;
      case "isStatus":
        displayedValue = value[theadValue.name] ? "Actif" : "Inactif";
        break;
      case "isLength":
        displayedValue = value[theadValue.name].length || "-";
        break;
      case "isLike":
        isJsx = true;
        displayedValue = (
          <div className="flex items-center">
            <ThumbUpIcon className="w-4 h-4 mr-1 shrink-0 " />
            {value[theadValue.name].length}
          </div>
        );
        break;
      case "isRolePopUp":
        isJsx = true;
        displayedValue = (
          <UserRolePopUp
            role={roleType.find((el) => {
              return value[theadValue.name] === el.value;
            })}
            id={value.uid}
            getEntity={theadValue.getEntity}
          />
        );
        break;
      case "validated":
        isJsx = true;
        displayedValue = (
          <div
            className="inline-flex items-center"
            onClick={() => {
              theadValue.validEntity(value.uid, !value[theadValue.name]);
            }}
          >
            {value[theadValue.name] ? (
              <>
                <button className="ml-1 btn-gray dark:btn-red">
                  <BanIcon className="w-4 h-4 mr-1 shrink-0" />
                  Suspendre
                </button>
              </>
            ) : (
              <>
                <button className="ml-1 btn-green">
                  <CheckIcon className="w-4 h-4 mr-1 shrink-0" />
                  Activer
                </button>
              </>
            )}
          </div>
        );
        break;
      default:
        displayedValue = value[theadValue.name];
        break;
    }

    if (!isJsx) {
      displayedFullValue = displayedValue;
      if (displayedValue?.length > 50) {
        displayedValue = `${displayedValue.substring(0, 50)}...`;
      }
    }

    return { title: displayedFullValue, value: displayedValue };
  };

  return (
    <>
      <table className="w-full rounded-md" key={uuidv4()}>
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700">
            {displayTableHeader(theadList)}
            {readUrl && <th />}
            {editUrl && <th />}
            {deleteEntity && <th />}
          </tr>
        </thead>
        {valuesList && valuesList.length > 0 && (
          <tbody className="bg-gray-300 dark:bg-gray-500 grow">
            {valuesList &&
              valuesList.length > 0 &&
              valuesList.map((value: any) => (
                <tr
                  /** TODO edit entity on click  */ key={uuidv4()}
                  className="bg-white border-b last:border-b-0 dark:bg-gray-800 dark:border-gray-700"
                >
                  {theadList &&
                    theadList.map((theadValue: any, index: number) => (
                      <td
                        key={index}
                        className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white font-spectral"
                      >
                        <span
                          className="inline-flex items-center"
                          title={displayValue(theadValue, value).title}
                        >
                          {displayValue(theadValue, value).value}
                        </span>
                      </td>
                    ))}
                  {readUrl && (
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white font-spectral">
                      <Link href={readUrl + "/" + value.slug + ""}>
                        <a className="px-2 py-2 btn-gray">
                          <EyeIcon className="w-4 h-4 shrink-0" />
                        </a>
                      </Link>
                    </td>
                  )}
                  {editUrl && (
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white font-spectral">
                      <Link href={editUrl + "/" + value.slug + "/edit"}>
                        <a className="px-2 py-2 btn-gray">
                          <PencilAltIcon className="w-4 h-4 shrink-0" />
                        </a>
                      </Link>
                    </td>
                  )}
                  {deleteEntity && (
                    <td
                      className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white font-spectral"
                      onClick={() => deleteEntity(value.slug || value.uid)}
                    >
                      <a className="px-2 py-2 cursor-pointer btn-red">
                        <TrashIcon className="w-4 h-4 shrink-0" />
                      </a>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        )}
      </table>
      {totalPages !== null && (
        <ReactPaginate
          previousLabel={
            <button className="px-2 py-2 btn-gray">
              <ChevronLeftIcon className="w-4 h-4 shrink-0" />
            </button>
          }
          nextLabel={
            <button className="px-2 py-2 btn-gray">
              <ChevronRightIcon className="w-4 h-4 shrink-0" />
            </button>
          }
          breakLabel="..."
          breakClassName="break-me"
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={updateCurrentPage}
          containerClassName="mt-4 rounded-xl bg-gray-200 dark:bg-black space-x-4 justify-center inline-flex items-center w-fit list-none px-2 py-2"
          pageClassName="cursor-pointer text-sm font-medium bg-gray-100 dark:bg-gray-800 whitespace-nowrap dark:text-white font-spectral px-3 py-1.5 rounded-lg"
          pageLinkClassName="cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap dark:text-white font-spectral"
          activeClassName="bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
          activeLinkClassName="bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
        />
      )}
    </>
  );
};

const UserRolePopUp = ({ role, id, getEntity }) => {
  const { user } = useAuth();
  const ref: any = useRef();
  const [roleSelected, setRoleSelected]: any[] = useState([role]);
  const [open, setOpen]: any[] = useState(false);

  const updateRole = () => {
    //TODO: verify the current user role (only admin | super-admin)
    if (roleSelected && roleSelected.length === 1) {
      const body = JSON.stringify({
        action: "change-role",
        role: roleSelected[0].value,
      });
      fetchRSR(`/api/user/admin/${id}/edit`, user.session, {
        method: "PUT",
        body,
      })
        .then((res) => res.json())
        .then(() => {
          getEntity();
        });
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (open && ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <>
        <button
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className="flex items-center">
            {role.label}
            <ChevronDownIcon
              className={classes(
                "shrink-0 w-5 h-5 ml-1 duration-300 text-black",
                open ? "rotate-180" : ""
              )}
            />
          </div>
        </button>
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div
            className={classes(
              "absolute -left-20 z-10 bg-white rounded-lg shadow-lg"
            )}
          >
            <div className="p-3 w-max">
              <ChipList
                list={roleType}
                color="purple"
                selected={roleSelected}
                setSelected={setRoleSelected}
                size="normal"
                multiple={false}
              />
            </div>
            <div
              className="inline-flex justify-end w-full px-4 pb-4 dark:hover:bg-gray-300"
              onClick={updateRole}
            >
              <button className="btn-green">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Valider
              </button>
            </div>
          </div>
        </Transition>
      </>
    </div>
  );
};
