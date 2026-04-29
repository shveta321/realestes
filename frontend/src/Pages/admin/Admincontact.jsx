import React, { useEffect, useState } from "react";

const Admincontact = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("https://synamc.com/api/contact");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteMsg = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await fetch(`https://synamc.com/api/contact/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contact </h2>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.message}</td>
                <td>
                  <button onClick={() => deleteMsg(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No Data Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admincontact;