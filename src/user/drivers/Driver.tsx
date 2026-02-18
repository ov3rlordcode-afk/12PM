import React, { useState, useEffect } from "react";
import "./Driver.css";

interface Delivery {
  id: number;
  customer: string;
  pickup: string;
  dropoff: string;
  items: string[];
  reward: number;
  accepted: boolean;
  completed: boolean;
  eta?: number; // ETA in minutes
}

const DriverDashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Load deliveries from localStorage or mock
  useEffect(() => {
    const stored = localStorage.getItem("driverDeliveries");
    if (stored) {
      setDeliveries(JSON.parse(stored));
    } else {
      const mock: Delivery[] = [
        {
          id: 1,
          customer: "Alice",
          pickup: "Tesco, Edinburgh",
          dropoff: "Alice's Home, Musselburgh",
          items: ["Milk", "Bread", "Eggs"],
          reward: 12,
          accepted: false,
          completed: false,
          eta: 20,
        },
        {
          id: 2,
          customer: "Bob",
          pickup: "Sainsbury's, Livingston",
          dropoff: "Bob's Apartment, Bathgate",
          items: ["Chicken", "Rice", "Vegetables"],
          reward: 15,
          accepted: false,
          completed: false,
          eta: 25,
        },
        {
          id: 3,
          customer: "Charlie",
          pickup: "Morrisons, Linlithgow",
          dropoff: "Charlie, Dalkeith",
          items: ["Juice", "Snacks", "Cheese"],
          reward: 10,
          accepted: false,
          completed: false,
          eta: 15,
        },
      ];
      setDeliveries(mock);
    }
  }, []);

  // Persist deliveries
  useEffect(() => {
    localStorage.setItem("driverDeliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  // Timer for countdown
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const acceptJob = (id: number) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, accepted: true } : d))
    );
  };

  const toggleComplete = (id: number) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              completed: !d.completed,
              accepted: !d.completed ? true : d.accepted,
            }
          : d
      )
    );
  };

  const total = deliveries.length;
  const completedCount = deliveries.filter((d) => d.completed).length;
  const pendingCount = deliveries.filter(
    (d) => !d.completed && d.accepted
  ).length;
  const availableCount = deliveries.filter((d) => !d.accepted).length;
  const progress = total === 0 ? 0 : (completedCount / total) * 100;

  const filteredDeliveries = deliveries.filter((d) => {
    if (filter === "all") return true;
    if (filter === "pending") return !d.completed;
    return d.completed;
  });

  return (
    <div className="driverDashboardFull">
      <header className="driverHeader">
        <h1>🚚 Swift2Me Driver</h1>
        <p>Deliver groceries & shopping to your customers!</p>
      </header>

      {/* Stats */}
      <div className="statsContainer">
        <div className="statsCard">
          Total: <strong>{total}</strong>
        </div>
        <div className="statsCard">
          Pending: <strong>{pendingCount}</strong>
        </div>
        <div className="statsCard">
          Available: <strong>{availableCount}</strong>
        </div>
        <div className="statsCard">
          Completed: <strong>{completedCount}</strong>
        </div>
      </div>

      {/* Progress */}
      <div className="progressContainer">
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${progress}%` }}>
            {progress.toFixed(0)}%
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
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((d) => (
            <div
              key={d.id}
              className={`deliveryCard ${d.completed ? "completed" : d.accepted ? "inProgress" : "pending"}`}
            >
              <div className="deliveryHeader">
                <h3>{d.customer}</h3>
                <span className="reward">💰 ${d.reward}</span>
              </div>

              <p className="route">
                <strong>Pickup:</strong> {d.pickup}
                <br />
                <strong>Dropoff:</strong> {d.dropoff}
              </p>

              <p className="items">
                <strong>Items:</strong> {d.items.join(", ")}
              </p>

              {/* ETA */}
              {d.accepted && !d.completed && d.eta && (
                <p className="eta">⏱ ETA: {d.eta} min</p>
              )}

              {/* Buttons */}
              {!d.accepted && !d.completed && (
                <button className="acceptBtn" onClick={() => acceptJob(d.id)}>
                  Accept Job
                </button>
              )}
              {d.accepted && !d.completed && (
                <button onClick={() => toggleComplete(d.id)}>
                  Mark Completed
                </button>
              )}
              {d.completed && (
                <button onClick={() => toggleComplete(d.id)}>
                  Undo Complete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="noDeliveries">No deliveries found.</p>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
