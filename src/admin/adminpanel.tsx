import { useState, useEffect } from "react";

interface AdminUser {
  email: string;
  password: string;
  role: string;
}

export default function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  /* Restore admin session */
  useEffect(() => {
    const stored = localStorage.getItem("adminData");
    if (!stored) return;
    try {
      const user: AdminUser = JSON.parse(stored);
      setEmail(user.email);
      setLoggedIn(true);
    } catch {
      localStorage.removeItem("adminData");
    }
  }, []);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      return alert("Please enter email and password");
    }

    const stored = localStorage.getItem("adminData");
    if (!stored) return alert("No admin account found.");

    try {
      const user: AdminUser = JSON.parse(stored);

      if (
        user.email !== email ||
        user.password !== password ||
        user.role !== "Staff"
      ) {
        return alert("Invalid credentials.");
      }

      setLoggedIn(true);
    } catch {
      alert("Login error.");
    }
  };

  const handleLogout = () => {
    setEmail("");
    setPassword("");
    setLoggedIn(false);
    localStorage.removeItem("adminData");
  };

  if (loggedIn) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Welcome, {email} (Staff)</h1>
        <p>This is the Admin Panel.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Staff Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
