import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import $api, { API_URL } from '@/http';
import { LibraryType } from '@/types/LibraryType';
import styles from '../../styles/library.module.scss';

const Practical: FC<LibraryType> = ({ practicals }) => {
  const { theme } = useTheme();

  const downloadPractical = async (filename: string) => {
    const response = await $api.get(API_URL + '/downloadPractical/' + filename);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data]));
    link.download = filename;
    link.click();
  }
  
  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={styles.practicals}>
      {
        practicals.map(({ title, filename, date }, index) => (
          <div
            key={index}
            className={`${styles.practicals_item} ${theme ? styles[theme] : styles.light}`}
          >
            <h3 className={styles.practicals_item_title}>{title}</h3>
            <button
              className={styles.practicals_item_button}
              onClick={() => downloadPractical(filename)}
            >
              Скачать
            </button>
            <p className={styles.practicals_item_date}>Добавлено: {date}</p>
          </div>
        ))
      }
    </div>

  )
}

export default Practical;