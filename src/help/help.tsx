"use client";

import React, { useState } from "react";
import {
  FaUser,
  FaClipboardList,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

// Page Components
function MyAccount() {
  return (
    <div>
      <h2>My Account</h2>
      <p>Update your profile, change password, manage settings.</p>
    </div>
  );
}

function Orders() {
  return (
    <div>
      <h2>Orders</h2>
      <ul>
        <li>Track pending orders</li>
        <li>View order history</li>
        <li>Cancel or modify orders</li>
      </ul>
    </div>
  );
}

function Payments() {
  return (
    <div>
      <h2>Payments</h2>
      <p>Manage payment methods and view transaction history.</p>
    </div>
  );
}

function Support() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <h2>Support</h2>
      <p>Contact our support team if you need assistance.</p>
      <button onClick={() => setShowModal(true)}>Contact Us</button>

      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Contact Support</h3>
            <form className="contactForm">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required />
              <button type="submit">Send Message</button>
            </form>
            <button onClick={() => setShowModal(false)}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App / Dashboard
export default function Dashboard() {
  const [activePage, setActivePage] = useState<
    "account" | "orders" | "payments" | "support"
  >("account");

  const renderPage = () => {
    switch (activePage) {
      case "account":
        return <MyAccount />;
      case "orders":
        return <Orders />;
      case "payments":
        return <Payments />;
      case "support":
        return <Support />;
    }
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h1>Dashboard</h1>
        <ul>
          <li onClick={() => setActivePage("account")}>
            <FaUser /> My Account
          </li>
          <li onClick={() => setActivePage("orders")}>
            <FaClipboardList /> Orders
          </li>
          <li onClick={() => setActivePage("payments")}>
            <FaCreditCard /> Payments
          </li>
          <li onClick={() => setActivePage("support")}>
            <FaHeadset /> Support
          </li>
        </ul>
      </nav>
      <main className="pageContent">{renderPage()}</main>
    </div>
  );
}
