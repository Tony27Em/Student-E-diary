import { NextPage } from "next";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useState, MouseEvent, ReactElement, useEffect } from 'react';

import Layout from "@/components/layout/layout";
import TeacherForm from "@/components/contacts/teacherForm";
import AcademicDepartmentForm from "@/components/contacts/academicForm";
import CeoForm from "@/components/contacts/ceoForm";

import styles from '@/styles/contacts.module.scss';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/system';

import { SlSocialVkontakte } from "react-icons/sl";
import { FiInstagram } from "react-icons/fi";
import { CiFacebook } from "react-icons/ci";

import { GradientIcon } from "@/ui/gradient-icon";
import { useTheme } from "next-themes";

const DynamicMap = dynamic(() => import('@/components/contacts/map'), { ssr: false });
type FormType = 'teacher' | 'academic_department' | 'ceo';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3px',
});

const StyledToggleButton = styled(ToggleButton)({
  color: '#1976d2',
  backgroundColor: '#f5f5f5',
  border: 'none',
  flex: 1,
  whiteSpace: 'nowrap',
  '&.Mui-selected': {
    color: '#1976d2',
    borderBottom: '3px solid #1976d2',
    fontWeight: '600',
    backgroundColor: '#f5f5f5',
  },
});

const Contacts: NextPage = () => {
  const { theme } = useTheme();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<FormType>('teacher');

  const handleChange = (e: MouseEvent<HTMLElement>, formType: FormType) => {
    if(formType) setSelectedForm(formType);
  };

  const toggleCheckbox = () => {
    setIsChecked(current => !current);
  }

  const forms: Record<FormType, ReactElement> = {
    'teacher': <TeacherForm />,
    'academic_department': <AcademicDepartmentForm toggleCheckbox={toggleCheckbox} isChecked={isChecked} />,
    'ceo': <CeoForm />,
  }

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={`${styles.info} ${theme ? styles[theme] : styles.light}`}>
          <h2>Контакты</h2>

          <div className={styles.info_address}><b>Адрес:</b><br /> г.Караганда, ул.Бухар-Жырау 75/3</div>

          <div className={styles.info_phone}>
            <div><b>Приемная:</b><br /> +7 705 123 45 67</div>
            <div><b>Бухгалтерия:</b><br /> +7 705 123 45 78</div>
            <div><b>Учебная часть:</b><br /> +7 705 123 45 89</div>
          </div>

          <div className={styles.info_manager}>
            <h3><b>Менеджеры учебного процесса:</b></h3>
            <div><b>Главный менеджер:</b><br /> boss_manager@itacademy.com</div>
            <div><b>Менеджер:</b><br /> another_manager@itacademy.com</div>
          </div>

          <div className={styles.info_social}>
            <h3 className={styles.info_social_header}>Мы в соцсетях:</h3>
            <Link href='https://www.facebook.com' target="_blank">
              <CiFacebook size={44} color='#177af2' />
            </Link>
            <Link href='https://www.instagram.com' target="_blank">
              <FiInstagram size={42} style={{ stroke: "url(#instagram-gradient-contacts)" }} />
            </Link>
            <Link href='https://www.vk.com' target="_blank">
              <SlSocialVkontakte size={50} color='#0077ff' />
            </Link>
          </div>
        </div>

        <div className={`${styles.form_wrapper} ${theme ? styles[theme] : styles.light}`}>
          <h2>Обращение к администрации</h2>

          <StyledToggleButtonGroup
            color="primary"
            value={selectedForm}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <StyledToggleButton value="teacher">Преподаватель</StyledToggleButton>
            <StyledToggleButton value="academic_department">Учебная часть</StyledToggleButton>
            <StyledToggleButton value="ceo">Генеральный директор</StyledToggleButton>
          </StyledToggleButtonGroup>

          {forms[selectedForm]}
        </div>

        <div className={`${styles.map} ${theme ? styles[theme] : styles.light}`}>
          <h2>Местоположение</h2>
          <div className={styles.map_wrapper}>
            <DynamicMap />
          </div>
        </div>
      </div>

      <GradientIcon addition='contacts' />
    </Layout>
  )
}

export default Contacts;



