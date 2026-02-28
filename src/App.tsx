import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./help/help.css";

import Header from "./Header";
import UserHome from "./home/UserHome";
import DriverDashboard from "./client/drivers/Driver";
import OperatorDashboard from "./client/operator/operator";
import DriverSteps from "./steps/driverssteps";
import UserSteps from "./steps/usersteps";

type Role = "Customer" | "Driver" | "Operator" | "";
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7; // <-- added new steps

interface StoredUser {
  email: string;
  role: Role;
  city?: string;
  address?: string;
  license?: string;
  vehicleType?: string;
  vehicleInfo?: string;
  licensePhoto?: string;
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

  const [license, setLicense] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);

  const [agreed, setAgreed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const isCustomer = role === "Customer";
  const isDriver = role === "Driver";
  const isOperator = role === "Operator";

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
      setLicense(user.license ?? "");
      setVehicleType(user.vehicleType ?? "");
      setVehicleInfo(user.vehicleInfo ?? "");
      setLoggedIn(true);
    } catch {
      localStorage.removeItem("userData");
    }
  }, []);

  /* Persist session */
  useEffect(() => {
    if (!loggedIn) return;
    const user: StoredUser = {
      email,
      role,
      city,
      address,
      license,
      vehicleType,
      vehicleInfo,
      licensePhoto: licensePhoto ? licensePhoto.name : undefined,
    };
    localStorage.setItem("userData", JSON.stringify(user));
  }, [
    loggedIn,
    email,
    role,
    city,
    address,
    license,
    vehicleType,
    vehicleInfo,
    licensePhoto,
  ]);

  /* Login */
  const handleLogin = () => {
    if (!email.trim() || !password.trim())
      return alert("Please enter email and password");

    const stored = localStorage.getItem("userData");
    if (!stored) return alert("No account found. Please sign up.");

    try {
      const user: StoredUser = JSON.parse(stored);
      if (user.email !== email) return alert("Account not found.");

      setRole(user.role);
      setCity(user.city ?? "");
      setAddress(user.address ?? "");
      setLicense(user.license ?? "");
      setVehicleType(user.vehicleType ?? "");
      setVehicleInfo(user.vehicleInfo ?? "");
      setLoggedIn(true);
    } catch {
      alert("Error logging in.");
    }
  };

  /* Logout */
  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setRole("");
    setCity("");
    setAddress("");
    setLicense("");
    setVehicleType("");
    setVehicleInfo("");
    setLicensePhoto(null);
    setAgreed(false);
    setCanCheckAgree(false);
    setLoggedIn(false);
    setStep(1);
    localStorage.removeItem("userData");
  };

  /* Step Validations */
  const validateStep1 = () => {
    if (!email.trim() || !password.trim())
      return alert("Enter email and password");

    if (!role) return alert("Select a role");

    if (
      (isDriver || isOperator) &&
      !/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
    ) {
      return alert("Password must be 8+ chars, include uppercase & number");
    }

    setStep(2);
  };

  const validateStep2 = () => {
    if (isCustomer && !city) return alert("Select your city");
    if (isDriver && !license.trim())
      return alert("Enter your driving license number");
    setStep(3);
  };

  const validateStep3 = () => {
    if (isCustomer && !address.trim()) return alert("Enter your address");

    if (isDriver) {
      if (!vehicleType) return alert("Select vehicle type");
      if (!vehicleInfo.trim()) return alert("Enter vehicle info");
      if (!licensePhoto) return alert("Upload photo of driving license");
    }

    // Operator doesn't need extra info, skip
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

  const renderCard = (content: React.ReactNode) => (
    <div className="app">
      <div className="loginCard">{content}</div>
    </div>
  );

  /* Logged in view */
  if (loggedIn) {
    return (
      <div className="app">
        <div className="dashboardWrapper">
          {isCustomer && (
            <UserHome name={email} city={city} address={address} />
          )}
          {isDriver && (
            <DriverDashboard
              name={email}
              license={license}
              vehicleType={vehicleType}
              vehicleInfo={vehicleInfo}
            />
          )}
          {isOperator && <OperatorDashboard />}
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

  /* Step 1 (Header) */
  if (step === 1) {
    return renderCard(
      <Header
        email={email}
        password={password}
        role={role}
        isLoginMode={isLoginMode}
        setEmail={setEmail}
        setPassword={setPassword}
        setRole={setRole}
        handleLogin={handleLogin}
        validateStep1={validateStep1}
      />
    );
  }

  /* Steps 2–6 for Customers */
  if (isCustomer && step >= 2 && step <= 6) {
    return renderCard(
      <UserSteps
        step={step}
        city={city}
        address={address}
        setStep={setStep}
        setCity={setCity}
        setAddress={setAddress}
        validateStep2={validateStep2}
        validateStep3={validateStep3}
        validateStep4={() => setStep(5)}
        validateStep5={() => setStep(6)}
        SCOTLAND_CITIES={SCOTLAND_CITIES}
      />
    );
  }

  /* Steps 2–3 for Drivers or Operators */
  if ((isDriver || isOperator) && (step === 2 || step === 3)) {
    return renderCard(
      <DriverSteps
        step={step}
        license={license}
        vehicleType={vehicleType}
        vehicleInfo={vehicleInfo}
        licensePhoto={licensePhoto}
        setStep={setStep}
        setLicense={setLicense}
        setVehicleType={setVehicleType}
        setVehicleInfo={setVehicleInfo}
        setLicensePhoto={setLicensePhoto}
        validateStep2={validateStep2}
        validateStep3={validateStep3}
      />
    );
  }

  /* Step 7: Terms for everyone */
  if (step === 7) {
    return renderCard(
      <>
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
          <button onClick={() => setStep(6)}>Back</button>
          <button disabled={!agreed} onClick={completeSignup}>
            Accept & Continue
          </button>
        </div>
      </>
    );
  }

  return null;
}
