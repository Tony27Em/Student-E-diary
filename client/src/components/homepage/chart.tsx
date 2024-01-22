import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartData, ChartOptions, Chart as ChartType } from 'chart.js';
import styles from '@/styles/homepage/chart.module.scss';
import { MdKeyboardArrowRight } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

type ChartProps = {
  data: ChartData<'doughnut'>;
}

const Chart: FC<ChartProps> = ({ data }) => {
  const { push } = useRouter();
  const { theme } = useTheme();

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 25,
          font: {
            size: 14,
          },
          filter: function (item, data) {
            if (item.text === 'Успеваемость') {
              item.fillStyle = 'rgb(25, 118, 210)';
              item.strokeStyle = 'rgb(25, 118, 210)';
              item.text = data.datasets[0].data[0] + '% Успеваемость';
              item.fontColor = theme === 'light' ? '#000' : '#fff';
            }
            if (item.text === 'Посещаемость') {
              item.fillStyle = 'rgb(235, 96, 110)';
              item.strokeStyle = 'rgb(235, 96, 110)';
              item.text = data.datasets[2].data[0] + '% Посещаемость';
              item.fontColor = theme === 'light' ? '#000' : '#fff';
            }
            item.borderRadius = 3;
            return true;
          },
        },
        onClick(): void { },
      },
      tooltip: {
        enabled: false,
      },
    },
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;
  
  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Статистика</h2>
        <button
          className={styles.header_button}
          onClick={() => push('/progress')}
        >
          <span>Подробнее</span>
          <MdKeyboardArrowRight size={24} />
        </button>
      </div>
      <div className={styles.chart}>
        <Doughnut
          data={data}
          options={chartOptions}
        />
      </div>

    </div>
  )
}

export default Chart;