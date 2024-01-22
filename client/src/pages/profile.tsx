'use client';
import { useState, useEffect, ChangeEvent } from "react";
import { NextPage } from "next";
import { useTheme } from "next-themes";
import Image from 'next/image';

import Layout from "@/components/layout/layout";
import AboutInput from "@/components/profile/about-input";
import SocialInput from "@/components/profile/social-input";
import PasswordInput from "@/components/profile/password-input";

import styles from '../styles/profile.module.scss';

import { CiGlobe } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { FiFacebook } from "react-icons/fi";
import { TfiTwitter } from "react-icons/tfi";
import { FiInstagram } from "react-icons/fi";
import { SlSocialVkontakte } from "react-icons/sl";

import { GradientIcon } from "@/ui/gradient-icon";
import { FieldType } from "@/types/ProfileTypes";
import { useDataContext } from "@/context/dataContext";
import $api, { API_URL } from "@/http";
import emptyUserImage from '../../public/user.png';

const avatarsAPI = 'http://localhost:5000/avatars/';

// const URL_REGEX = /^(https?:\/\/|):\/\/[^\s/$.?#].[^\s]*$/i;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?!.*\s).{8,20}$/;

const Profile: NextPage = () => {
  const { theme } = useTheme();
  const { userData } = useDataContext();
  const { social_media, ...userAbout } = userData?.data?.personal_info || {};
  const userID: string = userData?.userID;
  const extension: string = userData?.data?.personal_info.image;

  const [about, setAbout] = useState<FieldType>({ ...userAbout });
  const [social, setSocial] = useState<FieldType>(social_media || {});
  const [password, setPassword] = useState<FieldType>({ 'current': '', 'new': '', 'repeat': '' });

  const [isFieldVisible, setIsFieldVisible] = useState<{ [key: string]: boolean }>({ 'current': false, 'new': false, 'repeat': false });
  const [editable, setEditable] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>('');
  const [hasAvatar, setHasAvatar] = useState<boolean>(false);

  const allowEdit = () => {
    sessionStorage.setItem('personal', JSON.stringify({ about, social }));
    setEditable(true);
  }

  const editField = (fieldType: string, fieldname: string, value: string) => {
    switch (fieldType) {
      case 'about': setAbout(cur => ({ ...cur, [fieldname]: value })); break;
      case 'social_media': setSocial(cur => ({ ...cur, [fieldname]: value })); break;
      case 'password': setPassword(cur => ({ ...cur, [fieldname]: value })); break;
    }
  }

  const showPassword = (fieldname: string, isFieldVisible: boolean) => {
    setIsFieldVisible(current => ({
      ...current,
      [fieldname]: !isFieldVisible
    }));
  }

  const saveEdit = async () => {
    if (editable) {
      try {
        const response = await $api.post(API_URL + '/changePersonalData', { about, social });

        if (response.status === 200) {
          setEditable(false);
          sessionStorage.removeItem('personal');
          console.log('Данные успешно изменены');
        }
      } catch (err) {
        console.log(err);
      }
    }
    setEditable(false);
  }

  const cancelEdit = () => {
    const storage = sessionStorage.getItem('personal');

    if (storage) {
      const data = JSON.parse(storage);
      setAbout(data.about);
      setSocial(data.social);
    }

    setEditable(false);
    sessionStorage.removeItem('personal');
  }

  const changePassword = async () => {
    const isNewPasswordCorrect = PASSWORD_REGEX.test(password.new) && PASSWORD_REGEX.test(password.repeat);
    const isNewPasswordSame = password.new === password.repeat;

    if (!(!!password.current && !!password.new && !!password.repeat)) return setWarning('Не все поля заполнены');
    if (!isNewPasswordCorrect) return setWarning('8-20, цифра, символ, большая и маленькая буквы');
    if (!isNewPasswordSame) return setWarning('Пароли не совпадают');

    try {
      const response = await $api.post(API_URL + '/changePassword', {
        oldPassword: password.current,
        newPassword: password.new,
      })

      if (response.status === 200) {
        localStorage.setItem('access_token', JSON.stringify(response.data.tokens.accessToken));
        setWarning('Пароль успешно изменен!');
        setPassword({
          'current': '',
          'new': '',
          'repeat': '',
        })
      }
    } catch (error) {
      setWarning('Неправильный пароль');
    }
  }

  const setImage = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];

    const postAvatar = async (image: File, dataURL: string) => {
      try {
        const formData = new FormData();
        formData.append('avatar', image);
        const response = await $api.post(API_URL + '/changeAvatar', formData);

        if (response.status === 200) {
          setHasAvatar(true);
          console.log('Изображение загружено успешно!');
        }
      } catch (err) {
        console.log('Не удалось загрузить изображение - ', err);
      }
    }

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        postAvatar(image, result);
      }
      reader.readAsDataURL(image);
    }
  }

  useEffect(() => {
    if (!social_media && !about) return;
    setSocial(social_media);
    setAbout(userAbout);
  }, [social_media])

  useEffect(() => {
    const checkAvatar = async () => {
      const response = await fetch(`${avatarsAPI}${userID}${extension}`, {
        method: 'HEAD'
      })
      if (response.ok) setHasAvatar(true);
    }

    checkAvatar();
  }, [userID, extension])

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;
  
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={`${styles.container_header} ${theme ? styles[theme] : styles.light}`}>Профиль</h1>

        <div className={`${styles.avatar} ${theme ? styles[theme] : styles.light}`}>
          <div className={styles.avatar_image}>
            {
              hasAvatar ?
                <img src={`${avatarsAPI}${userID}${extension}`} alt="" /> :
                <Image src={emptyUserImage} alt="" priority />
            }
          </div>

          <input
            type="file"
            name="avatar"
            id="input-file"
            accept="image/*"
            className={styles.avatar_input}
            onChange={setImage}
          />
          <label
            htmlFor="input-file"
            className={styles.avatar_label}
          >
            Загрузить фото
          </label>
        </div>

        <div className={`${styles.about} ${theme ? styles[theme] : styles.light}`}>
          <div className={styles.about_main}>
            <AboutInput editField={editField} disabled={editable} value={about.name} name="name" title='Полное имя' />
            <AboutInput editField={editField} disabled={editable} value={about.email} name="email" title='Почтовый ящик' />
            <AboutInput editField={editField} disabled={editable} value={about.birthdate} name="birthdate" title='Дата рождения' />
            <AboutInput editField={editField} disabled={editable} value={about.phone_number} name="phone_number" title='Номер телефона' />
            <AboutInput editField={editField} disabled={editable} value={about.address} name="address" title='Адрес' />
            <AboutInput editField={editField} disabled={editable} value={about.education} name="education" title='Место учебы' />
          </div>
          <div className={styles.about_social}>
            <SocialInput editField={editField} disabled={editable} value={social?.website} name='website' icon={CiGlobe} title="Веб-сайт" />
            <SocialInput editField={editField} disabled={editable} value={social?.github} name='github' icon={FiGithub} title="Github" />
            <SocialInput editField={editField} disabled={editable} value={social?.vkontakte} name='vkontakte' icon={SlSocialVkontakte} title="ВКонтакте" color="#0077ff" />
            <SocialInput editField={editField} disabled={editable} value={social?.twitter} name='twitter' icon={TfiTwitter} title="Twitter" color="#1da1f2" />
            <SocialInput editField={editField} disabled={editable} value={social?.facebook} name='facebook' icon={FiFacebook} title="Facebook" color="#177af2" />
            <SocialInput editField={editField} disabled={editable} value={social?.instagram} name='instagram' icon={FiInstagram} title="Instagram" style={{ stroke: "url(#instagram-gradient-profile)" }} />

            <GradientIcon addition='profile' />
          </div>

          <div className={styles.about_buttons}>
            {
              !editable ?
                <button className={styles.about_buttons_edit} onClick={() => allowEdit()}>Редактировать</button> :
                <>
                  <button className={styles.about_buttons_save} onClick={() => saveEdit()}>Сохранить</button>
                  <button className={styles.about_buttons_cancel} onClick={() => cancelEdit()}>Отмена</button>
                </>
            }
          </div>
        </div>

        <div className={`${styles.password} ${theme ? styles[theme] : styles.light}`}>
          <PasswordInput value={password['current']} fieldType='password' name="current" title='Текущий пароль' isFieldVisible={isFieldVisible.current} showPassword={showPassword} editField={editField} />
          <PasswordInput value={password['new']} fieldType='password' name="new" title='Новый пароль' isFieldVisible={isFieldVisible.new} showPassword={showPassword} editField={editField} />
          <PasswordInput value={password['repeat']} fieldType='password' name="repeat" title='Повторите пароль' isFieldVisible={isFieldVisible.repeat} showPassword={showPassword} editField={editField} />

          {
            !!warning &&
            <small className={styles.password_warning}>{warning}</small>
          }

          <button
            className={styles.password_button}
            onClick={() => changePassword()}
          >
            Изменить
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Profile;

