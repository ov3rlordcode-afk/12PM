import React, { useState } from "react";
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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");
  const [cart, setCart] = useState<Item[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const addToCart = (item: Item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const placeOrder = () => {
    if (!cart.length) return alert("Cart is empty!");
    const storedOrders = localStorage.getItem("orders");
    const orders = storedOrders ? JSON.parse(storedOrders) : [];
    const newOrder = {
      id: Date.now(),
      customer: name,
      city,
      address: `${city} address placeholder`,
      items: cart.map((i) => i.name),
      reward: Math.floor(totalPrice),
      status: "pending" as const,
    };
    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));
    setCart([]);
    alert("Order placed! Operator will dispatch a driver.");
  };

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
      {/* ================= NORMAL NAVBAR ================= */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo">Swift2Me</h2>

          <ul className="navMenu">
            <li
              onClick={() => {
                setSelectedBrand(null);
                setViewShop(null);
              }}
            >
              Home
            </li>
            <li onClick={() => setSelectedBrand(null)}>Brands</li>
            <li
              className="navItem"
              onMouseEnter={toggleDropdown}
              onMouseLeave={toggleDropdown}
            >
              Orders
              {dropdownOpen && (
                <div className="dropdownMenu">
                  <div className="dropdownItem">Pending Orders</div>
                  <div className="dropdownItem">Completed Orders</div>
                  <div className="dropdownItem">Cancelled Orders</div>
                </div>
              )}
            </li>
            <li onClick={() => alert("Profile page coming soon!")}>Profile</li>
            <li className="logoutBtn" onClick={onLogout}>
              Logout
            </li>
          </ul>
        </div>

        <div className="navRight">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* ================= BRAND VIEW ================= */}
      {!selectedBrand && !viewShop ? (
        <div className="itemsGrid">
          {Object.entries(itemsByBrand).length ? (
            Object.entries(itemsByBrand).map(([brandName, items]) => (
              <BrandCard
                key={brandName}
                brandName={brandName}
                items={items}
                onViewBrand={() => setSelectedBrand(brandName)}
              />
            ))
          ) : (
            <p className="noResults">No brands match your search 😢</p>
          )}
        </div>
      ) : selectedBrand && !viewShop ? (
        <>
          <div className="brandHeader">
            <h2>{selectedBrand} Locations</h2>
            <button className="backBtn" onClick={() => setSelectedBrand(null)}>
              ← Back to Brands
            </button>
          </div>
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
        </>
      ) : null}

      {/* ================= SHOP MENU ================= */}
      {viewShop && (
        <div className="shopMenu">
          <div className="shopHeader">
            <h3>{viewShop} Menu</h3>
            <button onClick={() => setViewShop(null)}>× Close</button>
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
          <button onClick={placeOrder}>Place Order</button>
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
