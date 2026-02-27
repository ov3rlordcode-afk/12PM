"use client";

import React, { useState } from "react";

type ContactUsProps = {
  onBack: () => void;
};

export default function ContactUs({ onBack }: ContactUsProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contactPage">
      {/* Header */}
      <header className="helpHeaderVertical">
        <h1>Contact Us</h1>
        <button className="backBtn" onClick={onBack}>
          ← Back
        </button>
      </header>

      {/* Hero */}
      <section className="helpHero">
        <p className="heroText">
          Have a question or need help? Fill out the form below and we’ll get
          back to you ASAP.
        </p>
      </section>

      {/* Form */}
      <main className="contactFormContainer">
        {submitted ? (
          <div className="successMessage">
            <h2>Thank you!</h2>
            <p>
              Your message has been sent successfully. We will contact you soon.
            </p>
          </div>
        ) : (
          <form className="contactForm" onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required />
            <button type="submit">Send Message</button>
          </form>
        )}
      </main>

      {/* Removed flashy/spinner background */}
    </div>
  );
}
