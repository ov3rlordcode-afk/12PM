// src/steps/UserSteps.tsx
import React, { useState, useEffect, useRef } from "react";
import "./usersteps.css";

interface UserStepProps {
  step: number;
  city: string;
  address: string;
  setStep: (step: number) => void;
  setCity: (val: string) => void;
  setAddress: (val: string) => void;
  validateStep2: () => void;
  validateStep3: () => void;
  validateStep4?: () => void;
  validateStep5?: () => void;
  SCOTLAND_CITIES: readonly string[];
}

interface CityImagesMap {
  [key: string]: string;
}

interface CityInfoMap {
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
  validateStep4,
  validateStep5,
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

  const cityDescriptions: CityInfoMap = {
    Edinburgh: "The historic capital of Scotland.",
    Musselburgh: "Coastal town with charming views.",
    Dalkeith: "Town full of heritage and culture.",
    Bonnyrigg: "Vibrant community town.",
    Livingston: "Modern town with shopping centers.",
    Bathgate: "Peaceful town with scenic parks.",
    Linlithgow: "Famous for Linlithgow Palace.",
  };

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const len = SCOTLAND_CITIES.length;
    const cols = 3;
    switch (e.key) {
      case "ArrowRight":
        setFocusedIndex((prev) => (prev + 1) % len);
        break;
      case "ArrowLeft":
        setFocusedIndex((prev) => (prev - 1 + len) % len);
        break;
      case "ArrowDown":
        setFocusedIndex((prev) => (prev + cols) % len);
        break;
      case "ArrowUp":
        setFocusedIndex((prev) => (prev - cols + len) % len);
        break;
      case "Enter":
        if (focusedIndex >= 0) setCity(SCOTLAND_CITIES[focusedIndex]);
        break;
    }
  };

  useEffect(() => {
    if (focusedIndex >= 0 && gridRef.current) {
      const node = gridRef.current.children[focusedIndex] as HTMLElement;
      node?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [focusedIndex]);

  /* ---------- STEP 2: CITY SELECTION ---------- */
  if (step === 2) {
    return (
      <>
        <h1 className="logo">Choose Your City</h1>
        <div
          className="cityGrid"
          ref={gridRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {SCOTLAND_CITIES.map((c, index) => (
            <div
              key={c}
              className={`cityCard ${city === c ? "selected" : ""} ${focusedIndex === index ? "focused" : ""}`}
              style={{ backgroundImage: `url(${cityImages[c] || ""})` }}
              onClick={() => setCity(c)}
              onFocus={() => setFocusedIndex(index)}
              tabIndex={0}
            >
              <div className="cityOverlay">
                <span className="cityName">{c}</span>
                <span className="cityDesc">{cityDescriptions[c]}</span>
                {city === c && <span className="selectedTag">Selected</span>}
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

  /* ---------- STEP 3: ADDRESS ---------- */
  if (step === 3) {
    return (
      <>
        <h1 className="logo">Enter Your Address</h1>
        <div className={`inputWrapper ${address ? "floating" : ""}`}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Your Address"
          />
          <span>Address</span>
        </div>
        <div className="btnRow">
          <button onClick={() => setStep(2)}>Back</button>
          <button onClick={validateStep3} disabled={!address.trim()}>
            Next
          </button>
        </div>
      </>
    );
  }

  /* ---------- STEP 4: SWITCH2ME ---------- */
  if (step === 4) {
    const switchCards = [
      {
        title: "Fast & Reliable",
        desc: "Orders arrive quickly from trusted local partners.",
        img: "/images/step4_fast_delivery.jpg",
      },
      {
        title: "Safe & Verified",
        desc: "All delivery partners are fully verified and reliable.",
        img: "/images/step4_safe_verified.jpg",
      },
      {
        title: "Everything You Need",
        desc: "Groceries, meals, essentials — all delivered.",
        img: "/images/step4_everything.jpg",
      },
    ];

    return (
      <>
        <h1 className="logo">What is Switch2Me?</h1>
        <div className="cityGrid">
          {switchCards.map((c, idx) => (
            <div
              key={idx}
              className="cityCard"
              style={{
                backgroundImage: `url(${c.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="cityOverlay">
                <span className="cityName">{c.title}</span>
                <span className="cityDesc">{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="btnRow">
          <button onClick={() => setStep(3)}>Back</button>
          <button onClick={validateStep4}>Next</button>
        </div>
      </>
    );
  }

  /* ---------- STEP 5: RULES ---------- */
  if (step === 5) {
    const rulesCards = [
      {
        title: "Accuracy",
        desc: "Provide correct addresses for smooth deliveries.",
        img: "/images/rule_accuracy.jpg",
      },
      {
        title: "Be Ready",
        desc: "Be prepared to receive deliveries on time.",
        img: "/images/rule_ready.jpg",
      },
      {
        title: "Respect Partners",
        desc: "Treat our delivery partners with respect.",
        img: "/images/rule_respect.jpg",
      },
      {
        title: "Safety & Hygiene",
        desc: "Follow safety and hygiene guidelines.",
        img: "/images/rule_safety.jpg",
      },
    ];

    return (
      <>
        <h1 className="logo">Know the Rules</h1>
        <div className="cityGrid">
          {rulesCards.map((r, idx) => (
            <div
              key={idx}
              className="cityCard"
              style={{
                backgroundImage: `url(${r.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="cityOverlay">
                <span className="cityName">{r.title}</span>
                <span className="cityDesc">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="btnRow">
          <button onClick={() => setStep(4)}>Back</button>
          <button onClick={validateStep5}>Next</button>
        </div>
      </>
    );
  }

  /* ---------- STEP 6: HOW WE WORK ---------- */
  if (step === 6) {
    const howCards = [
      {
        title: "Place Your Order",
        desc: "Choose your items and place your order seamlessly.",
        img: "/images/how_order.jpg",
      },
      {
        title: "Partner Accepts",
        desc: "Nearest partner accepts and prepares your order.",
        img: "/images/how_partner.jpg",
      },
      {
        title: "Pickup & Delivery",
        desc: "Items are picked up and delivered in real-time.",
        img: "/images/how_pickup.jpg",
      },
      {
        title: "Track Order",
        desc: "Monitor your order live until it reaches you.",
        img: "/images/how_track.jpg",
      },
      {
        title: "Fast & Safe",
        desc: "Enjoy speed, reliability, and safety every time.",
        img: "/images/how_fast.jpg",
      },
    ];

    return (
      <>
        <h1 className="logo">How We Work</h1>
        <div className="cityGrid">
          {howCards.map((h, idx) => (
            <div
              key={idx}
              className="cityCard"
              style={{
                backgroundImage: `url(${h.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="cityOverlay">
                <span className="cityName">{h.title}</span>
                <span className="cityDesc">{h.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="btnRow">
          <button onClick={() => setStep(5)}>Back</button>
          <button onClick={() => setStep(7)}>Finish</button>
        </div>
      </>
    );
  }

  return null;
}
