import { v4 as uuidv4 } from 'uuid';
import { TrashIcon } from "@heroicons/react/outline";
import ReactPaginate from 'react-paginate';
import Style from "/components/customTable/pagination.module.css"

export const CustomTable = ({
                              theadList,
                              valuesList,
                              deleteEntity,
                              totalPages,
                              updateCurrentPage
                            }: {
                              theadList: object[],
                              valuesList: object[],
                              deleteEntity: any,
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
    let displayedValue = '';
    // TODO add other type like date, dateTime...
    switch (theadValue.type) {
      case 'isArray':
        displayedValue = value[theadValue.name].map((v: { label: string }) => v.label).join(', ');
        break;
      case 'isObject':
        displayedValue = value[theadValue.name].label;
        break;
      case 'isStatus':
        displayedValue = value[theadValue.name] ? 'Actif' : 'Inactif';
        break;
      case 'isLength':
        displayedValue = value[theadValue.name].length || '-';
        break;
      default:
        displayedValue = value[theadValue.name];
        break;
    }

    const displayedFullValue = displayedValue;
    if (displayedValue.length > 50) {
      displayedValue = `${displayedValue.substring(0, 50)}...`;
    }

    return { title : displayedFullValue, value : displayedValue };
  }

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-500 dark:bg-gray-100 text-white dark:text-black text-left">
            {displayTableHeader(theadList)}
            <th/>
          </tr>
        </thead>
        {valuesList.length > 0 &&
        <tbody className="bg-gray-300 dark:bg-gray-500">
          {valuesList.length > 0 && valuesList.map((value: any) => (
            <tr /** TODO edit entity on click  */ key={uuidv4()} className="cursor-pointer">
              {theadList && theadList.map((theadValue: any, index: number) => (
                <td key={index} className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <span title={displayValue(theadValue, value).title}>
                                    {displayValue(theadValue, value).value}
                  </span>
                </td>
              ))}
              <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800" onClick={()=>deleteEntity(value.id)}>
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
