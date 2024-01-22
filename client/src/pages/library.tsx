import React, { useState, createElement, FC, useEffect } from 'react';
import { NextPage } from "next";
import Layout from "@/components/layout/layout";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import axios from "axios";
import { API_URL } from "@/http";

import styles from '../styles/library.module.scss';

import Books from "@/components/library/books";
import Videos from "@/components/library/videos";
import Practical from "@/components/library/practicals";
import Articles from "@/components/library/articles";

import { LibraryType } from "@/types/LibraryType";
import { useTheme } from "next-themes";

type SectionType = {
  title: string,
  component: FC<LibraryType>,
}

const sections: Record<string, SectionType> = {
  'books': {
    title: 'Книги',
    component: Books,
  },
  'videos': {
    title: 'Видео',
    component: Videos,
  },
  'practical': {
    title: 'Практические задания',
    component: Practical,
  },
  'articles': {
    title: 'Статьи',
    component: Articles,
  }
}

const Library: NextPage<LibraryType> = (data) => {
  const { theme } = useTheme();
  const [section, setSection] = useState<string>('books');
  const handleChange = (value: string) => setSection(value);

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if(!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Учебные материалы</h1>

        <div className={styles.selection}>
          {
            Object.entries(sections).map(([key, value]) => (
              <React.Fragment key={key}>
                <label
                  htmlFor={'library_' + key}
                  className={`
                    ${styles.selection_label} 
                    ${section === key ? styles.selected : ''}
                    ${theme ? styles[theme] : styles.light}  
                  `}
                >
                  {value.title}
                </label>
                <input
                  type="radio"
                  id={'library_' + key}
                  name="section"
                  value={key}
                  className={styles.selection_input}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </React.Fragment>
            ))
          }
        </div>

        <div>
          {
            createElement(sections[section].component, data)
          }
        </div>
      </div>
    </Layout>
  )
}

export default Library;

export const getServerSideProps: GetServerSideProps<LibraryType> = async (context): Promise<GetServerSidePropsResult<LibraryType>> => {
  const response = await axios.get<LibraryType>(API_URL + '/getLibrary');
  const data = response.data;

  return {
    props: data,  
  }
} 