import React, { useState } from "react";
import "./AdminPanel.css";

type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Order = {
  id: number;
  customer: string;
  shop: string;
  total: number;
  status: "Pending" | "Preparing" | "Out for Delivery" | "Delivered";
};

const mockUsers: User[] = [
  { id: 1, name: "John Doe", email: "john@email.com", role: "user" },
  { id: 2, name: "Jane Admin", email: "admin@email.com", role: "admin" },
];

const mockOrders: Order[] = [
  {
    id: 101,
    customer: "John Doe",
    shop: "Asda Straiton",
    total: 12.5,
    status: "Pending",
  },
  {
    id: 102,
    customer: "Alice Smith",
    shop: "Tesco Express",
    total: 8.99,
    status: "Out for Delivery",
  },
];

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "orders">(
    "dashboard"
  );

  const promoteUser = (id: number) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: "admin" } : user))
    );
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const updateOrderStatus = (id: number, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <div className="adminContainer">
      <div className="adminSidebar">
        <h2 className="adminLogo">Swift2Me Admin</h2>
        <button
          onClick={() => setActiveTab("dashboard")}
          className={activeTab === "dashboard" ? "activeTab" : ""}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" ? "activeTab" : ""}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={activeTab === "orders" ? "activeTab" : ""}
        >
          Orders
        </button>
      </div>

      <div className="adminContent">
        {activeTab === "dashboard" && (
          <>
            <h1>Dashboard Overview</h1>
            <div className="statsGrid">
              <div className="statCard">
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
              <div className="statCard">
                <h3>Total Orders</h3>
                <p>{orders.length}</p>
              </div>
              <div className="statCard">
                <h3>Pending Orders</h3>
                <p>{orders.filter((o) => o.status === "Pending").length}</p>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h1>User Management</h1>
            <div className="adminTable">
              {users.map((user) => (
                <div key={user.id} className="adminRow">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <div className="adminActions">
                    <span className={`roleBadge ${user.role}`}>
                      {user.role}
                    </span>
                    {user.role === "user" && (
                      <button onClick={() => promoteUser(user.id)}>
                        Promote
                      </button>
                    )}
                    <button
                      className="dangerBtn"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <>
            <h1>Order Management</h1>
            <div className="adminTable">
              {orders.map((order) => (
                <div key={order.id} className="adminRow">
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>
                      {order.customer} • {order.shop}
                    </p>
                    <p>£{order.total.toFixed(2)}</p>
                  </div>
                  <div className="adminActions">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value as Order["status"]
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>Preparing</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
