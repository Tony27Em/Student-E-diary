export interface IShopItem {
  _id: string;
  img: string;
  name: string;
  amount: number;
  price: {
    crystal: number,
    coin: number,
  };
  description: string;
  cartAmount?: number;
}
