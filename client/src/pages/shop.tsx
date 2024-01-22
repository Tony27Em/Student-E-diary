import { useState, useEffect } from 'react';
import { NextPage } from "next";
import Image from "next/image";
import { useTheme } from "next-themes";

import $api, { API_URL } from "@/http";
import { IShopItem } from '@/types/IShopItem';
import styles from '../styles/shop/shop.module.scss';

import Layout from "@/components/layout/layout";
import ShopList from "@/components/shop/shopList";
import ModalCart from "@/components/shop/modalCart";

import coin from '../../public/coin.png';
import diamond from '../../public/diamond.png';

const Shop: NextPage = () => {
  const { theme } = useTheme();
  const [shopData, setShopData] = useState<IShopItem[]>([]);
  const [cart, setCart] = useState<IShopItem[] | []>([]);
  const [openCart, setOpenCart] = useState<boolean>(false);

  const handleOpenCart = () => setOpenCart(true);
  const handleCloseCart = () => setOpenCart(false);

  useEffect(() => {
    async function getShopData() {
      const response = await $api.get(API_URL + '/getShopData');
      setShopData(response.data);

      const isStorageEmpty = !!localStorage.getItem('cart');
      if (!isStorageEmpty) {
        const myCart = await $api.get(API_URL + '/getCart');
        localStorage.setItem('cart', JSON.stringify(myCart.data.cart));
        setCart(myCart.data.cart);
        return;
      }
      setCart(JSON.parse(localStorage.getItem('cart')!));
    }
    getShopData();
  }, [])

  const addToCart = async (selectedID: string) => {
    const selectedItem = shopData.find(({ _id }) => _id === selectedID)!;

    if (!selectedItem.amount) return;

    const response = await $api.post(API_URL + '/addToCart', { itemID: selectedID });

    setCart(current => {
      const check = current.some(item => item._id === selectedItem._id);

      if (!check) {
        current = [...current, { ...selectedItem, cartAmount: 1 }];
      } else {
        current = current.map(item => {
          if (item._id === selectedItem._id) {
            return {
              ...item,
              cartAmount: item.cartAmount! + 1,
            }
          }
          return item;
        })
      }

      localStorage.setItem('cart', JSON.stringify(current));
      return current;
    });

    const modifiedShopData = shopData.map(item => {
      if (item._id === selectedItem._id) {
        return {
          ...item,
          amount: item.amount - 1,
        }
      }
      return item;
    })
    setShopData(modifiedShopData);
  }

  const removeFromCart = async (selectedID: string, amount: number) => {
    const response = await $api.post(API_URL + '/removeFromCart', { itemID: selectedID, amount: amount });

    const modifiedCart = cart.map(item => {
      if (item._id === selectedID) {
        return {
          ...item,
          cartAmount: item.cartAmount! - amount,
        }
      }
      return item;
    }).filter(item => item.cartAmount! > 0)

    setCart(modifiedCart);

    const modifiedShopData = shopData.map(item => {
      if (item._id === selectedID) {
        return {
          ...item,
          amount: item.amount + amount,
        }
      }
      return item;
    })
    setShopData(modifiedShopData);

    localStorage.setItem('cart', JSON.stringify(modifiedCart));
  }

  const shopListProps = { shopData, addToCart };
  const modalCartProps = { cart, openCart, handleCloseCart, addToCart, removeFromCart, setCart };

  // Next Themes Recommendation - Avoid Hydration Mismatch
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), [])
  if (!mounted) return null;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.container_header}>
          <h1 className={`${styles.container_header_text} ${theme ? styles[theme] : styles.light}`}>Магазин</h1>
          <div className={styles.container_header_cart}>
            <div className={styles.container_header_cart_funds}>
              <span className={theme ? styles[theme] : styles.light}>Доступные средства:</span>
              <div>
                <span className={theme ? styles[theme] : styles.light}>1000</span>
                <Image
                  src={diamond}
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <span className={theme ? styles[theme] : styles.light}>1000</span>
                <Image
                  src={coin}
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
            </div>

            <div className={styles.container_header_cart_buttons}>
              <button onClick={handleOpenCart}>Корзина</button>
              <button disabled title='No functionality'>Мои покупки</button>
            </div>
          </div>
        </div>

        <ShopList {...shopListProps} />
      </div>

      <ModalCart {...modalCartProps} />
    </Layout>
  )
}

export default Shop;