import { useState, useRef } from "react";

interface UserStepsProps {
  onComplete: (data: { city: string; address: string }) => void;
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

const UserSteps = ({ onComplete }: UserStepsProps) => {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [canCheckAgree, setCanCheckAgree] = useState(false);

  const validateStep1 = () => {
    if (!city) return alert("Please select your city");
    setStep(2);
  };

  const validateStep2 = () => {
    if (!address.trim()) return alert("Please enter your address");
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
    onComplete({ city, address });
  };

  /* Customer Steps */
  if (step === 1) {
    const cityImages: Record<string, string> = {
      Edinburgh:
        "https://www.wallart.com/media/catalog/product/cache/871f459736130e239a3f5e6472128962/w/0/w06138-small.jpg",
      Musselburgh: "/images/musselburgh.jpg",
      Dalkeith:
        "https://www.midlothianview.com/wp-content/uploads/Dalkeith-High-Street.webp",
      Bonnyrigg: "/images/bonnyrigg.jpg",
      Livingston: "/images/livingston.jpg",
      Bathgate: "/images/bathgate.jpg",
      Linlithgow: "/images/linlithgow.jpg",
    };

    return (
      <div className="loginCard">
        <h1 className="logo">Choose Your City</h1>
        <p>Select your city to continue</p>
        <div className="cityGrid">
          {SCOTLAND_CITIES.map((c) => (
            <div
              key={c}
              className={`cityCard ${city === c ? "selected" : ""}`}
              style={{ backgroundImage: `url(${cityImages[c]})` }}
              onClick={() => setCity(c)}
            >
              <div className="cityOverlay">
                <span className="cityName">{c}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="btnRow">
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={validateStep1} disabled={!city}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="loginCard">
        <h1 className="logo">Enter Your Address</h1>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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

export default UserSteps;
