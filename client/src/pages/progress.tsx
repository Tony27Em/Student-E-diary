import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import Layout from "@/components/layout/layout";
import LessonsList from "@/components/progress/lessons-list";
import ProgressChart from "@/components/progress/progress-chart";
import styles from '@/styles/progress/progress.module.scss';

const Progress: NextPage = () => {
  const { theme } = useTheme();

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Успеваемость</h1>
        <div className={`${styles.container_chart} ${theme ? styles[theme] : styles.light}`}>
          <ProgressChart />
        </div>
        <div className={`${styles.container_list} ${theme ? styles[theme] : styles.light}`}>
          <LessonsList />
        </div>
      </div>
    </Layout>
  )
}

export default Progress;