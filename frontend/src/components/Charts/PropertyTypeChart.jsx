import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";

export default function PropertyTypeChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats/property-types")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Pie data={{
      labels: data.map(d => d.type),
      datasets: [{
        data: data.map(d => d.total),
        backgroundColor: ["#22c55e","#3b82f6","#f97316"]
      }]
    }} />
  );
}
