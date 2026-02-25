import React, { useState } from "react";
import "./LocationCard.css";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

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

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const handleLike = () => setLikes((prev) => prev + 1);
  const handleDislike = () => setDislikes((prev) => prev + 1);
  const handleReview = () => alert("Review feature coming soon!"); // Placeholder

  return (
    <div className="itemCard modernCard">
      {/* IMAGE & OVERLAY */}
      <div
        className="shopImageWrapper"
        style={{ backgroundImage: `url(${shopImage})` }}
      >
        <div className="overlayTop">
          <h3>{shopName}</h3>
          <div className="statusTag">{isOpen ? "Open" : "Closed"}</div>
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
          <button className="iconBtn" onClick={handleReview} title="Review">
            📝
          </button>
        </div>
      </div>

      {/* DESCRIPTION & ACTIONS */}
      <div className="itemInfo">
        <p className="todayHours">
          Today: {todayHours.open} - {todayHours.close}{" "}
          <span className={isOpen ? "openStatus" : "closedStatus"}>
            ({isOpen ? "Open" : "Closed"})
          </span>
        </p>

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
        </div>
      </div>
    </div>
  );
}
