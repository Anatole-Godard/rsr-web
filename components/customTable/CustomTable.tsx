import { v4 as uuidv4 } from 'uuid';

export const CustomTable = ({
                              theadList,
                              valuesList
                            }: {
                              theadList: object[],
                              valuesList: object[],
                            }
) => {
  // DISPLAY TABLE HEADERS LIST
  const displayTableHeader = (list: object[]) => {
    if (list) {
      return list.map((value: any) => (
        <th key={uuidv4()}
            style={{ width : `${value.width}%` }}
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
        console.log(displayedValue)
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
      <table>
        <thead>
          <tr className="bg-gray-500 dark:bg-gray-100 text-white dark:text-black text-left">
            {displayTableHeader(theadList)}
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
            </tr>
          ))}
        </tbody>
        }
      </table>
    </>
  );
}
