"use client";

import React, { useMemo, useState } from "react";
import "./UserHome.css";
import "../help/help.css";
import "../help/contactus.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./components/BrandCard";
import LocationCard from "./components/location/LocationCard";
import ItemCard from "./components/ItemCard";
import AvatarDropdown from "./components/AvatarDropdown";
import CategoryButton from "./components/CategoryButton";
import Cart from "./components/cart/Cart";
import ContactUs from "../help/contactus"; // <-- imported

type Props = {
  name: string;
  city: string;
  onLogout: () => void;
};

export default function UserHome({ name, city, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");

  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false); // NEW state for modal

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
    const unique = new Map<string, Item>();
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
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
  };

  const selectBrand = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
  };

  const selectShop = (shop: string) => {
    setSelectedShop(shop);
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="userHome">
      <div className="boxedContainer">
        {/* NAVBAR */}
        <nav className="homeNavbar">
          <div className="navLeft">
            <h2 className="logo" onClick={goHome}>
              Swift2Me
            </h2>
            <ul className="navMenu">
              <li onClick={goHome}>About Us</li>
              <li onClick={() => selectBrand("")}>Brands</li>
              <li onClick={goHome}>Items</li>
              <li onClick={goHome}>Drivers</li>

              <li
                className="navItem"
                onMouseEnter={() => setOrdersDropdownOpen(true)}
                onMouseLeave={() => setOrdersDropdownOpen(false)}
              >
                Orders
                {ordersDropdownOpen && (
                  <div className="dropdownMenu">
                    <div className="dropdownItem">Pending Orders</div>
                    <div className="dropdownItem">Completed Orders</div>
                    <div className="dropdownItem">Cancelled Orders</div>
                  </div>
                )}
              </li>

              <li
                className="navItem"
                onMouseEnter={() => setSupportDropdownOpen(true)}
                onMouseLeave={() => setSupportDropdownOpen(false)}
              >
                Support
                {supportDropdownOpen && (
                  <div className="dropdownMenu">
                    <div
                      className="dropdownItem"
                      onClick={() => {
                        setShowHelpCenter(true);
                        setSelectedBrand(null);
                        setSelectedShop(null);
                      }}
                    >
                      Help Center
                    </div>
                    <div
                      className="dropdownItem"
                      onClick={() => {
                        setShowContactPage(true);
                        setShowHelpCenter(false);
                      }}
                    >
                      Contact Us
                    </div>
                    <div className="dropdownItem">Report an Issue</div>
                    <div className="dropdownItem">FAQs</div>
                  </div>
                )}
              </li>
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

            <Cart
              cart={cart}
              cartOpen={cartOpen}
              setCartOpen={setCartOpen}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
              totalPrice={totalPrice}
              orderSuccess={orderSuccess}
              setOrderSuccess={setOrderSuccess}
            />

            <AvatarDropdown onLogout={onLogout} />
          </div>
        </nav>

        {/* ================= MAIN CONTENT ================= */}
        {showHelpCenter && !showContactPage && (
          <div className="helpContainer">
            <div className="helpHeader">
              <h1>Help & Support</h1>
              <button
                className="backBtn"
                onClick={() => setShowHelpCenter(false)}
              >
                ← Back
              </button>
            </div>

            <div className="helpContent">
              <section className="helpSection">
                <h2>Getting Started</h2>
                <p>
                  Learn how to browse brands, select shops, add items to your
                  cart, and place orders quickly and easily.
                </p>
              </section>

              <section className="helpSection">
                <h2>Orders</h2>
                <ul>
                  <li>Track pending orders</li>
                  <li>View completed orders</li>
                  <li>Cancel an order</li>
                </ul>
              </section>

              <section className="helpSection">
                <h2>Payments</h2>
                <p>
                  We support secure checkout and multiple payment methods. All
                  transactions are encrypted for your safety.
                </p>
              </section>

              <section className="helpSection">
                <h2>Contact Support</h2>
                <p>
                  Still need help? Reach out to our support team and we’ll
                  respond as soon as possible.
                </p>
                <button
                  className="contactBtn"
                  onClick={() => {
                    setShowContactPage(true);
                    setShowHelpCenter(false);
                  }}
                >
                  Contact Us
                </button>
              </section>
            </div>
          </div>
        )}

        {/* ================= CONTACT PAGE SLIDE-IN ================= */}
        {showContactPage && (
          <div className="contactPageWrapper">
            <ContactUs onBack={() => setShowContactPage(false)} />
          </div>
        )}

        {/* ================= Existing Brand / Shop / Items ================= */}
        {!showHelpCenter &&
          !selectedBrand &&
          !selectedShop &&
          !showContactPage && (
            <div className="itemsGrid">
              {Object.entries(brands).length ? (
                Object.entries(brands).map(([brandName, items]) => (
                  <BrandCard
                    key={brandName}
                    brandName={brandName}
                    items={items}
                    onViewBrand={() => selectBrand(brandName)}
                  />
                ))
              ) : (
                <p className="noResults">No brands found.</p>
              )}
            </div>
          )}

        {selectedBrand &&
          !selectedShop &&
          !showHelpCenter &&
          !showContactPage && (
            <>
              <div className="brandHeader">
                <h2>{selectedBrand} Locations</h2>
                <button className="backBtn" onClick={goHome}>
                  ← Back
                </button>
              </div>

              <div className="itemsGrid">
                {brandLocations.length ? (
                  brandLocations.map((shop) => (
                    <LocationCard
                      key={shop.shop}
                      shopName={shop.shop}
                      shopImage={shop.shopImage}
                      openHours={shop.openHours}
                      address={shop.shop}
                      website={shop.website}
                      onSelectShop={() => selectShop(shop.shop)}
                    />
                  ))
                ) : (
                  <p className="noResults">No shops found for this brand.</p>
                )}
              </div>
            </>
          )}

        {selectedShop && !showHelpCenter && !showContactPage && (
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
                <p className="noResults">
                  No items available in this category.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
