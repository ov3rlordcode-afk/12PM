"use client";

import React, { useState } from "react";
import {
  FaShoppingCart,
  FaClipboardList,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";

type HelpPageProps = { onBack: () => void };

const helpSections = [
  {
    title: "Getting Started",
    icon: <FaShoppingCart />,
    content:
      "Learn how to browse restaurants, select meals, add items to your cart, and place orders quickly and easily.",
  },
  {
    title: "Orders",
    icon: <FaClipboardList />,
    content: (
      <ul>
        <li>Track pending orders</li>
        <li>View order history</li>
        <li>Cancel or modify orders</li>
      </ul>
    ),
  },
  {
    title: "Payments",
    icon: <FaCreditCard />,
    content:
      "Enjoy a secure checkout with multiple payment methods. All transactions are encrypted for your safety.",
  },
  {
    title: "Contact Support",
    icon: <FaHeadset />,
    content:
      "Still need help? Our support team is ready to assist you with any questions or issues.",
    button: "Contact Us",
  },
];

export default function HelpPage({ onBack }: HelpPageProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="helpPageVertical">
      {/* Header */}
      <header className="helpHeaderVertical">
        <h1>Help & Support</h1>
        <button className="backBtn" onClick={onBack}>
          ← Back
        </button>
      </header>

      {/* Hero Section */}
      <section className="helpHero">
        <p className="heroText">
          Find answers quickly or contact our support team.
        </p>
      </section>

      {/* Sections */}
      <main className="helpSectionsVertical">
        {helpSections.map((section, idx) => (
          <div key={idx} className="helpCardVertical">
            <div className="helpCardIcon">{section.icon}</div>
            <div className="helpCardContentVertical">
              <h2>{section.title}</h2>
              <div>{section.content}</div>
              {section.button && (
                <button
                  className="contactBtn"
                  onClick={() => setShowModal(true)}
                >
                  {section.button}
                </button>
              )}
            </div>
          </div>
        ))}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modalOverlay" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2>Contact Support</h2>
            <p>Fill out the form and we’ll get back to you ASAP.</p>
            <form className="contactForm">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required />
              <button type="submit">Send Message</button>
            </form>
            <button className="modalClose" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
