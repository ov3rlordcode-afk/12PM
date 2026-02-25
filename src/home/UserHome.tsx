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
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

    const unique = new Map<string, Item>();

    filteredItems
      .filter((item) => item.brand === selectedBrand)
      .forEach((item) => {
        if (!unique.has(item.shop)) {
          unique.set(item.shop, item);
        }
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

  /* ================= CART ACTIONS ================= */

  const addToCart = (item: Item) => {
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

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

  /* ================= RENDER ================= */

  return (
    <div className="userHome app">
      {/* ================= NAVBAR ================= */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo" onClick={goHome}>
            Swift2Me
          </h2>

          <ul className="navMenu">
            <li onClick={goHome}>Home</li>

            <li
              onClick={() => {
                setSelectedBrand(null);
                setSelectedShop(null);
              }}
            >
              Brands
            </li>

            <li
              className="navItem"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
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
          </ul>
        </div>

        <div className="navRight">
          <input
            type="text"
            placeholder="Search stores, brands or items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />

          <button className="cartIcon" onClick={() => setCartOpen(true)}>
            🛒 {cart.length}
          </button>

          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* ================= BRAND GRID ================= */}
      {!selectedBrand && !selectedShop && (
        <div className="itemsGrid">
          {Object.entries(brands).length ? (
            Object.entries(brands).map(([brandName, items]) => (
              <BrandCard
                key={brandName}
                brandName={brandName}
                items={items}
                onViewBrand={() => setSelectedBrand(brandName)}
              />
            ))
          ) : (
            <p className="noResults">No brands found.</p>
          )}
        </div>
      )}

      {/* ================= LOCATIONS VIEW ================= */}
      {selectedBrand && !selectedShop && (
        <>
          <div className="brandHeader">
            <h2>{selectedBrand} Locations</h2>
            <button className="backBtn" onClick={goHome}>
              ← Back
            </button>
          </div>

          <div className="itemsGrid">
            {brandLocations.map((shop) => (
              <LocationCard
                key={shop.shop}
                shopName={shop.shop}
                shopImage={shop.shopImage}
                openHours={shop.openHours}
                address={shop.address}
                website={shop.website}
                onSelectShop={() => {
                  setSelectedShop(shop.shop);
                  setShopCategory("All");
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ================= SHOP MENU ================= */}
      {selectedShop && (
        <div className="shopMenu">
          <div className="shopHeader">
            <h3>{selectedShop} Menu</h3>
            <button onClick={() => setSelectedShop(null)}>← Back</button>
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
              <p className="noResults">No items available.</p>
            )}
          </div>
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      <div className={`cartDrawer ${cartOpen ? "open" : ""}`}>
        <div className="cartHeader">
          <h3>Your Cart</h3>
          <button onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cartContent">
          {cart.length ? (
            cart.map((item, index) => (
              <div key={index} className="cartItem">
                <span>{item.name}</span>
                <span>£{item.price.toFixed(2)}</span>
                <button onClick={() => removeFromCart(index)}>✕</button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
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
