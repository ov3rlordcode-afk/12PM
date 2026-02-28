"use client";

import React, { useMemo, useState } from "react";
import "./UserHome.css";
import "../help/help.css";
import "../help/contactus.css";
import "../help/reportissue.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./components/BrandCard";
import LocationCard from "./components/location/LocationCard";
import ItemCard from "./components/ItemCard";
import AvatarDropdown from "./components/AvatarDropdown";
import CategoryButton from "./components/CategoryButton";
import Cart from "./components/cart/Cart";
import ContactUs from "../help/contactus";
import ReportIssue from "../help/reportissue";

type Props = { name: string; city: string; onLogout: () => void };

export default function UserHome({ name, city, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");

  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Filter items
  const filteredItems = useMemo(
    () =>
      mockItems.filter((item) =>
        [item.name, item.shop, item.brand]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

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

  // Cart actions
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

  // Navigation
  const goHome = () => {
    setSelectedBrand(null);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
    setShowHelp(false);
    setShowContact(false);
    setShowReport(false);
    setShowAccount(false);
  };
  const selectBrand = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
  };
  const selectShop = (shop: string) => {
    setSelectedShop(shop);
    setShopCategory("All");
    setSearch("");
  };

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
            <AvatarDropdown
              onLogout={onLogout}
              onAccount={() => {
                setShowAccount(true);
                setShowHelp(false);
                setShowContact(false);
                setShowReport(false);
                setSelectedBrand(null);
                setSelectedShop(null);
              }}
            />
          </div>
        </nav>

        {/* ================= PAGE CONTENT ================= */}
        <div className="pageContent">
          {/* My Account */}
          {showAccount && <MyAccount onBack={goHome} />}

          {/* Help */}
          {showHelp && (
            <div className="content">
              <h1>Help & Support</h1>
              <button className="backBtn" onClick={goHome}>
                ← Back
              </button>
              <h2>Getting Started</h2>
              <p>
                Learn how to browse brands, select shops, add items to your
                cart, and place orders quickly and easily.
              </p>
              <h2>Orders</h2>
              <ul>
                <li>Track pending orders</li>
                <li>View completed orders</li>
                <li>Cancel an order</li>
              </ul>
              <h2>Payments</h2>
              <p>
                We support secure checkout and multiple payment methods. All
                transactions are encrypted for your safety.
              </p>
              <h2>Contact Support</h2>
              <p>
                Still need help? Reach out to our support team and we’ll respond
                as soon as possible.
              </p>
              <button
                onClick={() => {
                  setShowContact(true);
                  setShowHelp(false);
                }}
              >
                Contact Us
              </button>
            </div>
          )}

          {/* Contact Page */}
          {showContact && <ContactUs onBack={goHome} />}

          {/* Report Page */}
          {showReport && <ReportIssue onBack={goHome} />}

          {/* Brands Overview */}
          {!selectedBrand &&
            !selectedShop &&
            !showHelp &&
            !showContact &&
            !showReport &&
            !showAccount && (
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

          {/* Brand Locations */}
          {selectedBrand && !selectedShop && (
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

          {/* Shop Items */}
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
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                    />
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
    </div>
  );
}
