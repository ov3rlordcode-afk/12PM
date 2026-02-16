import React, { useState } from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string; // unique shop name/location
  brand: string; // e.g., Asda, Tesco
  type: string; // category
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
    shop: "Asda - High Street",
    brand: "Asda",
    type: "Grocery",
  },
  {
    id: 2,
    name: "Eggs",
    price: 2.5,
    image: "/images/eggs.jpg",
    shop: "Asda - Main Square",
    brand: "Asda",
    type: "Grocery",
  },
  {
    id: 3,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Tesco - Downtown",
    brand: "Tesco",
    type: "Grocery",
  },
  {
    id: 4,
    name: "Cheese",
    price: 2.8,
    image: "/images/cheese.jpg",
    shop: "Tesco - Uptown",
    brand: "Tesco",
    type: "Grocery",
  },
  {
    id: 5,
    name: "USB-C Cable",
    price: 5.5,
    image: "/images/usb.jpg",
    shop: "Cash Converter - City Center",
    brand: "Cash Converter",
    type: "PC Supplies",
  },
  {
    id: 6,
    name: "Laptop Stand",
    price: 20.0,
    image: "/images/stand.jpg",
    shop: "Cash Converter - Mall",
    brand: "Cash Converter",
    type: "PC Supplies",
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
function BrandCard({
  brandName,
  items,
  onViewBrand,
}: {
  brandName: string;
  items: Item[];
  onViewBrand: () => void;
}) {
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

function LocationCard({
  shopName,
  onSelectShop,
}: {
  shopName: string;
  onSelectShop: () => void;
}) {
  return (
    <div className="itemCard">
      <div className="itemInfo">
        <h3>{shopName}</h3>
        <button className="addBtn" onClick={onSelectShop}>
          Open Menu
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
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");

  // Filter items by search and category
  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group items by brand
  const itemsByBrand = filteredItems.reduce(
    (acc: Record<string, Item[]>, item) => {
      if (!acc[item.brand]) acc[item.brand] = [];
      acc[item.brand].push(item);
      return acc;
    },
    {}
  );

  // Items in selected shop
  const shopItems = viewShop
    ? filteredItems.filter(
        (item) =>
          item.shop === viewShop &&
          (shopCategory === "All" || item.type === shopCategory)
      )
    : [];

  // Shops for selected brand
  const brandShops = selectedBrand
    ? filteredItems.filter((item) => item.brand === selectedBrand)
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

      <header className="homeHeader">
        <h1>Hello, {name}!</h1>
        <p>Browse shops and items in {city} 🛒💻</p>
      </header>

      {/* MAIN FLOW */}
      {!selectedBrand && !viewShop ? (
        // Show all brands
        <div className="itemsGrid">
          {Object.entries(itemsByBrand).map(([brandName, items]) => (
            <BrandCard
              key={brandName}
              brandName={brandName}
              items={items}
              onViewBrand={() => setSelectedBrand(brandName)}
            />
          ))}
        </div>
      ) : selectedBrand && !viewShop ? (
        // Show all shops for selected brand
        <>
          <h2 style={{ margin: "20px 0" }}>{selectedBrand} Locations</h2>
          <div className="itemsGrid">
            {brandShops.map((item) => (
              <LocationCard
                key={item.shop}
                shopName={item.shop}
                onSelectShop={() => {
                  setViewShop(item.shop);
                  setShopCategory("All");
                }}
              />
            ))}
          </div>
          <button className="backBtn" onClick={() => setSelectedBrand(null)}>
            ← Back to Brands
          </button>
        </>
      ) : viewShop ? (
        // Show menu for selected shop
        <>
          <h2 style={{ margin: "20px 0" }}>{viewShop} Menu</h2>
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
          <div className="itemsGrid">
            {shopItems.length ? (
              shopItems.map((item) => <ItemCard key={item.id} item={item} />)
            ) : (
              <p className="noResults">No items in this category 😢</p>
            )}
          </div>
          <button
            className="backBtn"
            onClick={() => setViewShop(null)}
            style={{ marginBottom: "40px" }}
          >
            ← Back to Shops
          </button>
        </>
      ) : null}
    </div>
  );
}
