"use client";

import React, { useMemo, useState, useCallback } from "react";
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

// ===================== TYPES =====================
type Props = {
  name: string;
  city: string;
  onLogout: () => void;
};

// ===================== REUSABLE COMPONENTS =====================
const DropdownMenu: React.FC<{
  items: { label: string; onClick?: () => void }[];
}> = ({ items }) => (
  <div className="dropdownMenu">
    {items.map((item) => (
      <div key={item.label} className="dropdownItem" onClick={item.onClick}>
        {item.label}
      </div>
    ))}
  </div>
);

const ModalWrapper: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
}> = ({ onClose, children }) => (
  <div className="modalOverlay" onClick={onClose}>
    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ===================== MAIN COMPONENT =====================
export default function UserHome({ name, city, onLogout }: Props) {
  // ===================== STATE =====================
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");

  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [showReportPage, setShowReportPage] = useState(false);
  const [showMyAccount, setShowMyAccount] = useState(false);

  const [cart, setCart] = useState<Item[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // ===================== MEMOIZED DATA =====================
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
    return filteredItems.reduce((acc: Record<string, Item[]>, item) => {
      if (!acc[item.brand]) acc[item.brand] = [];
      acc[item.brand].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const brandLocations = useMemo(() => {
    if (!selectedBrand) return [];
    const unique = new Map<string, Item>();
    filteredItems
      .filter((item) => item.brand === selectedBrand)
      .forEach((item) => unique.set(item.shop, item));
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

  // ===================== HANDLERS =====================
  const resetView = useCallback(() => {
    setSelectedBrand(null);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
    setShowReportPage(false);
    setShowMyAccount(false);
  }, []);

  const handleSelectBrand = useCallback((brand: string) => {
    setSelectedBrand(brand);
    setSelectedShop(null);
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
    setShowReportPage(false);
  }, []);

  const handleSelectShop = useCallback((shop: string) => {
    setSelectedShop(shop);
    setShopCategory("All");
    setSearch("");
    setShowHelpCenter(false);
    setShowContactPage(false);
    setShowReportPage(false);
  }, []);

  const addToCart = useCallback((item: Item) => {
    setCart((prev) => [...prev, item]);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const placeOrder = useCallback(() => {
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
  }, [cart, city, name, totalPrice]);

  // ===================== DROPDOWN ITEMS =====================
  const ordersDropdownItems = [
    { label: "Pending Orders" },
    { label: "Completed Orders" },
    { label: "Cancelled Orders" },
  ];

  const supportDropdownItems = [
    {
      label: "Help Center",
      onClick: () => {
        setShowHelpCenter(true);
        setShowContactPage(false);
        setShowReportPage(false);
      },
    },
    {
      label: "Contact Us",
      onClick: () => {
        setShowContactPage(true);
        setShowHelpCenter(false);
        setShowReportPage(false);
      },
    },
    {
      label: "Report an Issue",
      onClick: () => {
        setShowReportPage(true);
        setShowHelpCenter(false);
        setShowContactPage(false);
      },
    },
    { label: "FAQs" },
  ];

  // ===================== RENDER =====================
  return (
    <div className="userHome">
      <div className="boxedContainer">
        {/* NAVBAR */}
        <nav className="homeNavbar">
          <div className="navLeft">
            <h2 className="logo" onClick={resetView}>
              Swift2Me
            </h2>
            <ul className="navMenu">
              <li onClick={resetView}>About Us</li>
              <li onClick={() => handleSelectBrand("")}>Brands</li>
              <li onClick={resetView}>Items</li>
              <li onClick={resetView}>Drivers</li>

              <li
                className="navItem"
                onMouseEnter={() => setOrdersDropdownOpen(true)}
                onMouseLeave={() => setOrdersDropdownOpen(false)}
              >
                Orders
                {ordersDropdownOpen && (
                  <DropdownMenu items={ordersDropdownItems} />
                )}
              </li>

              <li
                className="navItem"
                onMouseEnter={() => setSupportDropdownOpen(true)}
                onMouseLeave={() => setSupportDropdownOpen(false)}
              >
                Support
                {supportDropdownOpen && (
                  <DropdownMenu items={supportDropdownItems} />
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

            <AvatarDropdown
              onLogout={onLogout}
              onAccount={() => {
                setShowMyAccount(true);
                setShowHelpCenter(false);
                setShowContactPage(false);
                setShowReportPage(false);
                setSelectedBrand(null);
                setSelectedShop(null);
              }}
            />
          </div>
        </nav>

        {/* MAIN CONTENT */}
        {!selectedBrand &&
          !selectedShop &&
          !showHelpCenter &&
          !showContactPage &&
          !showReportPage && (
            <div className="itemsGrid">
              {Object.entries(brands).length ? (
                Object.entries(brands).map(([brandName, items]) => (
                  <BrandCard
                    key={brandName}
                    brandName={brandName}
                    items={items}
                    onViewBrand={() => handleSelectBrand(brandName)}
                  />
                ))
              ) : (
                <p className="noResults">No brands found.</p>
              )}
            </div>
          )}

        {/* BRAND LOCATIONS */}
        {selectedBrand &&
          !selectedShop &&
          !showHelpCenter &&
          !showContactPage &&
          !showReportPage && (
            <>
              <div className="brandHeader">
                <h2>{selectedBrand} Locations</h2>
                <button className="backBtn" onClick={resetView}>
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
                      onSelectShop={() => handleSelectShop(shop.shop)}
                    />
                  ))
                ) : (
                  <p className="noResults">No shops found for this brand.</p>
                )}
              </div>
            </>
          )}

        {/* SHOP MENU */}
        {selectedShop &&
          !showHelpCenter &&
          !showContactPage &&
          !showReportPage && (
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

        {/* MODALS */}
        {showHelpCenter && (
          <ModalWrapper onClose={() => setShowHelpCenter(false)}>
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
                    Secure checkout with multiple payment options. All
                    transactions are encrypted.
                  </p>
                </section>
                <section className="helpSection">
                  <h2>Contact Support</h2>
                  <p>
                    Still need help? Reach out to our support team and we’ll
                    respond ASAP.
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
          </ModalWrapper>
        )}

        {showContactPage && (
          <ModalWrapper onClose={() => setShowContactPage(false)}>
            <ContactUs onBack={() => setShowContactPage(false)} />
          </ModalWrapper>
        )}
        {showReportPage && (
          <ModalWrapper onClose={() => setShowReportPage(false)}>
            <ReportIssue onBack={() => setShowReportPage(false)} />
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}
