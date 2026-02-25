import React, { createContext, useContext, useState, useMemo } from "react";
import { Item } from "../mockItems";

type CartItem = Item & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: number, shopName: string) => void;
  incrementItem: (itemId: number, shopName: string) => void;
  decrementItem: (itemId: number, shopName: string) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  totalPrice: number;
  totalItems: number;
  groupedByShop: Record<
    string,
    { items: CartItem[]; address: string; subtotal: number }
  >;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.id === item.id && c.shop === item.shop
      );
      if (existing) {
        return prev.map((c) =>
          c.id === item.id && c.shop === item.shop
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (itemId: number, shopName: string) => {
    setCart((prev) =>
      prev.filter((c) => !(c.id === itemId && c.shop === shopName))
    );
  };

  const incrementItem = (itemId: number, shopName: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.id === itemId && c.shop === shopName
          ? { ...c, quantity: c.quantity + 1 }
          : c
      )
    );
  };

  const decrementItem = (itemId: number, shopName: string) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === itemId && c.shop === shopName
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const groupedByShop = useMemo(() => {
    const grouped: Record<
      string,
      { items: CartItem[]; address: string; subtotal: number }
    > = {};
    cart.forEach((item) => {
      if (!grouped[item.shop]) {
        grouped[item.shop] = { items: [], address: item.address, subtotal: 0 };
      }
      grouped[item.shop].items.push(item);
      grouped[item.shop].subtotal += item.price * item.quantity;
    });
    return grouped;
  }, [cart]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        incrementItem,
        decrementItem,
        cartOpen,
        setCartOpen,
        totalPrice,
        totalItems,
        groupedByShop,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
