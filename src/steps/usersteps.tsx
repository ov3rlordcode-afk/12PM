// src/steps/usersteps.tsx
import React from "react";

interface UserStepProps {
  step: number;
  city: string;
  address: string;
  setStep: (step: number) => void;
  setCity: (val: string) => void;
  setAddress: (val: string) => void;
  validateStep2: () => void;
  validateStep3: () => void;
  SCOTLAND_CITIES: readonly string[];
}

interface CityImagesMap {
  [key: string]: string;
}

export default function UserSteps({
  step,
  city,
  address,
  setStep,
  setCity,
  setAddress,
  validateStep2,
  validateStep3,
  SCOTLAND_CITIES,
}: UserStepProps) {
  const cityImages: CityImagesMap = {
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

  if (step === 2) {
    return (
      <>
        <h1 className="logo">Choose Your City</h1>
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
          <button onClick={validateStep2} disabled={!city}>
            Next
          </button>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <h1 className="logo">Enter Your Addresss</h1>
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

  return null;
}
