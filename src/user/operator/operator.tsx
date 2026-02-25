import React, { useEffect, useState } from "react";
import "./operator.css";

interface Order {
  id: number;
  customer: string;
  city: string;
  address: string;
  items: string[];
  reward: number;
  assignedDriver?: string;
  status: "pending" | "assigned" | "completed";
}

interface Driver {
  email: string;
  city: string;
  online: boolean;
}

export default function OperatorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  /* Load orders and drivers from localStorage initially */
  useEffect(() => {
    loadOrders();
    loadDrivers();
  }, []);

  /* Poll localStorage for new orders every 5 seconds */
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem("orders");
    const newOrders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
    setOrders(newOrders);

    // Auto-assign pending orders to available drivers
    newOrders.forEach((order) => {
      if (order.status === "pending") assignDriver(order.id, newOrders);
    });
  };

  const loadDrivers = () => {
    const storedUsers = localStorage.getItem("userData");
    const users: any[] = storedUsers ? [JSON.parse(storedUsers)] : [];
    const driversList = users
      .filter((u) => u.role === "Driver")
      .map((d) => ({ email: d.email, city: d.city || "", online: true }));
    setDrivers(driversList);
  };

  const assignDriver = (orderId: number, currentOrders: Order[] = orders) => {
    const order = currentOrders.find((o) => o.id === orderId);
    if (!order) return;

    // Find first available driver in same city
    const driver = drivers.find((d) => d.city === order.city && d.online);
    if (!driver) return;

    const updatedOrders = currentOrders.map((o) =>
      o.id === orderId
        ? { ...o, assignedDriver: driver.email, status: "assigned" }
        : o
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const markCompleted = (orderId: number) => {
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: "completed" } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="operatorDashboardFull">
      <header className="operatorHeader">
        <h1>👷 Operator Dashboard</h1>
        <p>Dispatch jobs to drivers automatically or manually</p>
      </header>

      <div className="ordersGrid">
        {orders.length === 0 && <p>No orders yet</p>}
        {orders.map((o) => (
          <div
            key={o.id}
            className={`orderCard ${
              o.status === "completed"
                ? "completed"
                : o.status === "assigned"
                ? "assigned"
                : "pending"
            }`}
          >
            <h3>{o.customer}</h3>
            <p>
              <strong>City:</strong> {o.city}
              <br />
              <strong>Address:</strong> {o.address}
            </p>
            <p>
              <strong>Items:</strong> {o.items.map((i) => i.name || i).join(", ")}
            </p>
            <p>
              <strong>Reward:</strong> ${o.reward}
            </p>
            <p>
              <strong>Status:</strong> {o.status}
              <br />
              <strong>Driver:</strong> {o.assignedDriver || "None"}
            </p>
            {o.status !== "completed" && (
              <div className="orderButtons">
                {o.status === "pending" && (
                  <button onClick={() => assignDriver(o.id)}>Dispatch Now</button>
                )}
                {o.status === "assigned" && (
                  <button onClick={() => markCompleted(o.id)}>Mark Completed</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}