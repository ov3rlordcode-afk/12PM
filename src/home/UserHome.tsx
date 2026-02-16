import React, { useState } from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
};

type Props = {
  name: string;
  city: string;
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
  {
    id: 6,
    name: "Chicken Tikka",
    price: 10.5,
    image: "/images/tikka.jpg",
    shop: "Spice Route",
  },
  {
    id: 7,
    name: "Chocolate Cake",
    price: 4.0,
    image: "/images/cake.jpg",
    shop: "Sweet Tooth",
  },
  {
    id: 8,
    name: "Caesar Salad",
    price: 7.5,
    image: "/images/salad.jpg",
    shop: "Green Bowl",
  },
  {
    id: 9,
    name: "Fish & Chips",
    price: 9.0,
    image: "/images/fish.jpg",
    shop: "Ocean's Catch",
  },
  {
    id: 10,
    name: "Latte",
    price: 3.8,
    image: "/images/latte.jpg",
    shop: "Coffee Corner",
  },
];

const categories = [
  "Pizza",
  "Burgers",
  "Sushi",
  "Pasta",
  "Drinks",
  "Desserts",
  "Salads",
  "Indian",
  "Seafood",
];

function CategoryButton({
  category,
  isActive,
  onClick,
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`categoryBtn ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {category}
    </button>
  );
}

function ItemCard({ item }: { item: Item }) {
  return (
    <div className="itemCard">
      <img src={item.image} alt={item.name} className="itemImage" />
      <div className="itemInfo">
        <h3>{item.name}</h3>
        <p className="shopName">{item.shop}</p>
        <p className="itemPrice">£{item.price.toFixed(2)}</p>
        <button className="addBtn">Add to Cart</button>
      </div>
    </div>
  );
}

export default function UserHome({ name, city }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const filteredItems = mockItems.filter((item) => {
    // Search matches item name OR shop name
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase());

    // Category filter
    const matchesCategory =
      !activeCategory ||
      item.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      item.shop.toLowerCase().includes(activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="userHome">
      {/* Navbar */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo">SwiftEats</h2>
          <div className="searchWrapper">
            <input
              type="text"
              placeholder="Search for items or shops..."
              className="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="navRight">
          <ul className="navMenu">
            <li>Feature Shops</li>
            <li>About</li>
            <li>Support</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
          <button className="logoutBtn">Logout</button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <header className="homeHeader">
        <h1>Hello, {name}!</h1>
        <p>Discover delicious meals in {city} 🍔🍕🍣</p>
      </header>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat) => (
          <CategoryButton
            key={cat}
            category={cat}
            isActive={activeCategory === cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
          />
        ))}
      </div>

      {/* Items Grid */}
      <div className="itemsGrid">
        {filteredItems.length ? (
          filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p className="noResults">No items or shops match your search 😢</p>
        )}
      </div>
    </div>
  );
}
