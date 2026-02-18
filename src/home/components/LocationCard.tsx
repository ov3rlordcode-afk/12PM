import React, { useState } from "react";

type OpenHours = Record<string, { open: string; close: string }>;

type Props = {
  shopName: string;
  shopImage: string;
  openHours: OpenHours;
  onSelectShop: () => void;
};

export default function LocationCard({
  shopName,
  shopImage,
  openHours,
  onSelectShop,
}: Props) {
  const [showHours, setShowHours] = useState(false);

  // Days in order
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const today = days[now.getDay()];

  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const todayHours = openHours[today];
  const isOpen =
    currentTime >= todayHours.open && currentTime <= todayHours.close;

  const openInMaps = () => {
    const query = encodeURIComponent(shopName);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  return (
    <div className="itemCard">
      <img src={shopImage} alt={shopName} className="shopImage" />
      <div className="itemInfo">
        <h3>{shopName}</h3>

        {/* --- Today Hours --- */}
        <p>
          Today: {todayHours.open} - {todayHours.close}{" "}
          <span
            style={{
              color: isOpen ? "green" : "red",
              fontWeight: "bold",
              marginLeft: "5px",
            }}
          >
            ({isOpen ? "Open" : "Closed"})
          </span>
        </p>

        {/* --- Weekly Hours (all days in order) --- */}
        {showHours && (
          <div className="weeklyHours">
            {days.map((dayName) => {
              const hours = openHours[dayName];
              const isToday = dayName === today;
              const nowIsOpen =
                currentTime >= hours.open && currentTime <= hours.close;

              return (
                <p
                  key={dayName}
                  style={{
                    fontWeight: isToday ? "bold" : "normal",
                    color: isToday ? (nowIsOpen ? "green" : "red") : "inherit",
                  }}
                >
                  {dayName}: {hours.open} - {hours.close}{" "}
                  {isToday && `(${nowIsOpen ? "Open" : "Closed"})`}
                </p>
              );
            })}
          </div>
        )}

        {/* --- Buttons --- */}
        <button
          className="addBtn"
          style={{ marginTop: "10px" }}
          onClick={() => {
            setShowHours(!showHours);
            onSelectShop();
          }}
        >
          {showHours ? "Hide Open Times" : "View Shop Menu"}
        </button>
        <button className="addBtn mapBtn" onClick={openInMaps}>
          View on Map
        </button>
      </div>
    </div>
  );
}
