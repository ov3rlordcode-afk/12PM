import React, { useState, useEffect } from "react";
import "./Driver.css";

interface Delivery {
  id: number;
  description: string;
  completed: boolean;
  details?: string;
}

const DriverDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  // Load deliveries from localStorage or mock
  useEffect(() => {
    const stored = localStorage.getItem("driverDeliveries");
    if (stored) {
      setDeliveries(JSON.parse(stored));
    } else {
      const mock: Delivery[] = [
        {
          id: 1,
          description: "Pickup from Edinburgh → Drop at Musselburgh",
          completed: false,
          details: "Fragile items",
        },
        {
          id: 2,
          description: "Pickup from Livingston → Drop at Bathgate",
          completed: false,
          details: "Deliver between 2-4pm",
        },
        {
          id: 3,
          description: "Pickup from Linlithgow → Drop at Dalkeith",
          completed: false,
          details: "Keep upright",
        },
      ];
      setDeliveries(mock);
    }
  }, []);

  // Persist deliveries
  useEffect(() => {
    localStorage.setItem("driverDeliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  const toggleComplete = (id: number) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const total = deliveries.length;
  const completedCount = deliveries.filter((d) => d.completed).length;
  const pendingCount = total - completedCount;
  const progress = total === 0 ? 0 : (completedCount / total) * 100;

  const filteredDeliveries = deliveries.filter((d) => {
    if (filter === "all") return true;
    if (filter === "pending") return !d.completed;
    return d.completed;
  });

  return (
    <div className="driverDashboard">
      <header>
        <h1>🚚 Driver Portal</h1>
        <p>Manage your deliveries efficiently</p>
      </header>

      {/* Stats panel */}
      <div className="statsPanel">
        <div>Total: {total}</div>
        <div>Pending: {pendingCount}</div>
        <div>Completed: {completedCount}</div>
      </div>

      {/* Progress bar */}
      <div className="progressBar">
        <div className="progressFill" style={{ width: `${progress}%` }} />
      </div>

      {/* Filters */}
      <div className="filterButtons">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "pending" ? "active" : ""}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Delivery list */}
      {filteredDeliveries.length > 0 ? (
        <ul className="deliveryList">
          {filteredDeliveries.map((d) => (
            <li key={d.id} className={d.completed ? "completed" : "pending"}>
              <div className="desc">{d.description}</div>
              {d.details && <div className="details">{d.details}</div>}
              <button onClick={() => toggleComplete(d.id)}>
                {d.completed ? "Mark Pending" : "Mark Completed"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="noDeliveries">No deliveries found for this filter.</p>
      )}
    </div>
  );
};

export default DriverDashboard;
