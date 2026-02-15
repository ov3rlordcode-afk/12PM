import { useState } from "react";
import "../../../App.css"; // reuse dark theme

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

interface Store {
  id: number;
  name: string;
  rating: number;
  delivery: string;
  image: string;
  categories: string[];
  products: Product[];
}

export default function AllStores() {
  const [search, setSearch] = useState("");
  const [expandedStore, setExpandedStore] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const stores: Store[] = [
    {
      id: 1,
      name: "Tech Depot",
      rating: 4.8,
      delivery: "1-2 days",
      image: "https://source.unsplash.com/400x300/?electronics",
      categories: ["All", "Audio", "Wearables", "Accessories"],
      products: [
        { id: 1, name: "Wireless Headphones", price: 79.99, category: "Audio" },
        { id: 2, name: "Bluetooth Speaker", price: 59.99, category: "Audio" },
        { id: 3, name: "Smart Watch", price: 129.99, category: "Wearables" },
        { id: 4, name: "Phone Case", price: 19.99, category: "Accessories" },
      ],
    },
    {
      id: 2,
      name: "Home Comforts",
      rating: 4.6,
      delivery: "2-4 days",
      image: "https://source.unsplash.com/400x300/?home,appliances",
      categories: ["All", "Appliances", "Lighting", "Furniture"],
      products: [
        {
          id: 5,
          name: "Vacuum Cleaner",
          price: 149.99,
          category: "Appliances",
        },
        { id: 6, name: "LED Desk Lamp", price: 39.99, category: "Lighting" },
        { id: 7, name: "Coffee Table", price: 99.99, category: "Furniture" },
      ],
    },
    {
      id: 3,
      name: "Fashion Outlet",
      rating: 4.7,
      delivery: "2-3 days",
      image: "https://source.unsplash.com/400x300/?clothes",
      categories: ["All", "Clothes", "Shoes", "Accessories"],
      products: [
        { id: 8, name: "Jeans", price: 49.99, category: "Clothes" },
        { id: 9, name: "T-Shirt", price: 19.99, category: "Clothes" },
        { id: 10, name: "Sneakers", price: 79.99, category: "Shoes" },
        { id: 11, name: "Sunglasses", price: 29.99, category: "Accessories" },
      ],
    },
  ];

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app dark">
      <header className="header">
        <h1>All Stores Admin</h1>
        <p>Overview of all stores and their menus</p>
      </header>

      {/* Search */}
      <div className="searchBox">
        <input
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stores List */}
      <div className="storeList">
        {filteredStores.map((store) => (
          <div key={store.id} className="storeCard">
            <div
              onClick={() =>
                setExpandedStore(expandedStore === store.id ? null : store.id)
              }
            >
              <img src={store.image} alt={store.name} className="storeImage" />
              <div className="storeInfo">
                <h2>{store.name}</h2>
                <div className="storeMeta">
                  <span>⭐ {store.rating}</span>
                  <span>{store.delivery}</span>
                </div>
              </div>
            </div>

            {/* Expanded Menu */}
            {expandedStore === store.id && (
              <div className="restaurantList">
                {/* Categories */}
                <div className="categories">
                  {store.categories.map((cat) => (
                    <button
                      key={cat}
                      className={`categoryBtn ${
                        cat === selectedCategory ? "active" : ""
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Products */}
                {store.products
                  .filter(
                    (p) =>
                      selectedCategory === "All" ||
                      p.category === selectedCategory
                  )
                  .map((product) => (
                    <div key={product.id} className="menuItem">
                      <div>
                        <p className="itemName">{product.name}</p>
                        <p className="price">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}

        {filteredStores.length === 0 && (
          <p style={{ padding: "16px", textAlign: "center", color: "#9ca3af" }}>
            No stores found.
          </p>
        )}
      </div>
    </div>
  );
}
