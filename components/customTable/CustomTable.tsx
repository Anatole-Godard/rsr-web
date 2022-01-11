import { v4 as uuidv4 } from 'uuid';
import { PencilAltIcon, ThumbUpIcon, TrashIcon } from "@heroicons/react/outline";
import ReactPaginate from 'react-paginate';
import Style from "/components/customTable/pagination.module.css";
import Link from 'next/link';

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
                                deleteEntity: any,
                                editUrl: string,
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
                displayedValue = (<div className="flex items-center">{value[theadValue.name]}
                    <ThumbUpIcon className="text-green-800 flex-shrink-0 w-5 h-5 ml-1"/></div>)
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
                        <th/>
                        <th/>
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
                                <Link href={editUrl}>
                                    <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                                        {PencilAltIcon({ className : "text-blue-800 flex-shrink-0 w-5 h-5" })}
                                    </td>
                                </Link>
                                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800" onClick={() => deleteEntity(value.id)}>
                                    {TrashIcon({ className : "text-red-800 flex-shrink-0 w-5 h-5" })}
                                </td>
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
