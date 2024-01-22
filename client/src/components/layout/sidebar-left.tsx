import { FC, CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import logo from '../../../public/logo-white.png';
import styles from '@/styles/layout/sidebar-left.module.scss';

import { BsBook, BsCart3, BsPatchQuestion } from "react-icons/bs";
import { FaRegAddressBook, FaRegCreditCard, FaRegPenToSquare } from 'react-icons/fa6';
import { IoClose, IoLibraryOutline } from 'react-icons/io5';
import { LiaAwardSolid } from "react-icons/lia";
import { LuBookMarked, LuLayoutDashboard } from "react-icons/lu";
import { SlChart } from "react-icons/sl";
import { useRouter } from 'next/router';

const routes = [
  { href: '/', icon: <LuLayoutDashboard />, name: 'Главная' },
  { href: '/progress', icon: <SlChart />, name: 'Успеваемость' },
  { href: '/rewards', icon: <LiaAwardSolid />, name: 'Мои награды' },
  { href: '/homeworks', icon: <BsBook />, name: 'Домашние задания' },
  { href: '/library', icon: <IoLibraryOutline />, name: 'Учебные материалы' },
  { href: '/payment', icon: <FaRegCreditCard />, name: 'Оплата' },
  { href: '/feedback', icon: <FaRegPenToSquare />, name: 'Отзывы (404!)' },
  { href: '/faq', icon: <BsPatchQuestion />, name: 'Вопросы  и ответы' },
  { href: '/contacts', icon: <FaRegAddressBook />, name: 'Контакты' },
  { href: '/guide', icon: <LuBookMarked />, name: 'Руководство (404!)' },
  { href: '/shop', icon: <BsCart3 />, name: 'Магазин' },
]

const activeLinkStyles: CSSProperties = {
  backgroundColor: '#fff',
  color: '#292b53',
  fontWeight: 700,
  pointerEvents: 'none',
}

interface ISidebarProps {
  closeSidebar: (state: boolean) => void
}

const SidebarLeft: FC<ISidebarProps> = ({ closeSidebar }) => {
  const currentYear = new Date().getFullYear();
  const { pathname } = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.top_logo}>
          <Image src={logo} alt='YourStat' width={175} height={50} />
        </div>
        <button
          onClick={() => closeSidebar(false)}
          className={styles.top_close}
        >
          <IoClose size={20} />
        </button>
      </div>

      <ol className={styles.list}>
        {
          routes.map(({ href, icon, name }) => (
            <li key={name} className={styles.list_item}>
              <Link 
                href={href} 
                style={ pathname === href ? activeLinkStyles : {} }
              >
                <span className={styles.list_item_icon}>{icon}</span>
                <span className={styles.list_item_name}>{name}</span>
              </Link>
            </li>
          ))
        }
      </ol>

      <div className={styles.footer}>
        <p>&copy; {currentYear} Anton Em</p>
      </div>
    </div>
  )
}

export default SidebarLeft;