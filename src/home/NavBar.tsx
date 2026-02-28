"use client";

import React from "react";
import Cart from "./components/cart/Cart";
import AvatarDropdown from "./components/AvatarDropdown";
import { DropdownMenu } from "./DropdownMenu";

type Props = {
  search: string;
  setSearch: (val: string) => void;
  ordersDropdownOpen: boolean;
  setOrdersDropdownOpen: (val: boolean) => void;
  supportDropdownOpen: boolean;
  setSupportDropdownOpen: (val: boolean) => void;
  onResetView: () => void;
  onAccount: () => void;
  cart: any[];
  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;
  removeFromCart: (index: number) => void;
  placeOrder: () => void;
  totalPrice: number;
  orderSuccess: boolean;
  setOrderSuccess: (val: boolean) => void;
};

export default function Navbar({
  search,
  setSearch,
  ordersDropdownOpen,
  setOrdersDropdownOpen,
  supportDropdownOpen,
  setSupportDropdownOpen,
  onResetView,
  onAccount,
  cart,
  cartOpen,
  setCartOpen,
  removeFromCart,
  placeOrder,
  totalPrice,
  orderSuccess,
  setOrderSuccess,
}: Props) {
  const ordersDropdownItems = [
    { label: "Pending Orders" },
    { label: "Completed Orders" },
    { label: "Cancelled Orders" },
  ];

  const supportDropdownItems = [
    { label: "Help Center" },
    { label: "Contact Us" },
    { label: "Report an Issue" },
    { label: "FAQs" },
  ];

  return (
    <nav className="homeNavbar">
      <div className="navLeft">
        <h2 className="logo" onClick={onResetView}>
          Swift2Me
        </h2>
        <ul className="navMenu">
          <li onClick={onResetView}>About Us</li>
          <li onClick={onResetView}>Brands</li>
          <li onClick={onResetView}>Items</li>
          <li onClick={onResetView}>Drivers</li>

          <li
            className="navItem"
            onMouseEnter={() => setOrdersDropdownOpen(true)}
            onMouseLeave={() => setOrdersDropdownOpen(false)}
          >
            Orders
            {ordersDropdownOpen && <DropdownMenu items={ordersDropdownItems} />}
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

        <AvatarDropdown onLogout={onResetView} onAccount={onAccount} />
      </div>
    </nav>
  );
}
