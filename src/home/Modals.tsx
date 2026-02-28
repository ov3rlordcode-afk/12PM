"use client";

import React from "react";
import ContactUs from "../help/contactus";
import ReportIssue from "../help/reportissue";

export const ModalWrapper: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
}> = ({ onClose, children }) => (
  <div className="modalOverlay" onClick={onClose}>
    <div className="modalContent" onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

export const HelpModal: React.FC<{ onContact: () => void }> = ({
  onContact,
}) => (
  <div className="helpContainer">
    <div className="helpHeader">
      <h1>Help & Support</h1>
    </div>
    <div className="helpContent">
      <section className="helpSection">
        <h2>Getting Started</h2>
        <p>
          Learn how to browse brands, select shops, add items to your cart, and
          place orders quickly and easily.
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
          Secure checkout with multiple payment options. All transactions are
          encrypted.
        </p>
      </section>
      <section className="helpSection">
        <h2>Contact Support</h2>
        <button className="contactBtn" onClick={onContact}>
          Contact Us
        </button>
      </section>
    </div>
  </div>
);

export const ContactModal: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <ModalWrapper onClose={onBack}>
    <ContactUs onBack={onBack} />
  </ModalWrapper>
);

export const ReportModal: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <ModalWrapper onClose={onBack}>
    <ReportIssue onBack={onBack} />
  </ModalWrapper>
);
