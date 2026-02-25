import React, { useState, useEffect, useMemo } from "react";
import "./Driver.css";

interface Order {
  id: number;
  customer: string;
  city: string;
  address: string;
  items: string[];
  reward: number;
  assignedDriver?: string; // operator assigns
  status: "pending" | "assigned" | "completed";
  acceptedAt?: number;
}

interface DriverDashboardProps {
  name: string; // driver email
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ name }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load orders from localStorage and update live every 5 seconds
  useEffect(() => {
    const loadOrders = () => {
      const storedOrders = localStorage.getItem("orders");
      setOrders(storedOrders ? JSON.parse(storedOrders) : []);
    };

    loadOrders(); // initial load
    const interval = setInterval(loadOrders, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, []);

  // Persist orders when status changes (completed/accepted)
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Timer for ETA countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleComplete = (id: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: o.status === "completed" ? "assigned" : "completed" }
          : o
      )
    );
  };

  // Only show orders assigned to this driver
  const assignedOrders = orders.filter((o) => o.assignedDriver === name);

  // Stats
  const stats = useMemo(() => {
    const total = assignedOrders.length;
    const completed = assignedOrders.filter((o) => o.status === "completed").length;
    const pending = assignedOrders.filter((o) => o.status === "assigned").length;
    const available = assignedOrders.filter((o) => o.status === "pending").length;
    return {
      total,
      completed,
      pending,
      available,
      progress: total ? (completed / total) * 100 : 0,
    };
  }, [assignedOrders]);

  const filteredOrders = assignedOrders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "pending") return o.status !== "completed";
    return o.status === "completed";
  });

  return (
    <div className="driverDashboardFull">
      <header className="driverHeader">
        <h1>🚚 Swift2Me Driver</h1>
        <p>Deliver groceries & shopping to your customers!</p>
      </header>

      {/* Stats */}
      <div className="statsContainer">
        <div className="statsCard">Total: <strong>{stats.total}</strong></div>
        <div className="statsCard">Pending: <strong>{stats.pending}</strong></div>
        <div className="statsCard">Available: <strong>{stats.available}</strong></div>
        <div className="statsCard">Completed: <strong>{stats.completed}</strong></div>
      </div>

      {/* Progress */}
      <div className="progressContainer">
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${stats.progress}%` }}>
            {stats.progress.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filterButtons">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f as any)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Delivery Grid */}
      <div className="deliveryGrid">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((o) => {
            const remainingTime =
              o.status === "assigned" && o.acceptedAt
                ? Math.max(30 - Math.floor((currentTime - o.acceptedAt) / 60000), 0)
                : null;

            return (
              <div
                key={o.id}
                className={`deliveryCard ${
                  o.status === "completed"
                    ? "completed"
                    : o.status === "assigned"
                    ? "inProgress"
                    : "pending"
                }`}
              >
                <div className="deliveryHeader">
                  <h3>{o.customer}</h3>
                  <span className="reward">💰 ${o.reward}</span>
                </div>
                <p className="route">
                  <strong>City:</strong> {o.city} <br />
                  <strong>Address:</strong> {o.address}
                </p>
                <p className="items">
                  <strong>Items:</strong> {o.items.join(", ")}
                </p>
                {remainingTime !== null && (
                  <p className="eta">⏱ ETA: {remainingTime} min</p>
                )}
                <div className="cardButtons">
                  {o.status === "assigned" && (
                    <button onClick={() => toggleComplete(o.id)}>Mark Completed</button>
                  )}
                  {o.status === "completed" && (
                    <button onClick={() => toggleComplete(o.id)}>Undo Complete</button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="noDeliveries">No deliveries assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;