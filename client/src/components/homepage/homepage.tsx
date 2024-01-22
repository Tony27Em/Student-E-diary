import { FC } from 'react';

import LeadersTable from './leaders-table';
import AwardsTable from './awards-table';
import Chart from './chart';
import News from './news';
import Schedule from './schedule';
import HomeworksInfo from './homeworks-info';

import styles from '@/styles/homepage/homepage.module.scss';
import { useDataContext } from '@/context/dataContext';

type GradeType = {
  date: string,
  name: string,
  type: string,
  grade: {
    main: number,
    coins: number,
    diamonds: number
  }
}

type LessonType = {
  isLate: boolean,
  isVisited: boolean,
  homework_grade: number,
  classwork_grade: number,
  exam_grade: number,
  date: string,
  time: string,
  subject: string,
  topic: string,
  teacher: string,
}

const Homepage: FC = () => {
  const { userData } = useDataContext();
  
  const grades: GradeType[] = userData?.data?.academic_info?.grades;
  const consideredGrades = grades?.filter((item: GradeType) => item.type === 'classwork' || item.type === 'homework');
  const sumGrade = consideredGrades?.reduce((acc: number, cur: GradeType) => acc + cur.grade?.main, 0);
  const averageGrade = Math.round((sumGrade * 100) / (consideredGrades?.length * 12));
 
  const lessons: LessonType[] = userData?.data?.academic_info?.lessons;
  const visitedLessons = lessons?.filter((item: LessonType) => item.isVisited);
  const averageAttendance = Math.round(visitedLessons?.length * 100 / lessons?.length);

  const chartData = {
    labels: ['Успеваемость', 'Посещаемость'],
    datasets: [
      {
        data: [averageGrade, 100 - averageGrade],
        backgroundColor: ['#1976d2', '#e5e5e5'],
        borderRadius: 5,
        borderWidth: 0,
      },
      {
        // Spacing between two charts by adding a blank chart
        data: [],
        weight: 0.3,
      },
      {
        data: [averageAttendance, 100 - averageAttendance],
        backgroundColor: ['#eb606e', '#e5e5e5'],
        borderRadius: 5,
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.left_blocks_1}>
          <HomeworksInfo />
          <Chart data={chartData} />
          <LeadersTable />
        </div>

        <div className={styles.left_blocks_2}>
          <AwardsTable />
          <Schedule />
        </div>
      </div>

      <div className={styles.right}>
        <News />
      </div>
    </div>
  )
}

export default Homepage;