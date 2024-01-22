import { FC, useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { IShopItem } from "@/types/IShopItem";
import styles from '../../styles/shop/cart.module.scss';
import $api, { API_URL } from "@/http";
import Modal from '@mui/material/Modal';
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoClose, IoTrashOutline } from "react-icons/io5";

interface IModalCartProps {
  cart: IShopItem[];
  openCart: boolean;
  handleCloseCart: () => void;
  addToCart: (selectedID: string) => void;
  removeFromCart: (selectedID: string, amount: number) => void;
  setCart: ([]) => void
}

const ModalCart: FC<IModalCartProps> = ({ cart, openCart, handleCloseCart, addToCart, removeFromCart, setCart }) => {
  const { theme } = useTheme();

  const makeOrder = async () => {
    try {
      const response = await $api.post(API_URL + '/order', { cart });
      if (response.status === 200) {
        setCart([]);
        handleCloseCart();

        console.log('Куплено!');
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Modal
      open={openCart}
      onClose={handleCloseCart}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={`${styles.modal} ${theme ? styles[theme] : styles.light}`}>
        <button
          className={styles.modal_close}
          onClick={() => handleCloseCart()}
        >
          <IoClose size={24} color={theme === 'light' ? '#000' : '#fff'} />
        </button>

        <h2 className={`${styles.modal_header} ${theme ? styles[theme] : styles.light}`}>Корзина</h2>

        {
          !cart.length ?
            <div className={styles.modal_empty}>В корзине ничего нет</div>
            :
            <div className={styles.modal_list}>
              {
                cart.map((item, index) => (
                  <div
                    key={item._id}
                    className={styles.modal_list_item}
                    style={{ backgroundColor: theme === 'light' ? '#f5f6fa' : '#1a2036' }}
                  >
                    <span className={styles.modal_list_item_name}>{index + 1}. {item.name}</span>
                    <span className={styles.modal_list_item_description}>{item.description}</span>

                    <div className={styles.modal_list_item_amount}>
                      <button onClick={() => removeFromCart(item._id, 1)}>
                        <FaMinus size={12} />
                      </button>
                      <span>{item.cartAmount}</span>
                      <button
                        onClick={() => addToCart(item._id)}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>

                    <button
                      className={styles.modal_list_item_delete}
                      onClick={() => removeFromCart(item._id, item.cartAmount!)}
                    >
                      <IoTrashOutline size={24} color='#eb606e' />
                    </button>
                  </div>
                ))
              }
            </div>
        }

        <div className={styles.modal_buttons}>
          <button onClick={makeOrder}>Купить</button>
          <button onClick={handleCloseCart}>Закрыть</button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalCart;