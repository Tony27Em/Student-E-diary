import { FC, useMemo, CSSProperties } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useDataContext } from '@/context/dataContext';
import styles from '@/styles/homepage/awards-table.module.scss';
import diamond from '../../../public/diamond.png';
import coin from '../../../public/coin.png';

type GradeType = {
  name: string,
  type: string,
  date: string,
  grade: {
    main: number | string,
    coins: number | string,
    diamonds: number | string,
  }
}

const gradeDescription: { [key: string]: string } = {
  'encouragement': 'Поощрение от преподавателя за работу в классе',
  'punctuality': 'Своевременное выполнение домашнего задания',
  'homework': 'Оценка за домашнюю работу',
  'classwork': 'Оценка в классе',
  'exam': 'Оценка за экзамен',
  'rate': 'Оценка занятия',
}

const gradeStyles_1: CSSProperties = {
  backgroundColor: 'rgba(28, 163, 143, 0.5)',
  boxShadow: '0 0 5px 1px rgba(28, 163, 143, 0.5)',
}

const gradeStyles_2: CSSProperties = {
  backgroundColor: 'rgba(248, 141, 91, 0.5)',
  boxShadow: '0 0 5px 1px rgba(248, 141, 91, 0.5)',
}

const gradeStyles_3: CSSProperties = {
  backgroundColor: 'rgba(235, 96, 110, 0.5)',
  boxShadow: '0 0 5px 1px rgba(235, 96, 110, 0.5)',
}

const AwardsDescription: FC = () => {
  const { theme } = useTheme(); 
  const { userData } = useDataContext();
  const memoedGrades: GradeType[] = useMemo(() => userData?.data?.academic_info.grades.reverse(), [userData]);

  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Ваши награды</h2>
      </div>
      <div className={styles.awards}>
        <ol className={styles.awards_list}>
          {
            memoedGrades?.map((item, index, arr) => {
              return (
                <div key={index} className={styles.awards_list_item}>
                  {
                    (index === 0 || arr[index].date !== arr[index - 1].date) &&
                    <p className={styles.awards_list_item_date}>{item.date}</p>
                  }
                  <div>
                    <small>{gradeDescription[item.type]}</small>
                    <p>{item.name}</p>
                  </div>
                  <div className={styles.awards_list_item_points}>
                    {
                      !!item.grade.main &&
                      <div 
                        className={styles.awards_list_item_points_main}
                        style={+item.grade.main > 9 ? gradeStyles_1 : +item.grade.main > 7 ? gradeStyles_2 : gradeStyles_3}
                      >
                        {item.grade.main}
                      </div>
                    }
                    {
                      !!item.grade.coins &&
                      <div className={styles.awards_list_item_points_amount}>
                        <span>+{item.grade.coins}</span>
                        <Image src={coin} alt='' width={20} height={20} />
                      </div>
                    }
                    {
                      !!item.grade.diamonds &&
                      <div className={styles.awards_list_item_points_amount}>
                        <span>+{item.grade.diamonds}</span>
                        <Image src={diamond} alt='' width={20} height={20} />
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </ol>
      </div>
    </div>
  )
}

export default AwardsDescription;