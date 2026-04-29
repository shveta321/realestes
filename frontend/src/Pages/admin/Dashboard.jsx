import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import "./admi.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null); //  ONLY ONE STATE

  useEffect(() => {
const fetchStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found");
    return;
  }

  const res = await fetch(
    "https://synamc.com/api/admin/dashboard-stats",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    console.log("Unauthorized");
    return;
  }

  const data = await res.json();

  setStats({
    buyerInterest: data.buyerInterest || 0,
    topSellers: data.topSellers || [],
    propertyTypes: data.propertyTypes || [],
    monthlyLeads: data.monthlyLeads || []
  });
};


    fetchStats();
  }, []);

  if (!stats) return <h3>Loading Dashboard...</h3>;

  return (
    <div className="dashboard">

      {/* Cards */}
      <div className="stats">
        <div className="card-dashbord">
          Total Inquiries<br />
          <b>{stats.buyerInterest}</b>
        </div>

        <div className="card-sell">
          Top Sellers<br />
          <b>{stats.topSellers.length}</b>
        </div>
      </div>

     <div className="chartsel">

  <div className="chart-selbox">
    {/*  Property Type */}
    <Pie
      data={{
        labels: stats.propertyTypes.map(p => p.type),
        datasets: [{
          data: stats.propertyTypes.map(p => p.count),
          backgroundColor: ["#645b8d", "#2196F3", "#5a3a0a"]
        }]
      }}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  </div>

  <div className="chart-selbox">
    {/*  Monthly Growth */}
    <Line
      data={{
        labels: stats.monthlyLeads.map(m => `Month ${m.month}`),
        datasets: [{
          label: "Buyer Leads",
          data: stats.monthlyLeads.map(m => m.count),
          borderColor: "#3f51b5"
        }]
      }}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  </div>

  <div className="chart-selbox">
    {/*  Top Sellers */}
    <Bar
      data={{
        labels: stats.topSellers.map(s => s.name),
        datasets: [{
          label: "Properties",
          data: stats.topSellers.map(s => s.total_properties),
          backgroundColor: "#559600"
        }]
      }}
      options={{ responsive: true, maintainAspectRatio: false }}
    />
  </div>

</div>


      {/*  Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Seller</th>
            <th>Total Properties</th>
          </tr>
        </thead>
        <tbody>
          {stats.topSellers.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.total_properties}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Dashboard;
