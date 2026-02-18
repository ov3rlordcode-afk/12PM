import { useState, useEffect } from "react";
import "./App.css";
import UserHome from "./home/UserHome";
import DriverDashboard from "./user/drivers/Driver";
import Drivesteps from "./steps/drivesteps";
import UserSteps from "./steps/usersteps";

type Role = "Customer" | "Driver" | "";
type Step = 1 | 2;

interface StoredUser {
  email: string;
  role: Role;
  city?: string;
  address?: string;
  license?: string;
  vehicleType?: string;
  vehicleInfo?: string;
}

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [step, setStep] = useState<Step>(1);

  // Customer fields
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  // Driver fields
  const [license, setLicense] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const isCustomer = role === "Customer";
  const isDriver = role === "Driver";

  /* Restore session */
  useEffect(() => {
    const stored = localStorage.getItem("userData");
    if (!stored) return;
    const user: StoredUser = JSON.parse(stored);
    setEmail(user.email);
    setRole(user.role);
    setCity(user.city ?? "");
    setAddress(user.address ?? "");
    setLicense(user.license ?? "");
    setVehicleType(user.vehicleType ?? "");
    setVehicleInfo(user.vehicleInfo ?? "");
    setLoggedIn(true);
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
    };
    localStorage.setItem("userData", JSON.stringify(user));
  }, [loggedIn, email, role, city, address, license, vehicleType, vehicleInfo]);

  const handleDriverComplete = (data: {
    license: string;
    vehicleType: string;
    vehicleInfo: string;
    licensePhoto: File | null;
  }) => {
    setLicense(data.license);
    setVehicleType(data.vehicleType);
    setVehicleInfo(data.vehicleInfo);
    setLoggedIn(true);
  };

  const handleUserComplete = (data: { city: string; address: string }) => {
    setCity(data.city);
    setAddress(data.address);
    setLoggedIn(true);
  };

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
        </div>
      </div>
    );
  }

  /* Step 1: Enter email, password, select role */
  if (step === 1) {
    return (
      <div className="loginCard">
        <h1 className="logo">Swift2Me</h1>

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
          {(["Customer", "Driver"] as Role[]).map((r) => (
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

        <button
          onClick={() => {
            if (!email || !password) return alert("Enter email & password");
            if (!role) return alert("Select a role");
            setStep(2);
          }}
        >
          Next
        </button>
      </div>
    );
  }

  /* Step 2: Render role-specific signup steps */
  if (step === 2) {
    if (isDriver) {
      return (
        <Drivesteps
          email={email}
          password={password}
          onComplete={handleDriverComplete}
        />
      );
    }

    if (isCustomer) {
      return <UserSteps onComplete={handleUserComplete} />;
    }
  }

  return null;
}
