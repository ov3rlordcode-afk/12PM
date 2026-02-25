import React, { useMemo, useState } from "react";
import "./UserHome.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./components/BrandCard";
import LocationCard from "./components/location/LocationCard";
import ItemCard from "./components/ItemCard";
import AvatarDropdown from "./components/AvatarDropdown";
import CategoryButton from "./components/CategoryButton";

type Props = {
  name: string;
  city: string;
  onLogout: () => void;
};

export default function UserHome({ name, city, onLogout }: Props) {
  /* ================= STATE ================= */
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  /* ================= FILTERED DATA ================= */

  const filteredItems = useMemo(() => {
    return mockItems.filter((item) =>
      [item.name, item.shop, item.brand]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const brands = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.brand]) grouped[item.brand] = [];
      grouped[item.brand].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const brandLocations = useMemo(() => {
    if (!selectedBrand) return [];

    const unique = new Map();
    filteredItems
      .filter((item) => item.brand === selectedBrand)
      .forEach((item) => {
        if (!unique.has(item.shop)) unique.set(item.shop, item);
      });

    return Array.from(unique.values());
  }, [selectedBrand, filteredItems]);

  const shopItems = useMemo(() => {
    if (!selectedShop) return [];
    return filteredItems.filter(
      (item) =>
        item.shop === selectedShop &&
        (shopCategory === "All" || item.type === shopCategory)
    );
  }, [selectedShop, shopCategory, filteredItems]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart]
  );

  /* ================= CART ================= */

  const addToCart = (item: Item) => {
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  };

  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const placeOrder = () => {
    if (!cart.length) return;

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now(),
      customer: name,
      city,
      items: cart,
      total: totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

    setCart([]);
    setCartOpen(false);
    setOrderSuccess(true);
  };

  /* ================= NAVIGATION ================= */

  const goHome = () => {
    setSelectedBrand(null);
    setSelectedShop(null);
  };

  return (
    <div className="userHome app">
      {/* ================= NAVBAR ================= */}
      <nav className="homeNavbar">
        <h2 className="logo" onClick={goHome}>
          Swift2Me
        </h2>

        <input
          type="text"
          placeholder="Search stores, brands or items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchInput"
        />

        <div className="navActions">
          <button className="cartIcon" onClick={() => setCartOpen(true)}>
            🛒 {cart.length}
          </button>
          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* ================= BRAND VIEW ================= */}
      {!selectedBrand && !selectedShop && (
        <div className="itemsGrid">
          {Object.entries(brands).map(([brandName, items]) => (
            <BrandCard
              key={brandName}
              brandName={brandName}
              items={items}
              onViewBrand={() => setSelectedBrand(brandName)}
            />
          ))}
        </div>
      )}

      {/* ================= LOCATION VIEW ================= */}
      {selectedBrand && !selectedShop && (
        <div className="itemsGrid">
          {brandLocations.map((shop) => (
            <LocationCard
              key={shop.shop}
              shopName={shop.shop}
              shopImage={shop.shopImage}
              openHours={shop.openHours}
              address={shop.address}
              website={shop.website}
              onSelectShop={() => setSelectedShop(shop.shop)}
            />
          ))}
        </div>
      )}

      {/* ================= SHOP MENU ================= */}
      {selectedShop && (
        <div className="itemsGrid">
          {shopItems.map((item) => (
            <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      <div className={`cartDrawer ${cartOpen ? "open" : ""}`}>
        <div className="cartHeader">
          <h3>Your Cart</h3>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cartContent">
          {cart.map((item, index) => (
            <div key={index} className="cartItem">
              <span>{item.name}</span>
              <span>£{item.price.toFixed(2)}</span>
              <button onClick={() => removeFromCart(index)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cartFooter">
          <strong>Total: £{totalPrice.toFixed(2)}</strong>
          <button className="checkoutBtn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>

      {/* ================= SUCCESS MODAL ================= */}
      {orderSuccess && (
        <div className="modalOverlay">
          <div className="successModal">
            <h2>🎉 Order Confirmed!</h2>
            <p>Your order has been placed successfully.</p>
            <button onClick={() => setOrderSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
