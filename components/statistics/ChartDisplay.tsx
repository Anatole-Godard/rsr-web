import {Line} from "react-chartjs-2";
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

export const ChartDisplay = ({label, resources, minPeriod, maxPeriod}:{label: String, resources: Resource[], minPeriod: string, maxPeriod: string}) => {

    let min = moment(minPeriod);
    let max = moment(maxPeriod);
    const values = [];

    while (max > min || min.format('M') === max.format('M')) {
        values.push(min.format('MMMM YYYY'));
        min.add(1,'month');
    }

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

        animation: {
            duration: 1,
        },
        maintainAspectRatio: false,
        responsive: true,

        scales: {
            x: {display: true},
            y: {display: true},
        },

        scale: {
            ticks: {
                precision: 0
            },
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
        labels: values,
        datasets: [{
            data: getStatistics(),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    return (
        <div>
            <div>
                <h6 className="font-bold text-gray-900 font-marianne">
                    {label}
                </h6>
            </div>
            <div>
                <Line data={data} options={Config} width={400} height={200}/>
            </div>
        </div>
    )
}