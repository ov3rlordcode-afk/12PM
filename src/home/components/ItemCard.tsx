import React, { useState } from "react";
import { Item } from "../mockItems";

type Props = {
  item: Item;
  onAddToCart: (item: Item) => void;
};

export default function ItemCard({ item, onAddToCart }: Props) {
  const [added, setAdded] = useState(false);
  return (
    <div className="itemCard">
      <img src={item.image} alt={item.name} className="itemImage" />
      <div className="itemInfo">
        <h3>{item.name}</h3>
        <p className="shopName">{item.shop}</p>
        <p className="itemPrice">£{item.price.toFixed(2)}</p>
        <button
          className={`addBtn ${added ? "added" : ""}`}
          onClick={() => {
            onAddToCart(item);
            setAdded(true);
            setTimeout(() => setAdded(false), 1000);
          }}
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
