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

export const ChartDisplay = ({label}:{label: String}) => {

    const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    const months = (config) => {
        const cfg = config || {};
        const count = cfg.count || 12;
        const values = [];

        const d = new Date();
        let currentMonth = d.getMonth();

        MONTHS.slice(currentMonth, currentMonth + count).forEach((month, index) => {
            values.push(month);
        });

        return values;
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
    };

    const data = {
        labels: months({count: 6}),
        datasets: [{
            data: [65, 59, 80, 81, 56, 55, 40],
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