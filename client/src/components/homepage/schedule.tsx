import { FC, useState, useMemo, useEffect } from "react";
import { useTheme } from 'next-themes';
import { useDataContext } from '@/context/dataContext';
import styles from '@/styles/homepage/schedule.module.scss';
import Modal from '@mui/material/Modal';
import type { LessonType } from '@/hooks/useCalendar';
import useCalendar, { WEEKDAYS_LIST } from '@/hooks/useCalendar';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import { FaReact } from "react-icons/fa6";
import { SiRedux } from "react-icons/si";
import { IoClose } from "react-icons/io5";

interface ISelectedModal {
  selectedLesson: LessonType[] | undefined;
  openModal: boolean;
  theme: string | undefined,
  handleCloseModal: () => void;
}

const Schedule: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();

  const [selectedLesson, setSelectedLesson] = useState<LessonType[]>([]);
  const { month, year, handlePrev, handleNext, calendar } = useCalendar();
  const { groupData } = useDataContext();
  const lessons: LessonType[] = groupData?.lessons_list;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleCloseModal = () => setOpenModal(false);

  const filledCalendar = useMemo(() => calendar?.map(item => {
    const events = lessons?.filter(lesson => {
      const lessonDate = lesson.date.split('.').reverse().join('-');
      if (new Date(lessonDate).setHours(0, 0, 0, 0) === item.date?.getTime()) return lesson;
    })

    if (!!events?.length) {
      return { ...item, events };
    }
    return item;
  }), [lessons, month])

  const handleSelect = (selectedLesson: LessonType[]) => {
    setSelectedLesson(selectedLesson);
    setOpenModal(true);
  }

  const modalProps = { selectedLesson, openModal, handleCloseModal, theme }

  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Расписание</h2>
      </div>

      <div className={styles.schedule}>
        <div className={styles.schedule_calendar}>
          <div className={styles.schedule_calendar_header}>
            <h3>{month}, {year}</h3>
            <div className={styles.schedule_calendar_header_buttons}>
              <button onClick={handlePrev}>
                <MdNavigateBefore size={32} color={theme === 'light' ? '#000' : '#fff'} />
              </button>
              <button onClick={handleNext}>
                <MdNavigateNext size={32} color={theme === 'light' ? '#000' : '#fff'} />
              </button>
            </div>
          </div>

          <div className={styles.schedule_calendar_days}>
            {
              WEEKDAYS_LIST.map(day => (
                <div key={day} className={styles.schedule_calendar_days_weekday}>{day}</div>
              ))
            }
            {
              filledCalendar.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.schedule_calendar_days_item} ${item.isToday ? styles.today : ''} ${item.events ? styles.event : ''}`}
                  onClick={() => item.events ? handleSelect(item.events) : ''}
                >{item.day}</div>
              ))
            }
          </div>
        </div>

        <LessonModal {...modalProps} />
      </div>
    </div>
  )
}

const LessonModal: FC<ISelectedModal> = ({ selectedLesson, openModal, handleCloseModal, theme }) => {
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={`${styles.modal} ${theme ? styles[theme] : styles.light}`}>
        <button
          className={styles.modal_close}
          onClick={() => handleCloseModal()}
        >
          <IoClose size={24} color={theme === 'light' ? '#000' : '#fff'} />
        </button>

        {
          selectedLesson?.map((item, index) => (
            <div key={index} className={styles.modal_content}>
              {
                !index && <h2 className={styles.modal_content_header}>{item.date}</h2>
              }

              <div className={styles.modal_content_info}>
                <div className={styles.modal_content_info_subject}>
                  {
                    item.subject === 'React Redux' ?
                      <SiRedux size={50} color='#7549bd' /> :
                      <FaReact size={50} color='#00d9ff' />
                  }
                  <h2>{item.subject}</h2>
                </div>
                <hr />
                <div>
                  <p><b>Преподаватель:</b> {item.teacher}</p>
                  <p><b>Время занятия:</b> {item.time}</p>
                  <p><b>Аудитория:</b> 407</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </Modal>
  )
}

export default Schedule;
