import {FC} from 'react';
import { AboutInputType } from '@/types/ProfileTypes';
import styles from '../../styles/profile.module.scss';

const AboutInput: FC<AboutInputType> = ({ title, name, value, disabled, editField }) => {
  return (
    <div className={styles.about_main_inputs}>
      <h4>{title}:</h4>
      <input
        type="text"
        name={name}
        value={value || ''}
        placeholder="Напишите что-нибудь"
        disabled={!disabled}
        onChange={(e) => editField('about', e.target.name, e.target.value)}
      />
    </div>
  )
}

export default AboutInput;
