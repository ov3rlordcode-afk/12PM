src / steps / drivesteps.tsx;
import { useState, useRef } from "react";

interface DriverStepsProps {
  email: string;
  password: string;
  onComplete: (data: {
    license: string;
    vehicleType: string;
    vehicleInfo: string;
    licensePhoto: File | null;
  }) => void;
}

const Drivesteps = ({ email, password, onComplete }: DriverStepsProps) => {
  const [step, setStep] = useState(1);
  const [license, setLicense] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);

  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const validateStep1 = () => {
    if (!license.trim()) return alert("Enter your driving license number");
    setStep(2);
  };

  const validateStep2 = () => {
    if (!vehicleType) return alert("Select vehicle type");
    if (!vehicleInfo.trim()) return alert("Enter vehicle info");
    if (!licensePhoto) return alert("Upload a photo of your driving license");
    setStep(3);
  };

  const handleTermsScroll = () => {
    const el = termsRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5)
      setCanCheckAgree(true);
  };

  const completeSignup = () => {
    if (!agreed) return alert("You must agree to the Terms of Service");
    onComplete({ license, vehicleType, vehicleInfo, licensePhoto });
  };

  /* Render steps */
  if (step === 1) {
    return (
      <div className="loginCard">
        <h1 className="logo">Driver Signup</h1>
        <p>Enter your UK Driving License Number</p>
        <input
          type="text"
          placeholder="License #"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
        />
        <div className="btnRow">
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={validateStep1}>Next</button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="loginCard">
        <h1 className="logo">Vehicle Information</h1>
        <label>Vehicle Type:</label>
        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">Select type</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Big">Big</option>
        </select>
        <input
          type="text"
          placeholder="Vehicle info (make/model/plate)"
          value={vehicleInfo}
          onChange={(e) => setVehicleInfo(e.target.value)}
        />
        <label>Upload Driving License Photo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLicensePhoto(e.target.files?.[0] ?? null)}
        />
        <div className="btnRow">
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={validateStep2}>Next</button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="loginCard">
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
          <button onClick={() => setStep(2)}>Back</button>
          <button disabled={!agreed} onClick={completeSignup}>
            Accept & Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Drivesteps;
