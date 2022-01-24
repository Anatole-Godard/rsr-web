import { v4 as uuidv4 } from 'uuid';
import {
    BanIcon,
    CheckCircleIcon,
    CheckIcon,
    ChevronDownIcon,
    PencilAltIcon,
    ThumbUpIcon,
    TrashIcon
} from "@heroicons/react/outline";
import ReactPaginate from 'react-paginate';
import Style from "/components/customTable/pagination.module.css";
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ChipList } from '@components/ui/ChipList';
import { classes } from '@utils/classes';
import { fetchRSR } from '@utils/fetchRSR';
import { useAuth } from '@hooks/useAuth';

const roleType = [
    { label : 'Utilisateur', value : 'user' },
    { label : 'Modérateur', value : 'moderator' },
    { label : 'Administrateur', value : 'admin' },
    { label : 'Super-administrateur', value : 'superadmin' }
]

export const CustomTable = ({
                                theadList,
                                valuesList,
                                deleteEntity,
                                editUrl,
                                totalPages,
                                updateCurrentPage
                            }: {
                                theadList: object[],
                                valuesList: any[],
                                deleteEntity?: any,
                                editUrl?: string,
                                totalPages: number,
                                updateCurrentPage: any
                            }
) => {
    // DISPLAY TABLE HEADERS LIST
    const displayTableHeader = (list: object[]) => {
        if (list) {
            return list.map((value: any) => (
                <th key={uuidv4()}
                    style={{ width : `${value.width - (10 / list.length)}%` }}
                    className="px-4 py-3"
                >
                    {value.label}
                </th>
            ));
        }
        return <></>;
    };

    const displayValue = (theadValue: any, value: any) => {
        let displayedValue: any        = ''
        let displayedFullValue: string = '';
        let isJsx: boolean             = false;
        // TODO add other type like date, dateTime...
        switch (theadValue.type) {
            case 'isArray':
                displayedValue = value[theadValue.name].map((v: { label: string }) => v.label).join(', ');
                break;
            case 'isObject':
                const object   = value[theadValue.name]
                displayedValue = object[theadValue.subName];
                break;
            case 'isStatus':
                displayedValue = value[theadValue.name] ? 'Actif' : 'Inactif';
                break;
            case 'isLength':
                displayedValue = value[theadValue.name].length || '-';
                break;
            case 'isLikeNumber':
                isJsx          = true
                displayedValue = (
                    <div className="flex items-center">
                        {value[theadValue.name]}
                        <ThumbUpIcon className="text-green-800 flex-shrink-0 w-5 h-5 ml-1"/>
                    </div>)
                break;
            case 'isRolePopUp':
                isJsx          = true
                displayedValue = <UserRolePopUp role={roleType.find((el) => {
                    return value[theadValue.name] === el.value
                })} id={value.uid} getEntity={theadValue.getEntity}/>
                break;
            case 'validated':
                isJsx          = true
                displayedValue =
                    <div className="flex items-center" onClick={() => {
                        theadValue.validEntity(value.uid, !value[theadValue.name])
                    }}>
                        {value[theadValue.name]
                            ? <>Suspendre <BanIcon className="text-red-800 flex-shrink-0 w-5 h-5 ml-1"/></>
                            : <>Réactiver <CheckIcon className="text-green-800 flex-shrink-0 w-5 h-5 ml-1"/></>
                        }
                    </div>
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

        return { title : displayedFullValue, value : displayedValue };
    }

    return (
        <>
            <table className="w-full" key={uuidv4()}>
                <thead>
                    <tr className="bg-gray-500 dark:bg-gray-100 text-white dark:text-black text-left">
                        {displayTableHeader(theadList)}
                        {editUrl && <th/>}
                        {deleteEntity && (<th/>)}
                    </tr>
                </thead>
                {valuesList && valuesList.length > 0 &&
                    <tbody className="bg-gray-300 dark:bg-gray-500">
                        {valuesList && valuesList.length > 0 && valuesList.map((value: any) => (
                            <tr /** TODO edit entity on click  */ key={uuidv4()} className="cursor-pointer">
                                {theadList && theadList.map((theadValue: any, index: number) => (
                                    <td key={index} className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                        <span
                                            title={displayValue(theadValue, value).title}>
                                            {displayValue(theadValue, value).value}
                                        </span>
                                    </td>
                                ))}
                                {editUrl && (
                                    <Link href={editUrl+"/"+ value.slug +"/edit"}>
                                        <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                            {PencilAltIcon({ className : "text-blue-800 flex-shrink-0 w-5 h-5" })}
                                        </td>
                                    </Link>
                                )}
                                {deleteEntity && (
                                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800" onClick={() => deleteEntity(value.id)}>
                                        {TrashIcon({ className : "text-red-800 flex-shrink-0 w-5 h-5" })}
                                    </td>)}
                            </tr>
                        ))}
                    </tbody>
                }
            </table>
            {totalPages !== null && (
                <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                    breakClassName="break-me"
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={updateCurrentPage}
                    containerClassName={Style.pagination}
                    activeClassName={Style.active}
                />
            )}
        </>
    );
}

const UserRolePopUp = ({ role, id, getEntity }) => {
    const { user }                               = useAuth();
    const ref: any                               = useRef();
    const [roleSelected, setRoleSelected]: any[] = useState([role]);
    const [open, setOpen]: any[]                 = useState(false);

    const updateRole = () => {
        //TODO: verify the current user role (only admin | super-admin)
        if (roleSelected && roleSelected.length === 1) {
            const body = JSON.stringify({ action : 'change-role', role : roleSelected[0].value })
            fetchRSR(`/api/user/admin/${id}/edit`, user.session, {
                    method : "PUT",
                    body
                }
            ).then((res) => res.json()).then(() => {
                getEntity()
            })
        }
    }

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <>
                <button onClick={() => {
                    setOpen(!open)
                }}>
                    <div className="flex items-center">{role.label}
                        <ChevronDownIcon className="text-black flex-shrink-0 w-5 h-5 ml-1"/>
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
                    <div className={classes("absolute -left-20 z-10 bg-white rounded-lg shadow-lg")}>
                        <div className="w-max p-3">
                            <ChipList
                                list={roleType}
                                color='purple'
                                selected={roleSelected}
                                setSelected={setRoleSelected}
                                size='normal'
                                multiple={false}
                            />
                        </div>
                        <div className="p-4 bg-gray-50 p-3 rounded-lg w-full  hover:bg-gray-100 dark:hover:bg-gray-300" onClick={updateRole}>
                            <button className="flex content-between items-center">
                                Valider
                                {CheckCircleIcon({ className : "text-green-500 flex-shrink-0 w-5 h-5 ml-1" })}
                            </button>
                        </div>
                    </div>
                </Transition>
            </>
        </div>
    )
}
