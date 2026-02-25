import React, { useState } from "react";
import "./UserHome.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./components/BrandCard";
import LocationCard from "./components/LocationCard";
import ItemCard from "./components/ItemCard";
import AvatarDropdown from "./components/AvatarDropdown";
import CategoryButton from "./components/CategoryButton";

type Props = {
  name: string;
  city: string;
  onLogout: () => void;
};

export default function UserHome({ name, city, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");
  const [cart, setCart] = useState<Item[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  // --- Cart ---
  const addToCart = (item: Item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // --- Place Order ---
  const placeOrder = () => {
    if (!cart.length) return alert("Cart is empty!");

    const storedOrders = localStorage.getItem("orders");
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    const newOrder = {
      id: Date.now(),
      customer: name,
      city,
      address: `${city} address placeholder`, // could add real address input
      items: cart.map((i) => i.name),
      reward: Math.floor(totalPrice),
      status: "pending" as const,
    };

    const updatedOrders = [...orders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setCart([]); // clear cart

    alert("Order placed! Operator will dispatch a driver.");
  };

  // --- Filters ---
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || item.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const itemsByBrand = filteredItems.reduce(
    (acc: Record<string, Item[]>, item) => {
      if (!acc[item.brand]) acc[item.brand] = [];
      acc[item.brand].push(item);
      return acc;
    },
    {}
  );

  const brandShops = selectedBrand
    ? filteredItems.filter((item) => item.brand === selectedBrand)
    : [];

  const shopItems = viewShop
    ? filteredItems.filter(
        (item) =>
          item.shop === viewShop &&
          (shopCategory === "All" || item.type === shopCategory)
      )
    : [];

  return (
    <div className="userHome app">
      {/* ================= NAVBAR ================= */}
      <nav className="homeNavbar improvedNavbar">
        <div className="navLeft">
          <h2 className="logo">Swift2Me</h2>
          <input
            type="text"
            placeholder="Search items or shops..."
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="navRight">
          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* ================= BRAND VIEW ================= */}
      {!selectedBrand && !viewShop ? (
        <div className="itemsGrid">
          {Object.entries(itemsByBrand).map(([brandName, items]) => (
            <BrandCard
              key={brandName}
              brandName={brandName}
              items={items}
              onViewBrand={() => setSelectedBrand(brandName)}
            />
          ))}
        </div>
      ) : selectedBrand && !viewShop ? (
        <>
          <h2 style={{ margin: "20px 0" }}>{selectedBrand} Locations</h2>
          <div className="itemsGrid">
            {brandShops.map((item) => (
              <LocationCard
                key={item.shop}
                shopName={item.shop}
                shopImage={item.shopImage}
                openHours={item.openHours}
                onSelectShop={() => {
                  setViewShop(item.shop);
                  setShopCategory("All");
                }}
              />
            ))}
          </div>
          <button className="backBtn" onClick={() => setSelectedBrand(null)}>
            ← Back to Brands
          </button>
        </>
      ) : null}

      {/* ================= SHOP MENU ================= */}
      {viewShop && (
        <div className="floatingMenu">
          <div className="menuHeader">
            <h3>{viewShop} Menu</h3>
            <button className="closeMenuBtn" onClick={() => setViewShop(null)}>
              ×
            </button>
          </div>

          <div className="categories">
            {categories.map((cat) => (
              <CategoryButton
                key={cat}
                category={cat}
                isActive={shopCategory === cat}
                onClick={() => setShopCategory(cat)}
              />
            ))}
          </div>

          <div className="itemsGrid">
            {shopItems.length ? (
              shopItems.map((item) => (
                <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
              ))
            ) : (
              <p className="noResults">No items in this category 😢</p>
            )}
          </div>
        </div>
      )}

      {/* ================= CART ================= */}
      {cart.length > 0 && (
        <div className="cartButton">
          🛒 {cart.length} items | £{totalPrice.toFixed(2)}
          <button className="placeOrderBtn" onClick={placeOrder}>
            Place Order
          </button>
          <div className="cartItems">
            {cart.map((item, index) => (
              <div key={index} className="cartItem">
                <span>{item.name}</span>
                <span onClick={() => removeFromCart(index)}>❌</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}