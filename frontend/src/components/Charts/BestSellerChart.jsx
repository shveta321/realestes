// import "../../components/charts/chartConfig";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";

export default function BestSellerChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/stats/best-sellers")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Bar data={{
      labels: data.map(d => d.name),
      datasets: [{
        label: "Total Properties",
        data: data.map(d => d.total),
        backgroundColor: "#2563eb"
      }]
    }} />
  );
}
