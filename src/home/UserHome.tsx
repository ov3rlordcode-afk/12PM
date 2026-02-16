import React, { useState } from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
  type: string; // category/type
};

type Props = {
  name: string;
  city: string;
};

// ====================== MOCK ITEMS ======================
const mockItems: Item[] = [
  {
    id: 1,
    name: "Milk",
    price: 1.2,
    image: "/images/milk.jpg",
    shop: "Asda",
    type: "Grocery",
  },
  {
    id: 2,
    name: "Eggs",
    price: 2.5,
    image: "/images/eggs.jpg",
    shop: "Asda",
    type: "Grocery",
  },
  {
    id: 3,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Tesco",
    type: "Grocery",
  },
  {
    id: 4,
    name: "Cheese",
    price: 2.8,
    image: "/images/cheese.jpg",
    shop: "Tesco",
    type: "Grocery",
  },
  {
    id: 5,
    name: "USB-C Cable",
    price: 5.5,
    image: "/images/usb.jpg",
    shop: "Cash Converter",
    type: "PC Supplies",
  },
  {
    id: 6,
    name: "Laptop Stand",
    price: 20.0,
    image: "/images/stand.jpg",
    shop: "Cash Converter",
    type: "PC Supplies",
  },
  {
    id: 7,
    name: "Mouse",
    price: 12.0,
    image: "/images/mouse.jpg",
    shop: "Cash Converter",
    type: "PC Supplies",
  },
  {
    id: 8,
    name: "Coca Cola",
    price: 1.5,
    image: "/images/coke.jpg",
    shop: "Tesco",
    type: "Drinks",
  },
  {
    id: 9,
    name: "Orange Juice",
    price: 2.2,
    image: "/images/juice.jpg",
    shop: "Asda",
    type: "Drinks",
  },
  {
    id: 10,
    name: "Chocolate Cake",
    price: 4.0,
    image: "/images/cake.jpg",
    shop: "Sweet Tooth",
    type: "Desserts",
  },
  {
    id: 11,
    name: "Cupcake",
    price: 2.0,
    image: "/images/cupcake.jpg",
    shop: "Sweet Tooth",
    type: "Desserts",
  },
];

// ====================== CATEGORIES ======================
const categories = ["All", "Grocery", "PC Supplies", "Drinks", "Desserts"];

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

// ====================== USER HOME ======================
export default function UserHome({ name, city }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All"); // new per-shop category

  // Filter items by search and main category
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.type === activeCategory;
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

  // Items in selected shop, filtered by shopCategory
  const shopItems = viewShop
    ? itemsByShop[viewShop]?.filter(
        (item) => shopCategory === "All" || item.type === shopCategory
      )
    : [];

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

      {/* MAIN CONTENT */}
      {!viewShop ? (
        <>
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
            {Object.keys(itemsByShop).length ? (
              Object.entries(itemsByShop).map(([shopName, items]) => (
                <ShopCard
                  key={shopName}
                  shopName={shopName}
                  items={items}
                  onViewShop={() => {
                    setViewShop(shopName);
                    setShopCategory("All"); // reset shop category
                  }}
                />
              ))
            ) : (
              <p className="noResults">No items or shops found 😢</p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* SHOP HEADER */}
          <h2 style={{ margin: "20px 0" }}>{viewShop} Menu</h2>

          {/* SHOP CATEGORIES */}
          <div className="categories">
            {categories.map((cat) => (
              <CategoryButton
                key={cat}
                category={cat}
                isActive={shopCategory === cat}
                onClick={() =>
                  setShopCategory(shopCategory === cat ? "All" : cat)
                }
              />
            ))}
          </div>

          {/* SHOP ITEMS */}
          <div className="itemsGrid">
            {shopItems.length ? (
              shopItems.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
              <p className="noResults">No items in this category 😢</p>
            )}
          </div>

          {/* BACK BUTTON */}
          <button
            className="backBtn"
            style={{ marginBottom: "40px" }}
            onClick={() => setViewShop(null)}
          >
            ← Back to Shops
          </button>
        </>
      )}
    </div>
  );
}
