import React, { useEffect, useState } from "react";
import axios from "axios";

const Adviservislist = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("https://synamc.com/api/admin/media");
    setData(res.data);
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await axios.delete(`https://synamc.com/api/admin/media/${id}`);
    fetchData(); // refresh list
  };

  return (
    <div>
      <h2>Admin Media List</h2>

      <table className="custom-table" border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Type</th>
            <th>Content</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.type}</td>

              {/* 🔥 TYPE BASED CONTENT */}
              <td>
                {item.type === "text" ? (
                  item.text_content
                ) : (
                  <video width="150" controls>
                    <source
                      src={`https://synamc.com${item.media_url}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </td>

              {/* 🔥 DELETE BUTTON */}
              <td>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ background: "red", color: "white" }}
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
};

export default Adviservislist;
