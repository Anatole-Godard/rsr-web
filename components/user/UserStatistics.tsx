import Image from "next/image";
import {Line} from 'react-chartjs-2';
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
    SubTitle
} from 'chart.js';
import {Resource} from "@definitions/Resource";
import {useEffect, useState} from "react";
import moment from "moment";

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

export const UserStatistics = ({
                                   resources,
                                   user,
                               }: { resources: Resource[]; user: any; }) => {

    const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const [totalResourceViews, setTotalResourceViews] = useState(0);
    let count = 0;

    useEffect(() => {
        resources.forEach(resource => {
            count += resource.seenBy.length;
        });
        setTotalResourceViews(count);
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
                precision: 0
            },
        },
        animation: {
            duration: 1,
        },
        maintainAspectRatio: false,
        responsive: true,

        scales: {
            x: {display: true},
            y: {display: true},
        },
    };

    const getStatistics = () => {
        let data = Array(12).fill(0)
        resources.filter(resource => {
            let index = moment(resource.createdAt).month()
            data[index]++
        })
        return data
    }

    const data = {
        labels: MONTHS,
        datasets: [{
            data: getStatistics(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    return (
        <div
            className="flex flex-col space-y-3 bg-white rounded-lg lg:col-span-2 xl:col-span-3 w-full overflow-hidden pb-5">
            <div className="inline-flex items-center justify-between w-full px-3 pt-4 mb-3">
                <h5 className="font-bold text-gray-900 font-marianne">
                    Statistiques
                </h5>
                <div className="w-6 h-6">
                    <Image
                        alt="Bar chart"
                        src="/img/bar_chart.png"
                        width={24}
                        height={24}
                    />
                </div>
            </div>

            <div className="inline-flex flex flex-row items-center justify-around w-full px-3 mb-3">
                <div className="items-center">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Ressources créées
                    </h6>
                    <p className="text-5xl text-gray-900 font-marianne">{resources.length}</p>
                </div>
                <div className="">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Ressources consultées
                    </h6>
                    {/* TODO: change resources props to not filter only user's resources */}
                    <p className="text-5xl text-gray-900 font-marianne">2</p>
                </div>
                <div className="">
                    <h6 className="font-bold text-gray-900 font-marianne">
                        Total des vues de vos ressources
                    </h6>
                    <p className="text-5xl text-gray-900 font-marianne">{totalResourceViews}</p>
                </div>
            </div>
            <div className="inline-flex flex flex-row items-center justify-around w-full pt-5 mb-3">
                <div className="inline-flex flex flex-col w-full px-3 mb-3">
                    <div>
                        <h6 className="font-bold text-gray-900 font-marianne">
                            Ressources créées
                        </h6>
                    </div>
                    <div>
                        <Line data={data} options={Config} width={400} height={200}/>
                    </div>
                </div>
                <div className="inline-flex flex flex-col w-full px-3 mb-3">
                    <div>
                        <h6 className="font-bold text-gray-900 font-marianne">
                            Ressources consultées
                        </h6>
                    </div>
                    <div>
                        {/* TODO: change resources props to not filter only user's resources (change data value) */}
                        <Line data={data} options={Config} width={400} height={200}/>
                    </div>
                </div>
            </div>
        </div>
    )
}