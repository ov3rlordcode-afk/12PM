import React, { createContext, useContext, useState, useMemo } from "react";
import { Item } from "../mockItems";

type CartItem = Item & { quantity: number };

type ShopStats = {
  views: number;
  likes: number;
  favorites: number;
};

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
    {
      items: CartItem[];
      address: string;
      subtotal: number;
      deliveryFee: number;
      grandTotal: number;
      distanceKm: number;
      stats: ShopStats;
    }
  >;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE_PER_SHOP = 2.99;
const USER_LOCATION = { lat: 55.9533, lng: -3.1883 }; // Mock user location

const getDistanceKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* ================= ADD / REMOVE ITEMS ================= */
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

  /* ================= GROUP BY SHOP ================= */
  const groupedByShop = useMemo(() => {
    const grouped: CartContextType["groupedByShop"] = {};

    cart.forEach((item) => {
      if (!grouped[item.shop]) {
        const lat = item.lat ?? USER_LOCATION.lat + Math.random() * 0.05;
        const lng = item.lng ?? USER_LOCATION.lng + Math.random() * 0.05;

        // Load shop stats from localStorage
        const stats: ShopStats = JSON.parse(
          localStorage.getItem("shopStats") || "{}"
        )[item.shop] || { views: 0, likes: 0, favorites: 0 };

        grouped[item.shop] = {
          items: [],
          address: item.shop,
          subtotal: 0,
          deliveryFee: DELIVERY_FEE_PER_SHOP,
          grandTotal: 0,
          distanceKm: getDistanceKm(
            USER_LOCATION.lat,
            USER_LOCATION.lng,
            lat,
            lng
          ),
          stats,
        };
      }
      grouped[item.shop].items.push(item);
      grouped[item.shop].subtotal += item.price * item.quantity;
      grouped[item.shop].grandTotal =
        grouped[item.shop].subtotal + grouped[item.shop].deliveryFee;
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
