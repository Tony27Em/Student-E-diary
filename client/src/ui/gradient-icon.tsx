import { FC } from 'react';

export const GradientIcon: FC<{ addition: string }> = ({ addition }) => {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <linearGradient id={'instagram-gradient-' + addition} x1="100%" y1="100%" x2="0%" y2="0%">
        <stop stopColor="#fd1d1d" offset="0%" />
        <stop stopColor="#e1306c" offset="20%" />
        <stop stopColor="#c13584" offset="40%" />
        <stop stopColor="#833ab4" offset="60%" />
        <stop stopColor="#5851db" offset="80%" />
        <stop stopColor="#405de6" offset="100%" />
      </linearGradient>
    </svg>
  )
}


// P.S. проще было готовое изображение вставить, но мы не ищем легких путей! )))