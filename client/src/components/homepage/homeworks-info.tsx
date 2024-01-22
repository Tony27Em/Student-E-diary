import { FC, useEffect, useState } from 'react';
import styles from '@/styles/homepage/homeworks-info.module.scss';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useDataContext } from '@/context/dataContext';

import { GoTasklist } from "react-icons/go";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { MdOutlineTaskAlt } from "react-icons/md";
import { MdRadioButtonUnchecked } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";

type HomeworkInfoItemType = {
  icon: typeof GoTasklist,
  amount: string,
  text: string,
}

const HomeworksInfo: FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { userData } = useDataContext();
  const homeworkInfo = userData?.data?.academic_info.homeworks;

  const homeworksCount = homeworkInfo?.reduce((acc: { [key: string]: number }, item: { [key: string]: number }) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc;
  }, {} as { [key: string]: number });

  const total = homeworkInfo?.length;
  const { current = 0, overdue = 0, checked = 0, inspect = 0 } = homeworksCount || {};

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Задания</h2>
        <button
          className={styles.header_button}
          onClick={() => router.push('/homeworks')}
        >
          <span>Подробнее</span>
          <MdKeyboardArrowRight size={24}/>
        </button>
      </div>

      <div className={styles.info}>
        <div className={styles.info_all}>
          <HomeworkInfoItem icon={GoTasklist} amount={total} text='Все задания' />
        </div>
        <div className={styles.info_current}>
          <HomeworkInfoItem icon={MdFormatListBulletedAdd} amount={current} text='Текущие' />
        </div>
        <div className={styles.info_passed}>
          <HomeworkInfoItem icon={MdOutlineTaskAlt} amount={checked} text='Проверено' />
        </div>
        <div className={styles.info_inspect}>
          <HomeworkInfoItem icon={MdRadioButtonUnchecked} amount={inspect} text='На проверке' />
        </div>
        <div className={styles.info_overdue}>
          <HomeworkInfoItem icon={MdOutlineCancel} amount={overdue} text='Просрочено' />
        </div>
      </div>
    </div>
  )
}

export default HomeworksInfo;

const HomeworkInfoItem: FC<HomeworkInfoItemType> = ({ icon: Icon, amount, text }) => {
  return (
    <>
      <div>
        <Icon size={30} />
      </div>
      <div>
        <h2>{amount}</h2>
        <span>{text}</span>
      </div>
    </>
  )
}