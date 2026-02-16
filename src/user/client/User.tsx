import { useState } from "react";
import "../../App.css";
import "./User.css";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  shop: string;
};

export default function UserHome() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [address, setAddress] = useState("123 Main St, New York");
  const [city, setCity] = useState("");
  const [editing, setEditing] = useState(false);

  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

  const items: Item[] = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic cheese pizza",
      price: 9.99,
      shop: "Pizza Place",
    },
    {
      id: 2,
      name: "Veggie Burger",
      description: "Fresh vegetables with vegan patty",
      price: 7.5,
      shop: "Burger Joint",
    },
    {
      id: 3,
      name: "Sushi Combo",
      description: "Assorted sushi platter",
      price: 14.99,
      shop: "Sushi World",
    },
    {
      id: 4,
      name: "Spaghetti Bolognese",
      description: "Traditional Italian pasta",
      price: 11.99,
      shop: "Italiano",
    },
    {
      id: 5,
      name: "Caesar Salad",
      description: "Crisp lettuce with parmesan and croutons",
      price: 6.99,
      shop: "Healthy Eats",
    },
  ];

  const handleSave = () => {
    if (!name || !email || !city || (city && !address)) {
      alert("Please fill all fields");
      return;
    }
    alert("Profile updated!");
    setEditing(false);
  };

  return (
    <div className="app" style={{ background: "#0a0f1b", padding: "20px" }}>
      <div
        className="userHomeContainer"
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* ---------- PROFILE SIDEBAR ---------- */}
        <div className="profileCard" style={{ flex: "0 0 300px" }}>
          <h2 className="logo">Client Profile</h2>

          {!editing ? (
            <div className="profileDetails">
              <p>
                <strong>Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>City:</strong> {city}
              </p>
              {city && (
                <p>
                  <strong>Address:</strong> {address}
                </p>
              )}

              <button className="loginBtn" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
              <button
                className="logoutBtn"
                onClick={() => alert("Logged out!")}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="profileEdit">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">Select a city</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Show address only after city is selected */}
              {city && (
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              )}

              <button className="loginBtn" onClick={handleSave}>
                Save
              </button>
              <button className="logoutBtn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ---------- MAIN SHOP ITEMS ---------- */}
        <div
          className="shopItems"
          style={{
            flex: "1 1 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="itemCard"
              style={{
                background: "rgba(15,23,42,0.95)",
                padding: "20px",
                borderRadius: "15px",
                color: "#e2e8f0",
                boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
              }}
            >
              <h3>{item.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                {item.description}
              </p>
              <p>
                <strong>${item.price.toFixed(2)}</strong>
              </p>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                {item.shop}
              </p>
              <button className="loginBtn" style={{ marginTop: "10px" }}>
                Order
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
