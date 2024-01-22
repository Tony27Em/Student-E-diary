// React
import { FC, useState, MouseEvent, useEffect } from "react";
// Styles
import styles from '../../styles/homeworks.module.scss';
// React Icons
import { HiDownload } from "react-icons/hi";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineInfo } from "react-icons/md";
import { useTheme } from "next-themes";

type HomeworkType = {
  [key: string]: string,
}

interface IHomeworksList {
  homeworks: HomeworkType[],
  downloadTask: (item: string) => void,
  handleOpenModal: () => void,
}

interface IPopupLoader {
  item: HomeworkType;
  index: number;
  select: (type: string, i: number) => void;
}

const HomeworksList: FC<IHomeworksList> = ({ homeworks, downloadTask, handleOpenModal }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<string>('');

  const select = (selection: string, i: number) => {
    setSelected(curr => curr !== `${selection} ${i}` ? `${selection} ${i}` : '');
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={styles.hw_pack_list}>
      {
        homeworks?.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.hw_pack_list_item} ${theme ? styles[theme] : styles.light}`}
          >
            <div className={styles.hw_pack_list_item_main}>
              <h3>{item.subject}</h3>
              <h4>{item.topic}</h4>
              <div className={styles.hw_pack_list_item_main_grade}>{item.grade}</div>

              {selected === `dates ${index}` && <PopupDates {...item} />}
              {selected === `loader ${index}` &&
                <PopupLoader
                  item={item}
                  index={index}
                  select={select}
                  downloadTask={downloadTask}
                  handleOpenModal={handleOpenModal}
                />
              }
              {selected === `info ${index}` && <PopupInfo {...item} />}
            </div>

            <div className={styles.hw_pack_list_item_icons}>
              <button
                onClick={() => select('dates', index)}
                onMouseEnter={() => select('dates', index)}
                onMouseLeave={() => select('', index)}
              >
                <IoCalendarOutline size={24} />
              </button>
              <button
                onClick={() => select('loader', index)}
                onMouseEnter={() => select('loader', index)}
                onMouseLeave={() => select('', index)}
              >
                <HiDownload size={24} />
              </button>
              <button
                onClick={() => select('info', index)}
                onMouseEnter={() => select('info', index)}
                onMouseLeave={() => select('', index)}
              >
                <MdOutlineInfo size={24} />
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const PopupDates: FC = (item: HomeworkType) => {
  return (
    <div className={styles.hw_pack_list_item_main_dates}>
      <div>
        <span>Выдано:</span>
        <span>{item.task_add_date}</span>
      </div>
      <div>
        <span>Сдано:</span>
        <span>{item.homework_add_date}</span>
      </div>
      <div>
        <span>Срок:</span>
        <span>{item.deadline}</span>
      </div>
    </div>
  )
}

const PopupLoader: FC<IPopupLoader & Omit<IHomeworksList, 'homeworks'>> = ({ item, index, select, downloadTask, handleOpenModal }) => {
  return (
    <div
      className={styles.hw_pack_list_item_main_loader}
      onMouseEnter={() => select('loader', index)}
      onMouseLeave={() => select('', index)}
    >
      <button
        onClick={() => downloadTask(item.task_src)}
        style={{ backgroundColor: !item.task_src ? 'gray' : '' }}
        disabled={!item.task_src}
      >
        Скачать
      </button>
      {
        item.status !== 'checked' &&
        <button onClick={() => handleOpenModal()}>Загрузить</button>
      }
    </div>
  )
}

const PopupInfo: FC = (item: HomeworkType) => {
  return (
    <div className={styles.hw_pack_list_item_main_info}>
      <span>Комментарии к заданию:</span>
      <span>{item.task_comment}</span>
    </div>
  )
}

export default HomeworksList;
