import { FC } from 'react';
import { PasswordInputType } from '@/types/ProfileTypes';
import styles from '../../styles/profile.module.scss';
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";

const PasswordInput: FC<PasswordInputType> = ({ title, name, value, showPassword, isFieldVisible, editField }) => {
  return (
    <div className={styles.password_inputs}>
      <h4>{title}:</h4>
      <div>
        <input
          type={isFieldVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => editField('password', e.target.name, e.target.value)}
        />
        <button onClick={() => showPassword(name!, isFieldVisible!)}>
          {isFieldVisible ? <BsEye size={20} color='#000' /> : <BsEyeSlash size={20} color='#000' />}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput;