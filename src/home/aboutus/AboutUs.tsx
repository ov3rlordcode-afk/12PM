import React from "react";
import "./AboutUs.css";

export default function AboutUs() {
  return (
    <div className="aboutPage">
      <div className="aboutContainer">
        <h1>About Swift2Me</h1>

        <p>
          Swift2Me is a fast and reliable delivery platform connecting customers
          with their favorite brands, stores, and drivers.
        </p>

        <section className="aboutSection">
          <h2>Our Mission</h2>
          <p>
            Our mission is to make shopping and delivery simple, fast, and
            accessible for everyone.
          </p>
        </section>

        <section className="aboutSection">
          <h2>What We Offer</h2>
          <ul>
            <li>Seamless brand browsing</li>
            <li>Real-time order tracking</li>
            <li>Secure checkout experience</li>
            <li>Reliable delivery partners</li>
          </ul>
        </section>

        <section className="aboutSection">
          <h2>Our Vision</h2>
          <p>
            To become the most trusted and innovative delivery platform in every
            city we serve.
          </p>
        </section>
      </div>
    </div>
  );
}
