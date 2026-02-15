import { useState } from "react";
import "../../App.css";
import "./User.css"; // separate CSS for profile-specific styling

export default function User() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [address, setAddress] = useState("123 Main St, New York");
  const [city, setCity] = useState("New York");
  const [editing, setEditing] = useState(false);

  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

  const handleSave = () => {
    if (!name || !email || !address || !city) {
      alert("Please fill all fields");
      return;
    }
    alert("Profile updated!");
    setEditing(false);
  };

  return (
    <div
      className="app"
      style={{ background: "linear-gradient(135deg, #ff5f6d, #ffc371)" }}
    >
      <div className="profileCard">
        <h1 className="logo">Client Profile</h1>

        {!editing ? (
          <div className="profileDetails">
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Address:</strong> {address}
            </p>
            <p>
              <strong>City:</strong> {city}
            </p>

            <button className="loginBtn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
            <button className="logoutBtn" onClick={() => alert("Logged out!")}>
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
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select a city</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button className="loginBtn" onClick={handleSave}>
              Save
            </button>
            <button className="logoutBtn" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
