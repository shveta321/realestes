import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

export default function MonthlyGrowthChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats/monthly-growth")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Line data={{
      labels: data.map(d => `Month ${d.month}`),
      datasets: [{
        label: "Properties Added",
        data: data.map(d => d.total),
        borderColor: "#16a34a"
      }]
    }} />
  );
}
