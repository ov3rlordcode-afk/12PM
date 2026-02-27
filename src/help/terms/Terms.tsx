"use client";

import React from "react";
import "./Terms.css";

type Props = {
  onBack?: () => void;
};

export default function Terms({ onBack }: Props) {
  return (
    <div className="termsContainer">
      <div className="termsHeader">
        <h1>Terms & Conditions</h1>
        {onBack && (
          <button className="backBtn" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>

      <div className="termsContent">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Swift2Me. By accessing or using our platform, you agree
            to comply with and be bound by these Terms & Conditions. Please read
            them carefully before using our services.
          </p>
        </section>

        <section>
          <h2>2. Use of Our Services</h2>
          <p>
            You agree to use our platform only for lawful purposes. You must not
            misuse, disrupt, or attempt to gain unauthorized access to any part
            of the system.
          </p>
        </section>

        <section>
          <h2>3. Orders & Payments</h2>
          <p>
            All orders placed through Swift2Me are subject to availability and
            confirmation. Payments must be completed at checkout using approved
            payment methods.
          </p>
          <ul>
            <li>Orders may be cancelled before processing.</li>
            <li>Refunds are subject to review.</li>
            <li>Prices may change without prior notice.</li>
          </ul>
        </section>

        <section>
          <h2>4. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials. Any activity under your account is your
            responsibility.
          </p>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>
            Swift2Me is not liable for indirect, incidental, or consequential
            damages arising from the use of our services.
          </p>
        </section>

        <section>
          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Continued
            use of the platform after updates constitutes acceptance of the
            revised Terms.
          </p>
        </section>

        {/* Bottom section with solid background */}
        <section className="contactSection">
          <div className="contactBackground">
            <h2>7. Contact Information</h2>
            <p>
              If you have any questions regarding these Terms, please contact
              our support team through the Help Center.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
