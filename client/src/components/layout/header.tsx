'use client'
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import styles from '@/styles/layout/header.module.scss';

import logo_dark from '../../../public/logo-dark.png';
import logo_light from '../../../public/logo-white.png';

import star from '../../../public/star.png';
import diamond from '../../../public/diamond.png';
import coin from '../../../public/coin.png';
import badge from '../../../public/badge.png';

import { RxHamburgerMenu } from 'react-icons/rx';
import { RiUser3Line } from "react-icons/ri";
import { useDataContext } from '@/context/dataContext';

type SidebarProps = {
  openSidebars: {
    toggleLeftSidebar: (state: boolean) => void
    toggleRightSidebar: (state: boolean) => void
  }
}

const Header: FC<SidebarProps> = ({ openSidebars: { toggleLeftSidebar, toggleRightSidebar } }) => {
  const { theme } = useTheme();
  const { userData } = useDataContext();
  const stepcoins = userData?.data?.academic_info?.stepcoins;

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <header className={`${styles.container} ${theme ? styles[theme] : styles.light}`}>
      <div className={styles.left_part}>
        <button
          className={styles.left_part_burger}
          onClick={() => toggleLeftSidebar(true)}
        >
          <RxHamburgerMenu size={24} color='lightgray' />
        </button>
        <Link href={'/'} className={styles.left_part_logo}>
          <Image src={theme === 'light' ? logo_dark : logo_light} alt='YourStat' width={175} height={50} priority />
        </Link>
      </div>

      <div className={styles.right_part}>
        <div className={styles.right_part_coins}>
          <div className={styles.right_part_coins_all}>
            <div>
              {stepcoins ? stepcoins.diamonds + stepcoins.coins : '-'}
            </div>
            <Image src={star} alt='star' width={24} height={24} />
          </div>

          <div
            className={styles.right_part_coins_each}
            style={{ backgroundColor: theme === 'light' ? '#f5f6fa' : '#1a2036' }}
          >
            <div>
              <div>{stepcoins?.diamonds}</div>
              <Image src={diamond} alt='' width={24} height={24} />
            </div>
            <div>
              <div>{stepcoins?.coins}</div>
              <Image src={coin} alt='' width={24} height={24} />
            </div>
            <div>
              <div>{stepcoins?.badges}</div>
              <Image src={badge} alt='' width={24} height={24} />
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleRightSidebar(true)}
          className={styles.right_part_profile}
        >
          <RiUser3Line size={30} color='lightgray' />
        </button>
      </div>
    </header>
  )
}

export default Header;