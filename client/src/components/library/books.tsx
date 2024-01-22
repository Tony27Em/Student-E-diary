import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { LibraryType } from '@/types/LibraryType';
import styles from '../../styles/library.module.scss';

const BOOKS_STORAGE_URL = 'https://drive.google.com/file/d/';
const BOOKS_IMAGES_API = 'http://localhost:5000/libraryImages/';

const Books: FC<LibraryType> = ({ books }) => {
  const { theme } = useTheme();

  const openBook = (id: string) => {
    if (typeof window !== 'undefined') {
      window.open(BOOKS_STORAGE_URL + id, '_blank')
    }
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={styles.books}>
      {
        books.map(({ id, title, image, date }) => (
          <div
            key={id}
            className={`${styles.books_item} ${theme ? styles[theme] : styles.light}`}
            onClick={() => openBook(id)}
          >
            <img
              src={BOOKS_IMAGES_API + image}
              alt="No image"
              className={styles.books_item_image}
            />
            <h3 className={styles.books_item_title}>{title}</h3>
            <span className={styles.books_item_date}>Добавлено: {date}</span>
          </div>
        ))
      }
    </div>
  )
}

export default Books;