import { FC } from 'react';
import { SocialInputType } from '@/types/ProfileTypes';
import styles from '../../styles/profile.module.scss';

const SocialInput: FC<SocialInputType> = ({ icon: Icon, title, name, value, disabled, color, style, editField }) => {
  return (
    <div className={styles.about_social_inputs}>
      <Icon size={24} color={color} style={style} />
      <h4>{title}</h4>
      <input
        type="text"
        name={name}
        value={value || ''}
        disabled={!disabled}
        placeholder="Здесь ваша ссылка на соцсеть"
        onChange={(e) => editField('social_media', e.target.name, e.target.value)}
      />
    </div>
  )
}

export default SocialInput;