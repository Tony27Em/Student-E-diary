import { useDataContext } from '@/context/dataContext';
import styles from '@/styles/homepage/leaders-table.module.scss';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { CSSProperties, FC, useEffect, useState } from 'react';
import star from '../../../public/star.png';

type LeaderType = {
  id: string,
  name: string,
  stepcoins: number,
}

const selectedButtonStyles: CSSProperties = {
  fontWeight: 700,
  textDecoration: 'underline',
}

const topLeadersStyles: CSSProperties = {
  backgroundColor: 'rgba(28, 163, 143, 0.3)',
  borderRadius: 5,
}

const LeadersTable: FC = () => {
  const { theme } = useTheme();
  const { userData, studentsData, streamData } = useDataContext();
  const userID: string = userData?.userID;
  const [toggleTable, setToggleTable] = useState<boolean>(true);

  const generateTable = (data: any): LeaderType[] => {
    return data?.map((item: any) => {
      return {
        id: item.userID,
        name: item.data.personal_info?.name,
        stepcoins: item.data.academic_info?.stepcoins.diamonds + item.data.academic_info?.stepcoins.coins
      }
    }).sort((a: LeaderType, b: LeaderType) => b.stepcoins - a.stepcoins)
  }

  const groupLeaders: LeaderType[] = generateTable(studentsData);
  const streamLeaders: LeaderType[] = generateTable(streamData)?.slice(0, 10);

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.header}>
        <h2>Таблица лидеров</h2>
        <div className={styles.header_buttons}>
          <button
            style={toggleTable ? selectedButtonStyles : {}}
            onClick={() => setToggleTable(true)}
          >
            Группа
          </button>
          <button
            style={!toggleTable ? selectedButtonStyles : {}}
            onClick={() => setToggleTable(false)}
          >
            Поток
          </button>
        </div>
      </div>
      <div className={styles.leaders}>
        <ol className={styles.leaders_list}>
          {
            toggleTable ?
              <Table table={groupLeaders} userID={userID} /> :
              <Table table={streamLeaders} userID={userID} />
          }
        </ol>
      </div>
    </div>
  )
}

const Table: FC<{ table: LeaderType[], userID: string }> = ({ table, userID }) => {
  return (
    <>
      {
        table?.map((item: LeaderType, index: number) => {
          return (
            <li
              key={item.id}
              className={styles.leaders_list_item}
              style={ index < 3 ? { ...topLeadersStyles, fontWeight: item.id === userID ? 700 : '' } : {} }
            >
              <p>{item.name}</p>
              <p className={styles.leaders_list_item_coins}>
                <span>{item.stepcoins}</span>
                <Image src={star} alt='star' width={24} height={24} />
              </p>
            </li>
          )
        })
      }
    </>
  )
}

export default LeadersTable;
