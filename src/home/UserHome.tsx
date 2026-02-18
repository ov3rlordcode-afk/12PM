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

  // --- Cart Handlers ---
  const addToCart = (item: Item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

  // --- Filter Items ---
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

  const searchResults = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="userHome app">
      {/* --- Header --- */}
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
          {search && (
            <div className="searchDropdown">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="searchResult"
                    onClick={() => setViewShop(result.shop)}
                  >
                    <strong>{result.shop}</strong> - {result.name}
                  </div>
                ))
              ) : (
                <div className="searchResult">No results found</div>
              )}
            </div>
          )}
        </div>

        <div className="navRight">
          <ul className="navMenu">
            <li className="navItem">J</li>
            <li className="navItem">About</li>
            <li className="navItem">Support</li>
          </ul>
          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* --- Brands / Shops --- */}
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

      {/* --- Floating Shop Menu --- */}
      {viewShop && (
        <div className="floatingMenu">
          <div className="menuHeader">
            <h3>{viewShop} Menu</h3>
            <button className="closeMenuBtn" onClick={() => setViewShop(null)}>
              ×
            </button>
          </div>

          {/* --- Shop Categories --- */}
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

          {/* --- Shop Items --- */}
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

      {/* --- Floating Cart --- */}
      {cart.length > 0 && (
        <div className="cartButton">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            🛒 {cart.length} items | £{totalPrice.toFixed(2)}
          </div>
          <div
            style={{ marginTop: "10px", maxHeight: "200px", overflowY: "auto" }}
          >
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#FF8A50",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              >
                <span>{item.name}</span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFromCart(index)}
                >
                  ❌
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
