import { atom } from "jotai";

interface CartItem {
  id: number;
  name: string;
  cost: number;
}

export const cartList = atom<CartItem[]>([]); // Derive cartCount from cartList

export const cartCount = atom((get) => get(cartList).length);

export const totalCost = atom<number>((get) =>
  parseFloat(
    get(cartList)
      .reduce((acc, item) => acc + item.cost, 0)
      .toFixed(2)
  )
);
export const transactionTime = atom(null);
