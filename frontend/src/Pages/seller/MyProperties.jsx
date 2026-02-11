import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyProperties() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/seller/properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setList(res.data);
    } catch (err) {
      console.error("MY PROPERTIES ERROR:", err);
    }
  };

  return (
    <div>
      <h2>My Properties</h2>

      {list.length === 0 ? (
        <p>No properties uploaded yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {/* <th>Title</th> */}
              <th>Type</th>
              <th>Subtype</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                {/* <td>{p.title}</td> */}
                <td>{p.type}</td>
                <td>{p.subtype}</td>
                <td>₹ {p.price}</td>
                <td>{p.location}</td>
                <td>
                  {p.status === "pending" && <span className="badge yellow">Pending</span>}
                  {p.status === "approved" && <span className="badge green">Approved</span>}
                  {p.status === "rejected" && <span className="badge red">Rejected</span>}
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
