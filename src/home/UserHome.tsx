import React, { useState } from "react";
import "./UserHome.css";

type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
  shop: string;
  brand: string;
  type: string;
  shopImage: string;
  openHours: Record<string, { open: string; close: string }>;
};

type Props = {
  name: string;
  city: string;
};

const mockItems: Item[] = [
  {
    id: 3,
    name: "Bread",
    price: 1.0,
    image: "/images/bread.jpg",
    shop: "Asda Straiton Superstore",
    brand: "Asda",
    type: "Grocery",
    shopImage:
      "https://static.where-e.com/United_Kingdom/Asda-Straiton-Superstore_0c7dbd6b34741eaee989aa4992a9f6d5.jpg",
    openHours: {
      Mon: { open: "07:00", close: "22:00" },
      Tue: { open: "07:00", close: "22:00" },
      Wed: { open: "07:00", close: "22:00" },
      Thu: { open: "07:00", close: "22:00" },
      Fri: { open: "07:00", close: "22:00" },
      Sat: { open: "07:00", close: "22:00" },
      Sun: { open: "08:00", close: "20:00" },
    },
  },
];

const categories = ["All", "Grocery", "PC Supplies", "Drinks", "Desserts"];

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
  shopImage,
  openHours,
  onSelectShop,
}: {
  shopName: string;
  shopImage: string;
  openHours: Record<string, { open: string; close: string }>;
  onSelectShop: () => void;
}) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const day = days[now.getDay()];
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  const todayHours = openHours[day];
  const isOpen =
    currentTime >= todayHours.open && currentTime <= todayHours.close;

  return (
    <div className="itemCard">
      <img src={shopImage} alt={shopName} className="shopImage" />
      <div className="itemInfo">
        <h3>{shopName}</h3>
        <p>
          Today: {todayHours.open} - {todayHours.close}{" "}
          <span style={{ color: isOpen ? "green" : "red", fontWeight: "bold" }}>
            ({isOpen ? "Open" : "Closed"})
          </span>
        </p>
        <div className="weeklyHours">
          {Object.entries(openHours).map(([dayName, hours]) => (
            <p
              key={dayName}
              style={{ fontWeight: dayName === day ? "bold" : "normal" }}
            >
              {dayName}: {hours.open} - {hours.close}
            </p>
          ))}
        </div>
        <button
          className="addBtn"
          style={{ marginTop: "10px" }}
          onClick={onSelectShop}
        >
          Open Menu
        </button>
      </div>
    </div>
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

export default function UserHome({ name, city }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const itemsByBrand = filteredItems.reduce(
    (acc: Record<string, Item[]>, item) => {
      if (!acc[item.brand]) acc[item.brand] = [];
      acc[item.brand].push(item);
      return acc;
    },
    {}
  );

  const brandShops = selectedBrand
    ? filteredItems.filter((item) => item.brand === selectedBrand)
    : [];
  const shopItems = viewShop
    ? filteredItems.filter(
        (item) =>
          item.shop === viewShop &&
          (shopCategory === "All" || item.type === shopCategory)
      )
    : [];

  return (
    <div className="userHome">
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

      {!selectedBrand && !viewShop ? (
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
        <>
          <h2 style={{ margin: "20px 0" }}>{selectedBrand} Locations</h2>
          <div className="itemsGrid">
            {brandShops.map((item) => (
              <LocationCard
                key={item.shop}
                shopName={item.shop}
                shopImage={item.shopImage}
                openHours={item.openHours}
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
