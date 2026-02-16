import { useState } from "react";
import "./Driver.css";

type Job = {
  id: number;
  customer: string;
  item: string;
  status: "Active" | "Completed" | "Cancelled";
};
type Ticket = { id: number; title: string; status: "Open" | "Closed" };

export default function DriverDashboard() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, customer: "Alice", item: "Pizza", status: "Active" },
    { id: 2, customer: "Bob", item: "Burger", status: "Completed" },
    { id: 3, customer: "Charlie", item: "Sushi", status: "Cancelled" },
    { id: 4, customer: "Dave", item: "Pasta", status: "Active" },
    { id: 5, customer: "Eve", item: "Coffee", status: "Completed" },
    { id: 6, customer: "Frank", item: "Salad", status: "Active" },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 1, title: "Payment Issue", status: "Open" },
    { id: 2, title: "App Bug", status: "Closed" },
  ]);

  const [activeTab, setActiveTab] = useState<"Jobs" | "Tickets">("Jobs");
  const [jobFilter, setJobFilter] = useState<
    "All" | "Active" | "Completed" | "Cancelled"
  >("All");

  const filteredJobs = jobs.filter(
    (job) => jobFilter === "All" || job.status === jobFilter
  );

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const completedJobs = jobs.filter((j) => j.status === "Completed").length;
  const cancelledJobs = jobs.filter((j) => j.status === "Cancelled").length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;

  const updateJobStatus = (id: number, status: Job["status"]) =>
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status } : j)));
  const resolveTicket = (id: number) =>
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status: "Closed" } : t))
    );

  return (
    <div className="driverPageWrapper">
      <div className="driverContainer">
        <header className="driverHeader">
          <h1>Driver Dashboard 🚗</h1>
          <p>Manage your deliveries and support tickets</p>
        </header>

        <div className="statsGrid">
          <div className="statCard total">
            <h2>{totalJobs}</h2>
            <p>Total Jobs</p>
          </div>
          <div className="statCard active">
            <h2>{activeJobs}</h2>
            <p>Active</p>
          </div>
          <div className="statCard completed">
            <h2>{completedJobs}</h2>
            <p>Completed</p>
          </div>
          <div className="statCard cancelled">
            <h2>{cancelledJobs}</h2>
            <p>Cancelled</p>
          </div>
          <div className="statCard tickets">
            <h2>{openTickets}</h2>
            <p>Open Tickets</p>
          </div>
        </div>

        <div className="driverTabs">
          <button
            className={activeTab === "Jobs" ? "active" : ""}
            onClick={() => setActiveTab("Jobs")}
          >
            Jobs
          </button>
          <button
            className={activeTab === "Tickets" ? "active" : ""}
            onClick={() => setActiveTab("Tickets")}
          >
            Tickets
          </button>
        </div>

        {activeTab === "Jobs" && (
          <>
            <div className="jobFilters">
              {["All", "Active", "Completed", "Cancelled"].map((f) => (
                <button
                  key={f}
                  className={jobFilter === f ? "active" : ""}
                  onClick={() => setJobFilter(f as any)}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="jobsList">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`jobCard ${job.status.toLowerCase()}`}
                >
                  <p>
                    <strong>Customer:</strong> {job.customer}
                  </p>
                  <p>
                    <strong>Item:</strong> {job.item}
                  </p>
                  <p>
                    <strong>Status:</strong> {job.status}
                  </p>
                  {job.status === "Active" && (
                    <button
                      onClick={() => updateJobStatus(job.id, "Completed")}
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Tickets" && (
          <div className="ticketsList">
            {tickets.map((t) => (
              <div
                key={t.id}
                className={`ticketCard ${t.status.toLowerCase()}`}
              >
                <p>
                  <strong>Title:</strong> {t.title}
                </p>
                <p>
                  <strong>Status:</strong> {t.status}
                </p>
                {t.status === "Open" && (
                  <button onClick={() => resolveTicket(t.id)}>Resolve</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
