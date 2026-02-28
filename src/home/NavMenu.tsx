"use client";

import React, { useState } from "react";
import Cart from "./components/cart/Cart";
import AvatarDropdown from "./components/AvatarDropdown";
import "./NavMenu.css"; // reuse or create styles

type NavMenuProps = {
  name: string;
  city: string;
  onLogout: () => void;
  search: string;
  setSearch: (value: string) => void;
  cart: any[]; // replace with Item[] if imported
  setCart: (items: any[]) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  placeOrder: () => void;
  totalPrice: number;
  orderSuccess: boolean;
  setOrderSuccess: (value: boolean) => void;
  goHome: () => void;
  selectBrand: (brand: string) => void;
  setShowHelpCenter: (value: boolean) => void;
  setShowContactPage: (value: boolean) => void;
  setShowReportPage: (value: boolean) => void;
  setShowMyAccount: (value: boolean) => void;
};

export default function NavMenu({
  name,
  city,
  onLogout,
  search,
  setSearch,
  cart,
  setCart,
  cartOpen,
  setCartOpen,
  placeOrder,
  totalPrice,
  orderSuccess,
  setOrderSuccess,
  goHome,
  selectBrand,
  setShowHelpCenter,
  setShowContactPage,
  setShowReportPage,
  setShowMyAccount,
}: NavMenuProps) {
  const [ordersDropdownOpen, setOrdersDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);

  return (
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
                    setShowContactPage(false);
                    setShowReportPage(false);
                  }}
                >
                  Help Center
                </div>
                <div
                  className="dropdownItem"
                  onClick={() => {
                    setShowContactPage(true);
                    setShowHelpCenter(false);
                    setShowReportPage(false);
                  }}
                >
                  Contact Us
                </div>
                <div
                  className="dropdownItem"
                  onClick={() => {
                    setShowReportPage(true);
                    setShowHelpCenter(false);
                    setShowContactPage(false);
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
          removeFromCart={(index) =>
            setCart((prev) => prev.filter((_, i) => i !== index))
          }
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
          }}
        />
      </div>
    </nav>
  );
}
