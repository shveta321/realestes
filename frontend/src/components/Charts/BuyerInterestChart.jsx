import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

export default function BuyerInterestChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats/buyer-interest")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Bar data={{
      labels: data.map(d => d.title),
      datasets: [{
        label: "Buyer Leads",
        data: data.map(d => d.leads),
        backgroundColor: "#ef4444"
      }]
    }} />
  );
}
