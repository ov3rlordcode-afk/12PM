import React from "react";
import { Item } from "../mockItems";

type Props = {
  brandName: string;
  items: Item[];
  onViewBrand: () => void;
};

export default function BrandCard({ brandName, items, onViewBrand }: Props) {
  return (
    <div className="itemCard">
      <div className="itemInfo">
        <h3>{brandName}</h3>
        <p>{items.length} locations</p>
        <button className="addBtn" onClick={onViewBrand}>
          View Shops
        </button>
      </div>
    </div>
  );
}
