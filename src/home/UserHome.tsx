// src/home/UserHome.tsx
import React from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
};

const mockItems: Item[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 8.5,
    image: "/images/pizza.jpg",
    shop: "Pizza Hub",
  },
  {
    id: 2,
    name: "Veggie Burger",
    price: 6.2,
    image: "/images/burger.jpg",
    shop: "Burger King",
  },
  {
    id: 3,
    name: "Sushi Platter",
    price: 12.0,
    image: "/images/sushi.jpg",
    shop: "Sushi House",
  },
  {
    id: 4,
    name: "Pasta Carbonara",
    price: 9.5,
    image: "/images/pasta.jpg",
    shop: "Italiano",
  },
  {
    id: 5,
    name: "Cappuccino",
    price: 3.5,
    image: "/images/coffee.jpg",
    shop: "Coffee Corner",
  },
];

export default function UserHome() {
  return (
    <div className="userHome">
      <header className="homeHeader">
        <h1>Welcome to SwiftEats!</h1>
        <p>Browse items from your favorite shops</p>
      </header>

      <div className="itemsGrid">
        {mockItems.map((item) => (
          <div key={item.id} className="itemCard">
            <img src={item.image} alt={item.name} className="itemImage" />
            <div className="itemInfo">
              <h3>{item.name}</h3>
              <p className="shopName">{item.shop}</p>
              <p className="itemPrice">£{item.price.toFixed(2)}</p>
              <button className="addBtn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
