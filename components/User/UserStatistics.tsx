import Image from "next/image";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";
import { Resource } from "@definitions/Resource";
import { useEffect, useState } from "react";
import moment from "moment";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { useTranslations } from "next-intl";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
export const UserStatistics = ({
  resources,
  // user,
  allResources,
}: {
  resources: Resource[];
  user: any;
  allResources: Resource[];
}) => {
  const t = useTranslations("UserStatistics");
  const [totalResourceViews, setTotalResourceViews] = useState(0);

  useEffect(() => {
    setTotalResourceViews(
      resources.reduce((acc, curr) => {
        return acc + curr.seenBy.length;
      }, 0)
    );
  }, [resources]);

  const Config = {
    plugins: {
      legend: {
        display: false,
      },
    },
    lineHeightAnnotation: {
      always: true,
      lineWeight: 1.5,
    },
    scale: {
      ticks: {
        precision: 0,
      },
    },
    animation: {
      duration: 1,
    },
    maintainAspectRatio: false,
    responsive: true,

    scales: {
      x: { display: true },
      y: { display: true },
    },
  };

  const getStatistics = () => {
    let data = Array(12).fill(0);
    resources.filter((resource) => {
      let index = moment(resource.createdAt).month();
      data[index]++;
    });
    return data;
  };

  const data = {
    labels: MONTHS,
    datasets: [
      {
        data: getStatistics(),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Disclosure >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-2 text-sm font-medium text-left text-gray-700 duration-300 bg-gray-200 rounded-lg lg:w-1/3 hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 active:bg-gray-50 focus-visible:ring-opacity-75 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600">
            <div className="inline-flex items-center">
              <div className="w-6 h-6 mr-3">
                <Image
                  alt="Bar chart"
                  src="/img/bar_chart.png"
                  width={24}
                  height={24}
                />
              </div>
              <h5 className="font-bold font-marianne">{t("title")}</h5>
            </div>
            <ChevronUpIcon
              className={`duration-300 ${
                open ? "transform rotate-180" : ""
              } w-5 h-5 `}
            />
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static className="mb-2 ">
              <div className="grid items-center w-full grid-cols-3 px-3 mb-3">
                <div className="items-center">
                  <h6 className="font-bold text-gray-900 font-marianne">
                    {t("created")}
                  </h6>
                  <p className="text-5xl text-gray-900 font-marianne">
                    {resources.length}
                  </p>
                </div>
                <div className="">
                  <h6 className="font-bold text-gray-900 font-marianne">
                    {t("seen")}
                  </h6>
                  {/* TODO: change resources props to not filter only user's resources */}
                  <p className="text-5xl text-gray-900 font-marianne">
                    {allResources.length}
                  </p>
                </div>
                <div className="">
                  <h6 className="font-bold text-gray-900 font-marianne">
                    {t("seen-yours")}
                  </h6>
                  <p className="text-5xl text-gray-900 font-marianne">
                    {totalResourceViews}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center w-full pt-5 mb-3">
                <div className="flex flex-col w-full px-3 mb-3">
                  <div>
                    <h6 className="font-bold text-gray-900 font-marianne">
                      {t("created-per-month")}
                    </h6>
                  </div>
                  <div>
                    <Line
                      data={data}
                      options={Config}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};
