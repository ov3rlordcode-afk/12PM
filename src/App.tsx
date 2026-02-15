import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [city, setCity] = useState("");
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
    if (role === "Customer" && !city)
      return alert("Please select your city (Scotland only)");
    setStep(3);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setCanCheckAgree(true);
    }
  };

  const handleStep3 = () => {
    if (!agreed) return alert("You must agree to the Terms of Service");
    setStep(4);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      setLoggedIn(true);
    }, 2500);
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setCity("");
    setAgreed(false);
    setCanCheckAgree(false);
    setLoggedIn(false);
    setStep(1);
  };

  // ---------- RENDER ----------

  if (loggedIn) {
    return (
      <div className="app">
        <div className="dashboard">
          <h1>🎉 Welcome, {email}!</h1>
          <p>
            Role: <strong>{role}</strong>
          </p>
          {role === "Customer" && (
            <p>
              City: <strong>{city}</strong>
            </p>
          )}

          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>

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

  // ---------- Step 1: Email / Password + Role ----------
  if (step === 1) {
    return (
      <div className="app">
        <div className="loginCard">
          <h1 className="logo">SwiftEats</h1>
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

          <button className="loginBtn" onClick={handleStep1}>
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 2: City (Customer Only) ----------
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

          <button className="loginBtn" onClick={handleStep2}>
            Next
          </button>
        </div>
      </div>
    );
  }

  // ---------- Step 2: Skip City for Non-Customers ----------
  if (step === 2 && role !== "Customer") setStep(3);

  // ---------- STEP 3: TERMS ----------
  if (step === 3) {
    return (
      <div className="app">
        <div className="termsCard">
          <h1 className="termsTitle">Terms of Service</h1>

          <div
            className="termsBox"
            ref={termsRef}
            onScroll={() => {
              if (termsRef.current) {
                const { scrollTop, scrollHeight, clientHeight } =
                  termsRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                  setCanCheckAgree(true);
                }
              }
            }}
          >
            <p>
              Welcome to <strong>SwiftEats</strong>! By signing up, you agree to
              our terms and conditions.
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

          <button className="loginBtn" disabled={!agreed} onClick={handleStep3}>
            Accept & Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
