import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./SellerDashboard.css";

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/seller/dashboard-stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p className="loading-text">Loading...</p>;

  return (
    <div className="dashboard-wrapper seller-dashboard">
      
      <h2 className="dashboard-title">Seller Dashboard</h2>

      {/* 🔹 Stats Cards */}
      <div className="stats-container">
        <div className="stats-card">
          <span className="stats-label">Total Properties</span>
          <h3 className="stats-value">{stats.totalProperties}</h3>
        </div>

        <div className="stats-card">
          <span className="stats-label">Total Inquiries</span>
          <h3 className="stats-value">{stats.totalInquiries}</h3>
        </div>
      </div>

      {/* 🔹 Property Types */}
      <div className="dashboard-card">
        <h3 className="card-title">Property Types</h3>
        <ul className="list">
          {stats.propertyTypes.map((p, i) => (
            <li className="list-item" key={i}>
              <span>{p.type}</span>
              <span className="badge">{p.count}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 🔹 Monthly Inquiries */}
      <div className="dashboard-card">
        <h3 className="card-title">Monthly Inquiries</h3>
        <ul className="list">
          {stats.monthlyInquiries.map((m, i) => (
            <li className="list-item" key={i}>
              <span>Month {m.month}</span>
              <span className="badge">{m.count}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default SellerDashboard;
