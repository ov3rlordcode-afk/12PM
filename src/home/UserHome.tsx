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

// ====================== MOCK ITEMS ======================
const mockItems: Item[] = [
  // Grocery
  { id: 7, name: "Milk", price: 1.2, image: "/images/milk.jpg", shop: "Asda" },
  { id: 8, name: "Eggs", price: 2.5, image: "/images/eggs.jpg", shop: "Asda" },
  {
    id: 9,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Tesco",
  },
  {
    id: 10,
    name: "Cheese",
    price: 2.8,
    image: "/images/cheese.jpg",
    shop: "Tesco",
  },

  // PC Supplies
  {
    id: 11,
    name: "USB-C Cable",
    price: 5.5,
    image: "/images/usb.jpg",
    shop: "Cash Converter",
  },
  {
    id: 12,
    name: "Laptop Stand",
    price: 20.0,
    image: "/images/stand.jpg",
    shop: "Cash Converter",
  },
  {
    id: 13,
    name: "Mouse",
    price: 12.0,
    image: "/images/mouse.jpg",
    shop: "Cash Converter",
  },
];

// ====================== CATEGORIES ======================
const categories = ["All", "Grocery", "PC Supplies"];

// ====================== CATEGORY BUTTON ======================
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

// ====================== SHOP CARD ======================
function ShopCard({
  shopName,
  items,
  onViewShop,
}: {
  shopName: string;
  items: Item[];
  onViewShop: () => void;
}) {
  const previewItems = items.slice(0, 3);

  return (
    <div className="itemCard">
      <div className="shopPreviewImages">
        {previewItems.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.name}
            className="shopPreviewImage"
          />
        ))}
      </div>
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

// ====================== ITEM CARD ======================
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

// ====================== USER HOME COMPONENT ======================
export default function UserHome({ name, city }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewShop, setViewShop] = useState<string | null>(null);

  // Filter items by category and search
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      (activeCategory === "Grocery" && ["Asda", "Tesco"].includes(item.shop)) ||
      (activeCategory === "PC Supplies" &&
        ["Cash Converter"].includes(item.shop));

    return matchesSearch && matchesCategory;
  });

  // Group items by shop
  const itemsByShop = filteredItems.reduce(
    (acc: Record<string, Item[]>, item) => {
      if (!acc[item.shop]) acc[item.shop] = [];
      acc[item.shop].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="userHome">
      {/* NAVBAR */}
      <nav className="homeNavbar">
        <div className="navLeft">
          <h2 className="logo">SwiftEats</h2>
          <input
            type="text"
            placeholder="Search items or shops..."
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

      {/* HEADER */}
      <header className="homeHeader">
        <h1>Hello, {name}!</h1>
        <p>Browse all shops and items in {city} 🛒💻</p>
      </header>

      {/* CATEGORIES */}
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

      {/* SHOPS GRID */}
      <div className="itemsGrid">
        {viewShop ? (
          // Show items inside the shop
          itemsByShop[viewShop]?.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : Object.keys(itemsByShop).length ? (
          Object.entries(itemsByShop).map(([shopName, items]) => (
            <ShopCard
              key={shopName}
              shopName={shopName}
              items={items}
              onViewShop={() => setViewShop(shopName)}
            />
          ))
        ) : (
          <p className="noResults">No items or shops found 😢</p>
        )}
      </div>

      {viewShop && (
        <button
          className="logoutBtn"
          style={{ marginBottom: "40px" }}
          onClick={() => setViewShop(null)}
        >
          Back to Shops
        </button>
      )}
    </div>
  );
}
