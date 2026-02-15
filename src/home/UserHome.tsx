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
];

const categories = ["Pizza", "Burgers", "Sushi", "Pasta", "Drinks"];

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

  const filteredItems = mockItems.filter(
    (item) =>
      (!activeCategory ||
        item.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
        item.shop.toLowerCase().includes(activeCategory.toLowerCase())) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="userHome">
      {/* Navbar */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo">SwiftEats</h2>
          <div className="searchWrapper">
            <input
              type="text"
              placeholder="Search for meals..."
              className="searchInput"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="navRight">
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
          <p className="noResults">No items match your search 😢</p>
        )}
      </div>
    </div>
  );
}
