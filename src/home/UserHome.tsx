import React, { useState, useRef, useEffect } from "react";
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
  onLogout: () => void;
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

// --- Category Button ---
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

// --- Brand Card ---
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

// --- Location Card ---
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
  const [showHours, setShowHours] = useState(false);
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

  const openInMaps = () => {
    const query = encodeURIComponent(`${shopName}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

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

        {showHours && (
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
        )}

        <button
          className="addBtn"
          style={{ marginTop: "10px" }}
          onClick={() => {
            setShowHours(!showHours);
            onSelectShop();
          }}
        >
          {showHours ? "Hide Open Times" : "View Shop Menu"}
        </button>
        <button className="addBtn mapBtn" onClick={openInMaps}>
          View on Map
        </button>
      </div>
    </div>
  );
}

// --- Item Card ---
function ItemCard({
  item,
  onAddToCart,
}: {
  item: Item;
  onAddToCart: (item: Item) => void;
}) {
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

// --- Avatar Dropdown with Nested Menu ---
function AvatarDropdown({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const [openDeliveries, setOpenDeliveries] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setOpenDeliveries(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="avatarWrapper" ref={ref}>
      <img
        src="/images/avatar.png"
        alt="Profile"
        className="avatar"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="avatarDropdown">
          <div className="dropdownItem">MyAccount</div>

          <div
            className="dropdownItem nestedItem"
            onClick={() => setOpenDeliveries(!openDeliveries)}
          >
            Deliveries {openDeliveries ? "▲" : "▼"}
          </div>
          {openDeliveries && (
            <div className="nestedDropdown">
              <div className="dropdownItem">Being Delivered</div>
              <div className="dropdownItem">Waiting For Driver</div>
              <div className="dropdownItem">Cancelled</div>
              <div className="dropdownItem">Refunded</div>
            </div>
          )}

          <div className="dropdownItem">Wallet</div>
          <div className="dropdownItem">Support</div>
          <div className="dropdownItem" onClick={onLogout}>
            Logout
          </div>
        </div>
      )}
    </div>
  );
}

// --- UserHome Component ---
export default function UserHome({ name, city, onLogout }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [viewShop, setViewShop] = useState<string | null>(null);
  const [shopCategory, setShopCategory] = useState("All");
  const [cart, setCart] = useState<Item[]>([]);

  const addToCart = (item: Item) => setCart((prev) => [...prev, item]);
  const removeFromCart = (index: number) =>
    setCart((prev) => prev.filter((_, i) => i !== index));

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

  const searchResults = mockItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shop.toLowerCase().includes(search.toLowerCase())
  );

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="userHome app">
      {/* --- Header --- */}
      <nav className="homeNavbar improvedNavbar">
        <div className="navLeft">
          <h2 className="logo">Swift2Me</h2>
          <input
            type="text"
            placeholder="Search items or shops..."
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <div className="searchDropdown">
              {searchResults.length ? (
                searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="searchResult"
                    onClick={() => setViewShop(result.shop)}
                  >
                    <strong>{result.shop}</strong> - {result.name}
                  </div>
                ))
              ) : (
                <div className="searchResult">No results found</div>
              )}
            </div>
          )}
        </div>

        <div className="navRight">
          <ul className="navMenu">
            <li className="navItem">Featured</li>
            <li className="navItem">About</li>
            <li className="navItem">Support</li>
          </ul>

          <AvatarDropdown onLogout={onLogout} />
        </div>
      </nav>

      {/* --- Brands / Shops --- */}
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
      ) : null}

      {/* --- Floating Shop Menu --- */}
      {viewShop && (
        <div className="floatingMenu">
          <div className="menuHeader">
            <h3>{viewShop} Menu</h3>
            <button className="closeMenuBtn" onClick={() => setViewShop(null)}>
              ×
            </button>
          </div>
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
              shopItems.map((item) => (
                <ItemCard key={item.id} item={item} onAddToCart={addToCart} />
              ))
            ) : (
              <p className="noResults">No items in this category 😢</p>
            )}
          </div>
        </div>
      )}

      {/* --- Floating Cart --- */}
      {cart.length > 0 && (
        <div className="cartButton">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            🛒 {cart.length} items | £{totalPrice.toFixed(2)}
          </div>
          <div
            style={{ marginTop: "10px", maxHeight: "200px", overflowY: "auto" }}
          >
            {cart.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#FF8A50",
                  padding: "5px 10px",
                  borderRadius: "10px",
                  marginTop: "5px",
                }}
              >
                <span>{item.name}</span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => removeFromCart(index)}
                >
                  ❌
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
