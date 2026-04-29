import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Header.css";


const ServicePage = () => {
  const { name } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [name]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/advisory/${name}`
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

return (
  <div className="service-container">
    <h2 className="service-title">{decodeURIComponent(name)}</h2>

    {data.length === 0 ? (
      <p>No Data Found</p>
    ) : (
      data.map((item) => (
        <div
          className={`service-card ${
            item.type === "text" ? "full-width" : ""
          }`}
          key={item.id}
        >
          <div className="service-left">
            <h3>{item.title}</h3>
            <p>{item.description}</p>

            {item.type === "text" && (
              <p>{item.text_content}</p>
            )}
          </div>

          {/* RIGHT VIDEO */}
          {item.type === "video" && (
            <div className="service-right">
              <video
                src={`http://localhost:5000${item.media_url}`}
                controls
              />
            </div>
          )}
        </div>
      ))
    )}
  </div>
);
};

export default ServicePage;