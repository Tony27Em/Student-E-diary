import { FC, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useDataContext } from '@/context/dataContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ScriptableContext,
  Filler,
  Point,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type GradeType = {
  date: string,
  name: string,
  type: string,
  grade: {
    main: number,
    crystal: number,
    coin: number,
  }
}

type Values = {
  [key: string]: number[]
}

type ChartDataset = {
  label: string,
  data: number[],
  fill: string,
  tension: number,
  backgroundColor: (context: ScriptableContext<"line">) => CanvasGradient
}

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

const ProgressChart: FC = () => {
  const { theme } = useTheme();
  const { userData } = useDataContext();
  const [data, setData] = useState<ChartData<'line', (number | Point | null)[], unknown>>({
    labels: [],
    datasets: [],
  });
  const grades: GradeType[] = userData?.data?.academic_info.grades;

  const generateLabels = (sortedGrades: string[]): string[] => {
    return sortedGrades.map(item => months[+item - 1]);
  }

  const generateDataset = (label: string, type: string, data: Values[], color: string): ChartDataset => {
    const reducedData = data.map((item: Values) => {
      return Math.round(item[type].reduce(((acc: number, cur: number) => acc + cur), 0) / item[type].length);
    })

    return {
      label,
      data: reducedData,
      fill: 'start',
      tension: 0.3,
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.25, color + 'cc');
        gradient.addColorStop(0.5, color + '99');
        gradient.addColorStop(0.75, color + '66');
        gradient.addColorStop(1, color + '33');
        return gradient;
      },
    }
  }

  useEffect(() => {
    const sortedGrades = grades?.reduce((acc: {[key: string]: Values}, item: GradeType) => {
      const month = item.date.split('.')[1];

      if (!acc[month]) { 
        acc[month] = {};
      }

      if (!acc[month][item.type]) { 
        acc[month][item.type] = [];
      }

      acc[month][item.type].push(item.grade.main);
      return acc;
    }, {})

    if (sortedGrades) {
      const keys = Object.keys(sortedGrades).sort((a, b) => parseInt(a) - parseInt(b));
      const values = keys.map(key => sortedGrades[key]);
      const chartData = {
        labels: generateLabels(keys),
        datasets: [
          generateDataset('Домашние задания', 'homework', values, '#1bd2c7'),
          generateDataset('Классная работа', 'classwork', values, '#ffc730')
        ]
      }
      setData(chartData);
    }
  }, [grades])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 40,
          font: {
            size: 14,
          },
          filter: function(item, data) {
            if(item.text === 'Домашние задания') {
              item.fillStyle = '#1bd2c7';   
              item.strokeStyle = '#1bd2c7';   
              item.fontColor = theme === 'light' ? '#000' : '#fff';                
            }
            if(item.text === 'Классная работа') {
              item.fillStyle = '#ffc730';   
              item.strokeStyle = '#ffc730';   
              item.fontColor = theme === 'light' ? '#000' : '#fff';          
            }
            item.borderRadius = 3;
            return true;
          },
        },
        onClick(): void {}
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {      
      x: {
        ticks: {
          padding: 10,
          color: theme === 'light' ? '#000' : '#fff',
        },
        grid: {
          color: theme === 'light' ? '#e5e5e5' : '#e5e5e522',
        }
      },
      y: {
        min: 0,
        max: 12,
        ticks: {
          stepSize: 2,
          padding: 10,
          color: theme === 'light' ? '#000' : '#fff',
        },
        grid: {
          color: theme === 'light' ? '#e5e5e5' : '#e5e5e522',
        }
      },
    },
  }

  return (
    <Line data={data} options={options} />
  )
}

export default ProgressChart;
