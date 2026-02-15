import { useState } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Customer or Driver
  const [isSignup, setIsSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleLogin = () => {
    if (email && password) setLoggedIn(true);
    else alert("Please enter email and password");
  };

  const handleSignup = () => {
    if (!email || !password) return alert("Please enter email and password");
    if (!role) return alert("Please select a role");

    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      alert(`Signed up as ${role}! You can now login.`);
      setIsSignup(false);
      setEmail("");
      setPassword("");
      setRole("");
    }, 3000);
  };

  const bgGradient =
    role === "Customer"
      ? "linear-gradient(135deg, #ff5f6d, #ffc371)"
      : "linear-gradient(135deg, #4facfe, #00f2fe)";

  const floatingIcons =
    role === "Customer" ? ["🍔", "🍕", "🍣", "🥗"] : ["🚗", "🛵", "🚚", "🚕"];

  const confettiColors =
    role === "Customer"
      ? ["#FF6B6B", "#FFD93D", "#FF9F1C", "#FF5F6D"]
      : ["#4facfe", "#00f2fe", "#6dd5ed", "#00c3ff"];

  return loggedIn ? (
    <div className="app" style={{ background: bgGradient }}>
      {/* Particle background */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              "--i": i,
              backgroundColor: confettiColors[i % confettiColors.length],
            }}
          ></span>
        ))}
      </div>

      <div className="dashboard">
        <h1>
          Welcome, {email}! {role === "Customer" ? "🍕" : "🚗"}
        </h1>
        <p>
          {role === "Customer"
            ? "Start ordering your favorite meals!"
            : "Time to deliver orders and make people happy!"}
        </p>

        {/* Floating role icons */}
        <div className="floatingIcons">
          {floatingIcons.map((icon, i) => (
            <span key={i} className="floatIcon">
              {icon}
            </span>
          ))}
        </div>

        <button className="logoutBtn" onClick={() => setLoggedIn(false)}>
          Logout
        </button>
      </div>
    </div>
  ) : (
    <div className="app">
      {/* Confetti on signup */}
      {showConfetti && (
        <div className="confetti">
          {Array.from({ length: 100 }).map((_, i) => (
            <span
              key={i}
              className="confettiPiece"
              style={{
                backgroundColor: confettiColors[i % confettiColors.length],
                "--i": i,
              }}
            ></span>
          ))}
        </div>
      )}

      <div className="loginCard">
        <h1 className="logo">SwiftEats</h1>
        <p className="subtitle">
          {isSignup ? "Create your account" : "Sign in to continue"}
        </p>

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

        {isSignup && (
          <div className="roleSelection">
            <label>
              <input
                type="radio"
                name="role"
                value="Customer"
                checked={role === "Customer"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>Customer</span>
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Driver"
                checked={role === "Driver"}
                onChange={(e) => setRole(e.target.value)}
              />
              <span>Driver</span>
            </label>
          </div>
        )}

        <button
          className="loginBtn"
          onClick={isSignup ? handleSignup : handleLogin}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="signupText">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span className="signupLink" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>

      <div className="bgCircle circle1"></div>
      <div className="bgCircle circle2"></div>
      <div className="bgCircle circle3"></div>
    </div>
  );
}
