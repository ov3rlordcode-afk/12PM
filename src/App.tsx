import { useState, useRef } from "react";
import "./App.css";
import UserHome from "./home/UserHome"; // Customer homepage
import DriverDashboard from "./user/drivers/Driver"; // Driver dashboard

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const scotlandCities = [
    "Edinburgh",
    "Musselburgh",
    "Dalkeith",
    "Bonnyrigg",
    "Livingston",
    "Bathgate",
    "Linlithgow",
  ];

  // ---------- HANDLERS ----------
  const handleStep1 = () => {
    if (!email || !password) return alert("Please enter email and password");
    if (!role) return alert("Please select a role");
    setStep(2);
  };

  const handleStep2 = () => {
    if (role === "Customer" && !city) return alert("Please select your city");
    if (role === "Customer") {
      setStep(3); // Go to address
      return;
    }
    setStep(4); // Non-Customer goes to Terms
  };

  const handleStep3 = () => {
    if (!address) return alert("Please enter your address");
    setStep(4); // Go to Terms
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setCanCheckAgree(true);
    }
  };

  const handleStep4 = () => {
    if (!agreed) return alert("You must agree to the Terms of Service");
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setLoggedIn(true);
    }, 1000);
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setCity("");
    setAddress("");
    setAgreed(false);
    setCanCheckAgree(false);
    setLoggedIn(false);
    setStep(1);
  };

  // ---------- RENDER ----------

  // Logged-in views
  if (loggedIn && role === "Customer") {
    return (
      <div className="app">
        <UserHome name={email} city={city} address={address} />
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
        {showConfetti && (
          <div className="confetti">
            {Array.from({ length: 100 }).map((_, i) => (
              <span
                key={i}
                className="confettiPiece"
                style={{ "--i": i } as any}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loggedIn && role === "Driver") {
    return (
      <div className="app">
        <DriverDashboard />
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  if (loggedIn && role === "Staff") {
    return (
      <div className="app">
        <div className="dashboard">
          <h1>Welcome, {email} (Staff)</h1>
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 1: Email + Role ----------
  if (step === 1) {
    return (
      <div className="app">
        <div className="loginCard">
          <h1 className="logo">Swift2Me</h1>
          <p className="subtitle">
            Enter your email, password, and select a role
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
          <div className="roleSelection">
            {["Customer", "Driver", "Staff"].map((r) => (
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
          <button className="loginBtn" onClick={handleStep1}>
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 2: City (Customer) ----------
  if (step === 2 && role === "Customer") {
    return (
      <div className="app">
        <div className="loginCard">
          <h1 className="logo">Choose Your City</h1>
          <p className="subtitle">Only Midlothian / West Lothian cities</p>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select your city</option>
            {scotlandCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="loginBtn" onClick={() => setStep(1)}>
              Back
            </button>
            <button className="loginBtn" onClick={handleStep2}>
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 3: Address (Customer) ----------
  if (step === 3 && role === "Customer") {
    return (
      <div className="app">
        <div className="loginCard">
          <h1 className="logo">Enter Your Address</h1>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="loginBtn" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="loginBtn" onClick={handleStep3}>
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Step 4: Terms ----------
  if (step === 4) {
    return (
      <div className="app">
        <div className="termsCard">
          <h1 className="termsTitle">Terms of Service</h1>
          <div
            className="termsBox"
            ref={termsRef}
            onScroll={() => {
              const el = termsRef.current;
              if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5)
                setCanCheckAgree(true);
            }}
          >
            <p>
              Welcome to <strong>SwiftEats</strong>! By signing up, you agree to
              our terms.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec
              felis nec nisl fermentum fermentum.
            </p>
            <p>
              Curabitur auctor, justo at tincidunt luctus, lectus lorem porta
              erat, at sollicitudin nisl nisl at elit.
            </p>
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Pellentesque habitant morbi tristique
              senectus et netus et malesuada fames ac turpis egestas.
            </p>
            <p>
              Add more content here so the user must scroll to the bottom before
              enabling the checkbox.
            </p>
          </div>
          <label className="agreeLabel">
            <input
              type="checkbox"
              checked={agreed}
              disabled={!canCheckAgree}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I have read and agree to the Terms of Service
          </label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              className="loginBtn"
              onClick={() => setStep(role === "Customer" ? 3 : 2)}
            >
              Back
            </button>
            <button
              className="loginBtn"
              disabled={!agreed}
              onClick={handleStep4}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
