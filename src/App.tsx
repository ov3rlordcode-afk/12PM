import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Customer delivery
  const [city, setCity] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Terms
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

  // ---------------- LOGIN ----------------
  const handleLogin = () => {
    if (email && password && role) {
      setLoggedIn(true);
    } else {
      alert("Please enter email, password and select role");
    }
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = () => {
    if (!email || !password) return alert("Please enter email and password");
    if (!role) return alert("Please select a role");
    if (!agreed) return alert("You must agree to the Terms of Service");

    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      alert(`Signed up as ${role}! You can now login.`);
      setIsSignup(false);
      setEmail("");
      setPassword("");
      setRole("");
      setShowTerms(false);
      setAgreed(false);
    }, 2000);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setCanCheckAgree(true);
    }
  };

  // ---------------- ROLE THEMES ----------------
  const bgGradient =
    role === "Customer"
      ? "linear-gradient(135deg, #ff5f6d, #ffc371)"
      : role === "Driver"
      ? "linear-gradient(135deg, #4facfe, #00f2fe)"
      : role === "Staff"
      ? "linear-gradient(135deg, #43e97b, #38f9d7)"
      : role === "Store"
      ? "linear-gradient(135deg, #fa709a, #fee140)"
      : "linear-gradient(135deg, #667eea, #764ba2)";

  const floatingIcons =
    role === "Customer"
      ? ["🍔", "🍕", "🍣", "🥗"]
      : role === "Driver"
      ? ["🚗", "🛵", "🚚", "🚕"]
      : role === "Staff"
      ? ["📦", "🧾", "📊", "💼"]
      : role === "Store"
      ? ["🏪", "🛒", "🍽️", "📋"]
      : [];

  const confettiColors =
    role === "Customer"
      ? ["#FF6B6B", "#FFD93D", "#FF9F1C", "#FF5F6D"]
      : role === "Driver"
      ? ["#4facfe", "#00f2fe", "#6dd5ed", "#00c3ff"]
      : role === "Staff"
      ? ["#43e97b", "#38f9d7", "#2af598", "#009efd"]
      : role === "Store"
      ? ["#fa709a", "#fee140", "#f093fb", "#f5576c"]
      : ["#667eea", "#764ba2"];

  // ---------------- DASHBOARD ----------------
  if (loggedIn) {
    return (
      <div className="app" style={{ background: bgGradient }}>
        <div className="dashboard">
          <h1>
            Welcome, {email}!{" "}
            {role === "Customer"
              ? "🍕"
              : role === "Driver"
              ? "🚗"
              : role === "Staff"
              ? "📦"
              : "🏪"}
          </h1>

          <p>
            {role === "Customer" &&
              "Select your city and delivery location to start ordering!"}
            {role === "Driver" && "View delivery requests and start earning!"}
            {role === "Staff" && "Manage orders and monitor system activity."}
            {role === "Store" && "Manage your store, menu and incoming orders."}
          </p>

          {/* CUSTOMER DELIVERY */}
          {role === "Customer" && (
            <div className="deliverySection">
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Select a city</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />

              {city && deliveryAddress && (
                <div className="mapPlaceholder">
                  Delivering to <strong>{deliveryAddress}</strong> in{" "}
                  <strong>{city}</strong>
                </div>
              )}
            </div>
          )}

          {/* FLOATING ICONS */}
          <div className="floatingIcons">
            {floatingIcons.map((icon, i) => (
              <span key={i} className="floatIcon">
                {icon}
              </span>
            ))}
          </div>

          <button
            className="logoutBtn"
            onClick={() => {
              setLoggedIn(false);
              setEmail("");
              setPassword("");
              setRole("");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ---------------- TERMS PAGE ----------------
  if (showTerms) {
    return (
      <div className="app">
        <div className="loginCard termsCard">
          <h2>Terms of Service</h2>

          <div className="termsBox" ref={termsRef} onScroll={handleTermsScroll}>
            <p>
              Welcome to SwiftEats. By signing up, you agree to follow all
              platform rules, policies, and guidelines.
            </p>
            <p>
              Users must provide accurate information. Drivers must deliver
              responsibly. Staff and Store accounts must manage operations
              professionally.
            </p>
            <p>
              Continued usage of this platform means you accept all terms and
              future updates.
            </p>
            <p>Scroll to the bottom to enable agreement checkbox.</p>
          </div>

          <label>
            <input
              type="checkbox"
              disabled={!canCheckAgree}
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the Terms of Service
          </label>

          <button disabled={!agreed} onClick={handleSignup}>
            Complete Sign Up
          </button>
        </div>
      </div>
    );
  }

  // ---------------- LOGIN / SIGNUP PAGE ----------------
  return (
    <div className="app">
      {showConfetti && (
        <div className="confetti">
          {Array.from({ length: 80 }).map((_, i) => (
            <span
              key={i}
              className="confettiPiece"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
              }}
            ></span>
          ))}
        </div>
      )}

      <div className="loginCard">
        <h1>SwiftEats</h1>
        <p>{isSignup ? "Create your account" : "Login to continue"}</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ROLE SELECTION FOR BOTH LOGIN & SIGNUP */}
        <div className="roleSelection">
          {["Customer", "Driver", "Staff", "Store"].map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <button
          onClick={() => {
            if (isSignup) {
              if (!email || !password || !role) return alert("Fill all fields");
              setShowTerms(true);
            } else {
              handleLogin();
            }
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}
