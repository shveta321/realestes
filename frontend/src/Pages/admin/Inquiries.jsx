import React, { useEffect, useState, useCallback } from "react";

export default function Inquiries() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);


  const fetchData = useCallback(async () => {
    const res = await fetch("https://synamc.com/api/inquiries", {
      headers: {
        Authorization: `Bearer ${token}`
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

    await fetch(`https://synamc.com/api/buyer-leads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchData();
  };

  
  return (
    <div>
      <h2>Buyer Inquiries</h2>

      <table className="custom-table">
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
          {currentData.map((item) => (
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
        <div style={{ marginTop: "10px", display: "flex" }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {currentPage}
        </span>

        <button
          onClick={() =>
            setCurrentPage(
              currentPage < Math.ceil(data.length / rowsPerPage)
                ? currentPage + 1
                : currentPage
            )
          }
          disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
