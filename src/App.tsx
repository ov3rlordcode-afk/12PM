import { useState, useRef, useEffect } from "react";
import "./App.css";
import UserHome from "./home/UserHome";
import DriverDashboard from "./user/drivers/Driver";

type Role = "Customer" | "Driver" | "Staff" | "";
type Step = 1 | 2 | 3 | 4;

interface StoredUser {
  email: string;
  role: Role;
  city?: string;
  address?: string;
}

const SCOTLAND_CITIES = [
  "Edinburgh",
  "Musselburgh",
  "Dalkeith",
  "Bonnyrigg",
  "Livingston",
  "Bathgate",
  "Linlithgow",
] as const;

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const isCustomer = role === "Customer";
  const isDriver = role === "Driver";
  const isStaff = role === "Staff";

  /* Restore session */
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;
    try {
      const user: StoredUser = JSON.parse(stored);
      setEmail(user.email);
      setRole(user.role);
      setCity(user.city ?? "");
      setAddress(user.address ?? "");
      setLoggedIn(true);
    } catch {
      localStorage.removeItem("userData");
    }
  }, []);

  /* Persist session */
  useEffect(() => {
    if (!loggedIn) return;
    const user: StoredUser = { email, role, city, address };
    localStorage.setItem("userData", JSON.stringify(user));
  }, [loggedIn, email, role, city, address]);

  /* Logout */
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
    localStorage.removeItem("userData");
  };

  /* Validation and step progression */
  const validateStep1 = () => {
    if (!email.trim() || !password.trim())
      return alert("Please enter email and password");
    if (!role) return alert("Please select a role");

    if (isDriver || isStaff) {
      // For drivers/staff: skip steps, show dashboard immediately
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setLoggedIn(true);
      }, 500);
    } else {
      // For customers, go to city selection
      setStep(2);
    }
  };

  const validateStep2 = () => {
    if (!city) return alert("Please select your city");
    setStep(3);
  };

  const validateStep3 = () => {
    if (!address.trim()) return alert("Please enter your address");
    setStep(4);
  };

  const completeSignup = () => {
    if (!agreed) return alert("You must agree to the Terms of Service");
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setLoggedIn(true);
    }, 500);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5)
      setCanCheckAgree(true);
  };

  /* Logged in view */
  if (loggedIn) {
    return (
      <div className="app">
        <div className="dashboardWrapper">
          {isCustomer && (
            <UserHome name={email} city={city} address={address} />
          )}
          {isDriver && <DriverDashboard />}
          {isStaff && (
            <div className="dashboard">
              <h1>Welcome, {email} (Staff)</h1>
            </div>
          )}
        </div>

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

  /* Login/signup steps */
  const renderCard = (content: React.ReactNode) => (
    <div className="app">
      <div className="loginCard">{content}</div>
    </div>
  );

  if (step === 1) {
    return renderCard(
      <>
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
          {(["Customer", "Driver", "Staff"] as Role[]).map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value as Role)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <button className="loginBtn" onClick={validateStep1}>
          Next
        </button>
      </>
    );
  }

  if (step === 2 && isCustomer) {
    return renderCard(
      <>
        <h1 className="logo">Choose Your City</h1>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select your city</option>
          {SCOTLAND_CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="btnRow">
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={validateStep2}>Next</button>
        </div>
      </>
    );
  }

  if (step === 3 && isCustomer) {
    return renderCard(
      <>
        <h1 className="logo">Enter Your Address</h1>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="btnRow">
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={validateStep3}>Next</button>
        </div>
      </>
    );
  }

  if (step === 4 && isCustomer) {
    return (
      <div className="app">
        <div className="termsCard">
          <h1 className="termsTitle">Terms of Service</h1>
          <div className="termsBox" ref={termsRef} onScroll={handleTermsScroll}>
            <p>Welcome to Swift2Me.</p>
            <p>Scroll to bottom to enable agreement.</p>
            <p style={{ marginTop: "600px" }}>End of Terms.</p>
          </div>

          <label className="agreeLabel">
            <input
              type="checkbox"
              checked={agreed}
              disabled={!canCheckAgree}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I agree to the Terms
          </label>

          <div className="btnRow">
            <button onClick={() => setStep(3)}>Back</button>
            <button disabled={!agreed} onClick={completeSignup}>
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
