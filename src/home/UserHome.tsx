import React, { useState } from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
  category: string;
};

type Props = {
  name: string;
  city: string;
};

// Mock items
const mockItems: Item[] = [
  // Groceries
  {
    id: 1,
    name: "Milk",
    price: 1.5,
    image: "/images/milk.jpg",
    shop: "Asda",
    category: "Groceries",
  },
  {
    id: 2,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Asda",
    category: "Groceries",
  },
  {
    id: 3,
    name: "Eggs",
    price: 2.2,
    image: "/images/eggs.jpg",
    shop: "Tesco",
    category: "Groceries",
  },
  {
    id: 4,
    name: "Orange Juice",
    price: 2.5,
    image: "/images/juice.jpg",
    shop: "Tesco",
    category: "Groceries",
  },

  // PC Supplies
  {
    id: 5,
    name: "Gaming Mouse",
    price: 35.0,
    image: "/images/mouse.jpg",
    shop: "Cash Converter",
    category: "PC Supplies",
  },
  {
    id: 6,
    name: "Keyboard",
    price: 50.0,
    image: "/images/keyboard.jpg",
    shop: "Cash Converter",
    category: "PC Supplies",
  },
  {
    id: 7,
    name: "Monitor",
    price: 150.0,
    image: "/images/monitor.jpg",
    shop: "Cash Converter",
    category: "PC Supplies",
  },

  // Food / Restaurants
  {
    id: 8,
    name: "Margherita Pizza",
    price: 8.5,
    image: "/images/pizza.jpg",
    shop: "Pizza Hub",
    category: "Food",
  },
  {
    id: 9,
    name: "Veggie Burger",
    price: 6.2,
    image: "/images/burger.jpg",
    shop: "Burger King",
    category: "Food",
  },
  {
    id: 10,
    name: "Sushi Platter",
    price: 12.0,
    image: "/images/sushi.jpg",
    shop: "Sushi House",
    category: "Food",
  },
];

const categories = ["All", "Groceries", "PC Supplies", "Food"];

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

function ShopCard({
  shopName,
  items,
  onViewShop,
}: {
  shopName: string;
  items: Item[];
  onViewShop: () => void;
}) {
  const firstItem = items[0];
  return (
    <div className="itemCard">
      <img src={firstItem.image} alt={shopName} className="itemImage" />
      <div className="itemInfo">
        <h3>{shopName}</h3>
        <p className="shopItems">{items.length} items available</p>
        <button className="addBtn" onClick={onViewShop}>
          View Shop
        </button>
      </div>
    </div>
  );
}

export default function UserHome({ name, city }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewingShop, setViewingShop] = useState<string | null>(null);

  // Filter items by search + category
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group items by shop
  const shopsMap: Record<string, Item[]> = {};
  filteredItems.forEach((item) => {
    if (!shopsMap[item.shop]) shopsMap[item.shop] = [];
    shopsMap[item.shop].push(item);
  });

  const shopList = Object.entries(shopsMap);

  // Items to display if viewing a shop
  const currentShopItems = viewingShop ? shopsMap[viewingShop] : [];

  return (
    <div className="userHome">
      {/* Navbar */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo">SwiftEats</h2>
          <input
            type="text"
            placeholder="Search shops or items..."
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="navRight">
          <ul className="navMenu">
            <li>Featured</li>
            <li>About</li>
            <li>Support</li>
          </ul>
          <button className="logoutBtn">Logout</button>
        </div>
      </nav>

      {/* Welcome */}
      <header className="homeHeader">
        <h1>Hello, {name}!</h1>
        <p>Discover shops and products in {city} 🛒💻🍔</p>
      </header>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat) => (
          <CategoryButton
            key={cat}
            category={cat}
            isActive={activeCategory === cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? "All" : cat)
            }
          />
        ))}
      </div>

      {/* Shops view */}
      {!viewingShop ? (
        <div className="itemsGrid">
          {shopList.length ? (
            shopList.map(([shopName, items]) => (
              <ShopCard
                key={shopName}
                shopName={shopName}
                items={items}
                onViewShop={() => setViewingShop(shopName)}
              />
            ))
          ) : (
            <p className="noResults">No shops found 😢</p>
          )}
        </div>
      ) : (
        <div>
          <button className="logoutBtn" onClick={() => setViewingShop(null)}>
            ← Back to Shops
          </button>
          <h2 style={{ margin: "20px 0" }}>{viewingShop}</h2>
          <div className="itemsGrid">
            {currentShopItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
