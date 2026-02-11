import React, { useEffect, useState, useCallback } from "react";

export default function Inquiries() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    const res = await fetch("http://localhost:5000/admin/inquiries", {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    const result = await res.json();
    setData(result);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;

    await fetch(`http://localhost:5000/admin/buyer-leads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    fetchData();
  };

  return (
    <div>
      <h2>Buyer Inquiries</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Seller Name</th>
            <th>Reason</th>
            <th>Property Dealer</th>
            <th>Planning to buy</th>
            <th>Loan</th>
            <th>Site Visit</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.seller_name}</td>
              <td>{item.reason}</td>
              <td>{item.is_dealer}</td>
              <td>{item.time_to_buy}</td>
              <td>{item.home_loan ? "Yes" : "No"}</td>
              <td>{item.site_visit ? "Yes" : "No"}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>
                <button
                  className="del-btn"
                  onClick={() => deleteLead(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
