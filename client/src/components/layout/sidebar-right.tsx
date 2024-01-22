import styles from '@/styles/layout/sidebar-right.module.scss';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CSSProperties, FC, useEffect, useState } from 'react';

import { FaRegUser } from 'react-icons/fa';
import { HiOutlineGlobeAlt } from "react-icons/hi2";
import { ImExit } from "react-icons/im";
import { IoClose } from 'react-icons/io5';
import { LuMoon } from "react-icons/lu";
import { MdExpandMore } from "react-icons/md";
import { PiSunDimBold } from "react-icons/pi";

import { dictionaries } from '@/i18n/dictionaries';
import AuthService from '@/services/AuthService';

import { useDataContext } from '@/context/dataContext';
import { styled } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';

import emptyUserImage from '../../../public/user.png';

const avatarsAPI = 'http://localhost:5000/avatars/';

const routes = [
  { href: '/profile', icon: <FaRegUser />, name: 'Профиль' },
]

interface SidebarProps {
  closeSidebar: (state: boolean) => void,
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  width: '100%',
  backgroundColor: 'transparent',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: '#fff',
  },
  '&:hover .MuiButtonBase-root': {
    fontWeight: 700,
  },
  '&:hover *': {
    color: '#212940',
  },
  cursor: 'pointer',
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<MdExpandMore size={24} color='#fff' />}
    {...props}
  />
))(({ theme }) => ({
  width: '100%',
  padding: '0 15px',
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  backgroundColor: 'transparent',
}));

const activeLinkStyles: CSSProperties = {
  backgroundColor: '#fff',
  color: '#1d2939',
  fontWeight: 700,
  pointerEvents: 'none',
}

const activeLocaleStyles: CSSProperties = {
  backgroundColor: '#fff',
  color: '#212940',
  fontWeight: 700,
  pointerEvents: 'none',
}

const activeThemeStyles: CSSProperties = {
  boxShadow: 'inset 0 0 10px #fff',
  color: '#fff',
  fontWeight: 700,
  pointerEvents: 'none',
}

const SidebarRight: FC<SidebarProps> = ({ closeSidebar }) => {
  const { theme, setTheme } = useTheme();
  const { replace, pathname, locale: currentLocale } = useRouter();
  const { userData } = useDataContext();
  const id: string = userData?.userID;
  const username: string = userData?.data?.personal_info.name;
  const group: string = userData?.data?.academic_info.groups[0].name;
  const extension: string = userData?.data?.personal_info.image;
  
  const [hasAvatar, setHasAvatar] = useState<boolean>(false);
  const [T, setT] = useState<{ [key: string]: string }>(dictionaries[0].src);

  const logout = async () => {
    const response = await AuthService.logout();
    if (response.status === 200) {
      localStorage.removeItem('access_token');
      replace('/login');
    }
  }

  useEffect(() => {
    const checkAvatar = async () => {
      const response = await fetch(`${avatarsAPI}${id}${extension}`, {
        method: 'HEAD'
      })
      if (response.ok) setHasAvatar(true);
    }

    checkAvatar();
  })

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.top_avatar}>
          {
            hasAvatar ?
              <img src={`${avatarsAPI}${id}${extension}`} alt="" className={styles.top_avatar_img} /> :
              <Image src={emptyUserImage} alt="" className={styles.top_avatar_img} />
          }
        </div>
        <div className={styles.top_user}>
          <span>{username}</span>
          <span>{group}</span>
        </div>
        <button
          onClick={() => closeSidebar(false)}
          className={styles.top_close}
        >
          <IoClose size={20} />
        </button>
      </div>

      <div className={styles.list}>
        {
          routes.map(({ href, icon, name }) => (
            <div key={name} className={styles.list_item}>
              <Link
                href={href}
                style={pathname === href ? activeLinkStyles : {}}
              >
                <span className={styles.list_item_icon}>{icon}</span>

                {/* For demonstation */}
                <span className={styles.list_item_name}>{T.profile_text}</span>
              </Link>
            </div>
          ))
        }

        <Accordion>
          <AccordionSummary aria-controls="panel3-content" id="panel3-header">
            <div className={styles.list_locale}>
              <HiOutlineGlobeAlt size={24} />
              <span>{T.int_text}</span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.list_locale_items}>
              {
                dictionaries.map(({ locale, src }) => (
                  <div
                    key={locale}
                    onClick={() => setT(src)}
                  >
                    <Link
                      href={pathname}
                      locale={locale}
                      replace
                      style={currentLocale === locale ? activeLocaleStyles : {}}
                    >
                      {locale.toUpperCase()}
                    </Link>
                  </div>
                ))
              }
            </div>
          </AccordionDetails>
        </Accordion>

        <button
          className={styles.list_exit_button}
          onClick={logout}
        >
          <ImExit size={24} />
          <span>{T.exit_text}</span>
        </button>

        <div className={styles.list_themes}>
          <button
            className={styles.list_themes_button}
            onClick={() => setTheme('light')}
            style={theme === 'light' ? activeThemeStyles : {}}
          >
            <PiSunDimBold size={24} color='#fff' />
          </button>
          <button
            className={styles.list_themes_button}
            onClick={() => setTheme('dark')}
            style={theme === 'dark' ? activeThemeStyles : {}}
          >
            <LuMoon size={24} color='#fff' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SidebarRight;