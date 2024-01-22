import { FC, useState, useMemo } from 'react';
import styles from '@/styles/progress/lessons-list.module.scss';
import { useDataContext } from '@/context/dataContext';

const LessonsList: FC = () => {
  const [showInfo, setShowInfo] = useState(-1);
  const { userData } = useDataContext();
  const lessons = useMemo(() => userData?.data?.academic_info.lessons.reverse(), [userData]);

  return (
    <div className={styles.lessons}>
      <div className={styles.lessons_legend}>
        <div className={styles.lessons_legend_left}>
          <div>
            <div className={styles.lessons_legend_left_marker} style={{ backgroundColor: '#fffa7b' }}></div>
            <span>Опоздание</span>
          </div>
          <div>
            <div className={styles.lessons_legend_left_marker} style={{ backgroundColor: '#ffaaaa' }}></div>
            <span>Пропуск</span>
          </div>
        </div>
        <div className={styles.lessons_legend_right}>
          <div>
            <div className={styles.lessons_legend_right_marker} style={{ backgroundColor: '#1bd2c7' }}></div>
            <span>Домашние задания</span>
          </div>
          <div>
            <div className={styles.lessons_legend_right_marker} style={{ backgroundColor: '#ffc730' }}></div>
            <span>Классная работа</span>
          </div>
        </div>
      </div>

      <div className={styles.lessons_list}>
        {
          lessons?.map((item: any, index: number, arr: any) => (
            <div
              key={index}
              className={styles.lessons_list_item}
              style={{ backgroundColor: !item.isVisited ? '#ffaaaa' : item.isLate ? '#fffa7b' : '' }}
              onMouseEnter={() => setShowInfo(index)}
              onMouseLeave={() => setShowInfo(-1)}
            >
              <small>{item.date}</small>
              <div>{-(index - arr.length)}</div>
              <div className={styles.lessons_list_item_grades}>
                <span>{item.homework_grade}</span>
                <span>{item.classwork_grade}</span>
              </div>

              {
                showInfo === index &&
                <div className={styles.lessons_list_item_info}>
                  <div>{item.subject}</div>
                  <div><b>Преподаватель:</b> <br /> {item.teacher}</div>
                  <div><b>Время:</b> <br /> {item.time}</div>
                  <div><b>Тема:</b> <br /> {item.topic}</div>
                </div>
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default LessonsList;