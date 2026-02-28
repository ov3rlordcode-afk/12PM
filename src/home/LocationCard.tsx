import React, { useState, useEffect } from "react";
import "./LocationCard.css";
import Reviews from "./Reviews"; // Ensure correct path

type OpenHours = Record<string, { open: string; close: string }>;

type Props = {
  shopName: string;
  shopImage: string;
  openHours: OpenHours;
  address: string; // NEW: store address
  website?: string; // NEW: optional store website
  onSelectShop: () => void;
};

export default function LocationCard({
  shopName,
  shopImage,
  openHours,
  address,
  website,
  onSelectShop,
}: Props) {
  const [showHours, setShowHours] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

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
    const query = encodeURIComponent(`${shopName}, ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  const handleLike = () => setLikes((prev) => prev + 1);
  const handleDislike = () => setDislikes((prev) => prev + 1);
  const handleReport = () => alert("Report feature coming soon!");

  // ---------- FAVORITES: LOCALSTORAGE ----------
  useEffect(() => {
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );
    setIsFavorite(favorites.includes(shopName));
  }, [shopName]);

  const toggleFavorite = () => {
    const favorites: string[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    let updatedFavorites: string[];
    if (favorites.includes(shopName)) {
      updatedFavorites = favorites.filter((name) => name !== shopName);
      setIsFavorite(false);
    } else {
      updatedFavorites = [...favorites, shopName];
      setIsFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="itemCard modernCard">
      {/* IMAGE & OVERLAY */}
      <div
        className="shopImageWrapper"
        style={{ backgroundImage: `url(${shopImage})` }}
      >
        <div className="overlayTop">
          <h3>{shopName}</h3>
          <div className={`statusTag ${isOpen ? "open" : "closed"}`}>
            {isOpen ? "Open" : "Closed"}
          </div>
        </div>

        <div className="floatingButtons">
          <button
            className={`iconBtn ${isFavorite ? "favorited" : ""}`}
            onClick={toggleFavorite}
            title="Favorite"
          >
            ❤️
          </button>
          <button className="iconBtn" onClick={handleLike} title="Like">
            👍 {likes}
          </button>
          <button className="iconBtn" onClick={handleDislike} title="Dislike">
            👎 {dislikes}
          </button>
          <button
            className="iconBtn"
            onClick={() => setShowReviews(true)}
            title="Review"
          >
            📝
          </button>
        </div>
      </div>

      {/* DESCRIPTION & ACTIONS */}
      <div className="itemInfo">
        {/* Today hours */}
        <p className="todayHours">
          Today: {todayHours.open} - {todayHours.close}{" "}
          <span className={isOpen ? "openStatus" : "closedStatus"}>
            ({isOpen ? "Open" : "Closed"})
          </span>
        </p>

        {/* Address */}
        <p className="shopAddress">📍 {address}</p>

        {/* Website */}
        {website && (
          <p className="shopWebsite">
            🔗{" "}
            <a href={website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </p>
        )}

        {/* Weekly hours */}
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
                  className={
                    isToday ? (nowIsOpen ? "todayOpen" : "todayClosed") : ""
                  }
                >
                  {dayName}: {hours.open} - {hours.close}{" "}
                  {isToday && `(${nowIsOpen ? "Open" : "Closed"})`}
                </p>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div className="btnRow">
          <button
            className="mainBtn"
            onClick={() => {
              setShowHours(!showHours);
              onSelectShop();
            }}
          >
            {showHours ? "Hide Open Times" : "View Shop Menu"}
          </button>
          <button className="mainBtn mapBtn" onClick={openInMaps}>
            View on Map
          </button>
          {website && (
            <button
              className="mainBtn websiteBtn"
              onClick={() => window.open(website, "_blank")}
            >
              Website
            </button>
          )}
          <button className="mainBtn reportBtn" onClick={handleReport}>
            Report Shop
          </button>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviews && (
        <Reviews shopName={shopName} onClose={() => setShowReviews(false)} />
      )}
    </div>
  );
}
