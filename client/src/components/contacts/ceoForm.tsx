import { FC } from 'react';
import styles from '@/styles/contacts.module.scss';

const CeoForm: FC = () => {
  return (
    <form className={styles.form}>
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

export default CeoForm;