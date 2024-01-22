import { NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";

import Layout from "@/components/layout/layout";
import HomeworksList from "@/components/homeworks/homeworksList";
import ModalUpload from "@/components/homeworks/modalUpload";

import styles from '../styles/homeworks.module.scss';

import { useDataContext } from "@/context/dataContext";
import $api, { API_URL } from "@/http";
import { useTheme } from "next-themes";

type HomeworkType = {
  [key: string]: string,
} & {
  grade: number
}

const Homeworks: NextPage = () => {
  const { userData } = useDataContext();
  const homeworks: HomeworkType[] = userData?.data?.academic_info.homeworks;
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<number>(0);
  const { theme } = useTheme();

  const groupedHomeworks = homeworks?.reduce((acc: {[key: string]: HomeworkType[]}, item: HomeworkType) => {
    if (!acc[item.status]) {
      acc[item.status] = [];
    }
    acc[item.status].push(item);
    return acc;
  }, {})

  const {current = [], checked = [], overdue = []} = groupedHomeworks || [];

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setFile(null);
    setStatus(0);
  }

  const downloadTask = async (filename: string) => {
    const response = await $api.get(API_URL + '/downloadTask/' + filename);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(new Blob([response.data]));
    link.download = filename;
    link.click();
  }

  const uploadFile = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await $api.post(API_URL + '/uploadHomework', formData);
      if (response.status === 200) {
        setFile(null);
        setStatus(200);
      }
    } catch (error) {
      console.error('Error uploading HW', error);
    }
  }

  const addFile = (file: File) => file && setFile(file);

  const commonHWProps = { downloadTask, handleOpenModal };
  const modalProps = { openModal, handleCloseModal, uploadFile, addFile, status };

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if(!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Домашние задания</h1>

        <div className={styles.hw}>
          <div className={styles.hw_pack}>
            <h3 className={`${styles.hw_pack_header} ${theme ? styles[theme] : styles.light}`}>Текущие: {current?.length}</h3>
            <HomeworksList homeworks={current} {...commonHWProps} />
          </div>

          <div className={styles.hw_pack}>
            <h3 className={`${styles.hw_pack_header} ${theme ? styles[theme] : styles.light}`}>Проверено: {checked?.length}</h3>
            <HomeworksList homeworks={checked} {...commonHWProps} />
          </div>

          <div className={styles.hw_pack}>
            <h3 className={`${styles.hw_pack_header} ${theme ? styles[theme] : styles.light}`}>Просрочено: {overdue?.length}</h3>
            <HomeworksList homeworks={overdue} {...commonHWProps} />
          </div>
        </div>

        <ModalUpload {...modalProps} />
      </div>
    </Layout>
  )
}

export default Homeworks;