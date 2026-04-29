import React, { useEffect, useState } from "react";
import axios from "axios";

const Adviservices = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("https://synamc.com/api/admin/media");
    setData(res.data);
  };

  return (
    <div>
      <h2>Advisory Services</h2>

      {data.map((item) => (
        <div key={item.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          
          <h3>{item.title}</h3>
          <p>{item.description}</p>

          {/* 🔥 TYPE BASED DISPLAY */}
          {item.type === "text" ? (
            <p>{item.text_content}</p>
          ) : (
            <video width="300" controls>
              <source
                src={`https://synamc.com${item.media_url}`}
                type="video/mp4"
              />
            </video>
          )}

        </div>
      ))}
    </div>
  );
};

export default Adviservices;