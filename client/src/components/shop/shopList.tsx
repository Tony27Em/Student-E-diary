import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { IShopItem } from '@/types/IShopItem';
import styles from '../../styles/shop/list.module.scss';
import diamond from '../../../public/diamond.png';
import coin from '../../../public/coin.png';

const shopImagesAPI = 'http://localhost:5000/shopImages/';

interface IShopListProps {
  shopData: IShopItem[];
  addToCart: (selectedID: string) => void;
}

const ShopList: FC<IShopListProps> = ({ shopData, addToCart }) => {
  const { theme } = useTheme();

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;
  
  return (
    <div className={styles.list}>
      {
        shopData.map(item => {
          return (
            <div className={styles.list_item} key={item._id}>
              <div className={`${styles.list_item_header} ${theme ? styles[theme] : styles.light}`}>
                <p>{item.name}</p>
                <button
                  onClick={() => addToCart(item._id)}
                  style={{ backgroundColor: !item.amount ? 'gray' : '' }}
                  disabled={!item.amount}
                >
                  В корзину
                </button>
              </div>

              <div className={styles.list_item_img}>
                <img src={shopImagesAPI + item.img} alt="" />
              </div>

              <div className={`${styles.list_item_footer} ${theme ? styles[theme] : styles.light}`}>
                <p className={styles.list_item_footer_description}>{item.description}</p>
                <div className={styles.list_item_footer_price}>
                  <div>
                    <span>{item.price.crystal}</span>
                    <Image src={diamond} alt='' width={20} height={20} />
                  </div>
                  <div>
                    <span>{item.price.coin}</span>
                    <Image src={coin} alt='' width={20} height={20} />
                  </div>
                </div>
                <p className={styles.list_item_footer_amount}>Доступно товаров: {item.amount}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ShopList;