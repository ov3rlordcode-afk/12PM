"use client";

import React from "react";
import "./help.css";

type HelpPageProps = {
  onBack: () => void;
};

export default function HelpPage({ onBack }: HelpPageProps) {
  return (
    <div className="helpPage">
      {/* Header */}
      <header className="helpHeader">
        <div className="helpHeaderContent">
          <h1>Help & Support</h1>
          <p>
            Find answers to common questions, get support, or contact our team.
          </p>
          <button className="backBtn" onClick={onBack}>
            ← Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="helpContent">
        <div className="helpSections">
          <section className="helpCard">
            <h2>Getting Started</h2>
            <p>
              Learn how to browse brands, select shops, add items to your cart,
              and place orders quickly and easily.
            </p>
          </section>

          <section className="helpCard">
            <h2>Orders</h2>
            <ul>
              <li>Track pending orders</li>
              <li>View completed orders</li>
              <li>Cancel an order</li>
            </ul>
          </section>

          <section className="helpCard">
            <h2>Payments</h2>
            <p>
              We support secure checkout and multiple payment methods. All
              transactions are encrypted for your safety.
            </p>
          </section>

          <section className="helpCard">
            <h2>Contact Support</h2>
            <p>
              Still need help? Reach out to our support team and we’ll respond
              as soon as possible.
            </p>
            <button className="contactBtn">Contact Us</button>
          </section>
        </div>
      </main>
    </div>
  );
}
