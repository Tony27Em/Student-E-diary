import { FC } from 'react';
import styles from '@/styles/contacts.module.scss';
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";

const AcademicDepartmentForm: FC<{ isChecked: boolean, toggleCheckbox: () => void }> = ({ isChecked, toggleCheckbox }) => {
  return (
    <form className={styles.form}>
      <select className={styles.form_select}>
        <option value=''>Выберите тип сигнала</option>
        <option value='complaint'>Жалоба</option>
        <option value='suggestion'>Предложение</option>
        <option value='question'>Вопрос к учебной части</option>
        <option value='payment'>Вопрос об оплате</option>
      </select>
      <input
        type="text"
        placeholder="Тема"
        className={styles.form_input}
      />
      <textarea
        name="textarea"
        cols={30}
        rows={10}
        placeholder='Сообщение'
        className={styles.form_textarea}
      />
      <div className={styles.form_checkbox}>
        <input type="checkbox" name="" id="check" onChange={() => toggleCheckbox()} />
        {
          isChecked ?
            <MdCheckBox size={20} onClick={() => toggleCheckbox()} style={{ color: isChecked ? '#ee4e56' : '' }} /> :
            <MdCheckBoxOutlineBlank size={20} onClick={() => toggleCheckbox()} style={{ color: '#1976d2' }} />
        }
        <label htmlFor="check">Срочно</label>
      </div>
      <button
        title='No functionality'
        className={styles.form_button}
        onClick={(e) => e.preventDefault()}
      >
        Отправить
      </button>
    </form>
  )
}

export default AcademicDepartmentForm;