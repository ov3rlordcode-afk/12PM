"use client";

import React, { useMemo, useState, useCallback } from "react";
import "./UserHome.css";
import "../help/help.css";
import "../help/contactus.css";
import "../help/reportissue.css";
import { mockItems, Item, categories } from "./mockItems";
import BrandCard from "./BrandCard";
import LocationCard from "./LocationCard";
import ItemCard from "./ItemCard";
import AvatarDropdown from "./AvatarDropdown";
import CategoryButton from "./CategoryButton";
import Cart from "./Cart";
import ContactUs from "../help/contactus";
import ReportIssue from "../help/reportissue";
import Reviews from "./reviews/reviews";
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
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const resetView = useCallback(() => {
    setSelectedBrand(null);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
    setShowHelp(false);
    setShowContact(false);
    setShowReport(false);
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredItems = useMemo(
    () =>
      mockItems.filter((i) =>
        [i.name, i.shop, i.brand]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search]
  );

  const brands = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    filteredItems.forEach((i) => {
      if (!grouped[i.brand]) grouped[i.brand] = [];
      grouped[i.brand].push(i);
    });
    return grouped;
  }, [filteredItems]);

  const brandLocations = useMemo(() => {
    if (!selectedBrand) return [];
    const unique = new Map<string, Item>();
    filteredItems
      .filter((i) => i.brand === selectedBrand)
      .forEach((i) => unique.set(i.shop, i));
    return Array.from(unique.values());
  }, [selectedBrand, filteredItems]);

  const shopItems = useMemo(() => {
    if (!selectedShop) return [];
    return filteredItems.filter(
      (i) =>
        i.shop === selectedShop &&
        (shopCategory === "All" || i.type === shopCategory)
    );
  }, [selectedShop, shopCategory, filteredItems]);

  const totalPrice = useMemo(
    () => cart.reduce((sum, i) => sum + i.price, 0),
    [cart]
  );

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

  /* ================= INTERNAL COMPONENTS ================= */
  const Navbar = () => (
    <nav className="homeNavbar">
      <div className="navLeft">
        <h2 className="logo" onClick={resetView}>
          Swift2Me
        </h2>
        <ul className="navMenu">
          <li onClick={resetView}>About Us</li>
          <li onClick={() => setSelectedBrand("")}>Brands</li>
          <li onClick={resetView}>Items</li>
          <li onClick={resetView}>Drivers</li>

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
                    setShowHelp(true);
                    setShowContact(false);
                    setShowReport(false);
                  }}
                >
                  Help Center
                </div>
                <div
                  className="dropdownItem"
                  onClick={() => {
                    setShowContact(true);
                    setShowHelp(false);
                    setShowReport(false);
                  }}
                >
                  Contact Us
                </div>
                <div
                  className="dropdownItem"
                  onClick={() => {
                    setShowReport(true);
                    setShowHelp(false);
                    setShowContact(false);
                  }}
                >
                  Report an Issue
                </div>
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

        <AvatarDropdown onLogout={onLogout} onAccount={() => resetView()} />
      </div>
    </nav>
  );

  const ModalWrapper = ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );

  const HelpModal = () => (
    <ModalWrapper onClose={() => setShowHelp(false)}>
      <div className="helpContainer">
        <div className="helpHeader">
          <h1>Help & Support</h1>
        </div>
        <div className="helpContent">
          <section className="helpSection">
            <h2>Getting Started</h2>
            <p>
              Learn how to browse brands, select shops, add items to your cart,
              and place orders quickly and easily.
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
              Secure checkout with multiple payment options. All transactions
              are encrypted.
            </p>
          </section>
          <section className="helpSection">
            <h2>Contact Support</h2>
            <button
              className="contactBtn"
              onClick={() => {
                setShowContact(true);
                setShowHelp(false);
              }}
            >
              Contact Us
            </button>
          </section>
        </div>
      </div>
    </ModalWrapper>
  );

  const ContactModal = () => (
    <ModalWrapper onClose={() => setShowContact(false)}>
      <ContactUs onBack={() => setShowContact(false)} />
    </ModalWrapper>
  );
  const ReportModal = () => (
    <ModalWrapper onClose={() => setShowReport(false)}>
      <ReportIssue onBack={() => setShowReport(false)} />
    </ModalWrapper>
  );

  /* ================= RENDER ================= */
  return (
    <div className="userHome">
      <Navbar />

      {/* MAIN CONTENT */}
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

      {selectedBrand && !selectedShop && (
        <>
          <div className="brandHeader">
            <h2>{selectedBrand} Locations</h2>
            <button className="backBtn" onClick={() => setSelectedBrand(null)}>
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
                  onSelectShop={() => setSelectedShop(shop.shop)}
                />
              ))
            ) : (
              <p className="noResults">No shops found for this brand.</p>
            )}
          </div>
        </>
      )}

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
                  onAddToCart={() => addToCart(item)}
                />
              ))
            ) : (
              <p className="noResults">No items available in this category.</p>
            )}
          </div>
        </div>
      )}

      {showHelp && <HelpModal />}
      {showContact && <ContactModal />}
      {showReport && <ReportModal />}
    </div>
  );
}
