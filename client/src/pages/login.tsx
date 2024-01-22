'use client';
import { NextPage } from "next";
import { useState } from "react";

import styles from '@/styles/login.module.scss';
import AuthService from "@/services/AuthService";
import { useRouter } from "next/router";
import { AxiosError } from 'axios';

import { RiUser6Fill } from "react-icons/ri";
import { IoLockClosed } from "react-icons/io5";
import loginImage from '../../public/login-image.png';

import Image from "next/image";

const Login: NextPage = () => {
  const { replace } = useRouter();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [warning, setWarning] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const hideWarningMessage = () => setWarning(false);

  const login = async () => {
    try {
      const response = await AuthService.login(username, password);
      
      if (response.status === 200) {
        localStorage.setItem('access_token', JSON.stringify(response.data.tokens.accessToken));
        replace('/'); 
        setDisabled(true);
        console.log('Logged In');
      }

    } catch (e) {
      const error = e as AxiosError;
      console.error(error);
      setWarning(true);
    }
  }

  return (
    <div className={styles.container} id="login_page">
      <div className={styles.form}>
        <div className={styles.form_image}>
          <Image src={loginImage} alt='This should be image' width={316} height={289} />
        </div>

        <div className={styles.form_elements}>
          <h1 className={styles.form_elements_header}>YourStat</h1>

          <div className={styles.form_elements_input}>
            <label htmlFor="username">
              <RiUser6Fill size={20} />
            </label>
            <input
              id="username"
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => {
                hideWarningMessage();
                setUsername(e.target.value);
                setWarning(false);
              }}
            />
          </div>

          <div className={styles.form_elements_input}>
            <label htmlFor="password">
              <IoLockClosed size={20} />
            </label>
            <input
              id="password"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                hideWarningMessage();
                setPassword(e.target.value);
                setWarning(false);
              }}
            />
          </div>

          {
            warning && <small style={{ color: 'red' }}>Неверные логин или пароль</small>
          }

          <button
            className={styles.form_elements_button}
            onClick={login}
            disabled={disabled}
          >
            ВОЙТИ
          </button>
        </div>
      </div>

    </div>
  )
}

export default Login;
