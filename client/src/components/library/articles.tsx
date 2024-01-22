import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LibraryType } from '@/types/LibraryType';
import styles from '../../styles/library.module.scss';

const Articles: FC<LibraryType> = ({ articles }) => {
  const { theme } = useTheme();

  const openArticle = (src: string) => {
    if (typeof window !== 'undefined') {
      window.open(src, '_blank');
    }
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={styles.articles}>
      {
        articles.map(({ title, src, date }, index) => (
          <div
            key={index}
            className={`${styles.articles_item} ${theme ? styles[theme] : styles.light}`}
          >
            <h3 className={styles.articles_item_title}>{title}</h3>
            <button
              className={styles.articles_item_button}
              onClick={() => openArticle(src)}
            >
              Открыть
            </button>
            <p className={styles.articles_item_date}>Добавлено: {date}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Articles;