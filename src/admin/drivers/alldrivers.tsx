import React from "react";
import "./alldrivers.css";

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: "Active" | "Inactive";
}

const drivers: Driver[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    vehicle: "Car",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "555-5678",
    vehicle: "Bike",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "555-9012",
    vehicle: "Scooter",
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "555-3456",
    vehicle: "Car",
    status: "Active",
  },
  // Add more placeholder drivers as needed
];

export default function AllDrivers() {
  return (
    <div className="allDriversPage">
      <h1>All Drivers</h1>

      <div className="tableContainer">
        <table className="driversTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.email}</td>
                <td>{driver.phone}</td>
                <td>{driver.vehicle}</td>
                <td
                  className={
                    driver.status === "Active"
                      ? "statusActive"
                      : "statusInactive"
                  }
                >
                  {driver.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
