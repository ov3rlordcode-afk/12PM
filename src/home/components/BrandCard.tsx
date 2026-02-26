import React, { useState } from "react";
import { Item } from "../mockItems";
import "./BrandCard.css";

type Props = {
  brandName: string;
  items: Item[];
  onViewBrand: () => void;
};

const pluralize = (count: number, singular: string, plural?: string) =>
  `${count} ${count === 1 ? singular : (plural ?? singular + "s")}`;

const MiniItemsPreview = ({ items }: { items: Item[] }) => {
  if (!items.length) return null;

  const previewItems = items.slice(0, 3);

  return (
    <div className="miniItemsPreview">
      {previewItems.map((item) => (
        <img
          key={item.id}
          src={item.image}
          alt={item.name}
          className="miniItemImage"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/60?text=No+Image";
          }}
        />
      ))}
      {items.length > 3 && (
        <span className="moreItems">+{items.length - 3}</span>
      )}
    </div>
  );
};

export default function BrandCard({ brandName, items, onViewBrand }: Props) {
  const brandImage =
    items.find((item) => item.image)?.image ??
    "https://via.placeholder.com/150?text=No+Brand+Image";

  const totalItems = items.length;
  const totalShops = new Set(items.map((i) => i.shop)).size;

  const [isFavorited, setIsFavorited] = useState(false);
  const toggleFavorite = () => setIsFavorited((prev) => !prev);

  return (
    <article className="brandCard">
      <div className="brandImageWrapper">
        <img
          src={brandImage}
          alt={brandName}
          className="brandImage"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/150?text=No+Brand+Image";
          }}
        />
        <button
          className={`favoriteBtn ${isFavorited ? "favorited" : ""}`}
          onClick={toggleFavorite}
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isFavorited ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="brandInfo">
        <h3 className="brandName">{brandName}</h3>
        <p className="brandDetails">
          {pluralize(totalItems, "item")} • {pluralize(totalShops, "shop")}
        </p>
        <button className="viewShopsBtn" onClick={onViewBrand}>
          View Shops →
        </button>
        <MiniItemsPreview items={items} />
      </div>
    </article>
  );
}
