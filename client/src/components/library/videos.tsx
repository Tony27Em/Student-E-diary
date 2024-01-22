import { FC, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { LibraryType } from '@/types/LibraryType';
import styles from '../../styles/library.module.scss';

const Videos: FC<LibraryType> = ({ videos }) => {
  const { theme } = useTheme();

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <div className={styles.video}>
      {
        videos.map(({ src, title, date }, index) => (
          <div
            key={index}
            className={`${styles.video_item} ${theme ? styles[theme] : styles.light}`}
          >
            <iframe
              src={src}
              title={title}
              className={styles.video_item_frame}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <h3 className={styles.video_item_title}>{title}</h3>
            <p className={styles.video_item_date}>Добавлено: {date}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Videos;