import React, { useState } from "react";
import axios from "axios";
import "./admi.css";

const Advideoadviservices = () => {

  const serviceOptions = [
    "Transaction & Deal Structuring",
    "Income Tax, GST & Stamp Duty",
    "Regulatory & Compliance",
    "Due Diligence & Forensic",
    "Stressed Asset / Insolvency",
    "Virtual CFO for Developers",
    "Insolvency & Distressed Real Estate"
  ];

  const [form, setForm] = useState({
    service_name: "",
     title: "",  
    description: "",
    type: "text",
    textContent: ""
    
  });

  const [file, setFile] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("service_name", form.service_name);
  data.append("title", form.title); 
  data.append("description", form.description);
  data.append("type", form.type);

  if (form.type === "video") {
    data.append("video", file);
  } else {
    data.append("textContent", form.textContent);
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/api/admin/media",
      data
    );

    console.log(res.data);
    alert("Uploaded");
  } catch (err) {
    console.log("ERROR:", err.response?.data); 
  }
};

 return (
  <div className="adv-container">
    <form className="adv-form" onSubmit={handleSubmit}>

      <h2 className="adv-title">Advisory Services</h2>

      <div className="adv-group">
        <select
          className="adv-input"
          value={form.service_name}
          onChange={(e) =>
            setForm({ ...form, service_name: e.target.value })
          }
        >
          <option value="">Select Service</option>
          {serviceOptions.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div className="adv-group">
        <input
          className="adv-input"
          type="text"
          placeholder="Enter Title"
          value={form.title || ""}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />
      </div>

      <div className="adv-group">
        <select
          className="adv-input"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value })
          }
        >
          <option value="text">Text</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="adv-group">
        <textarea
          className="adv-textarea"
          placeholder="Enter Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* Dynamic Field */}
      <div className="adv-group">
        {form.type === "video" ? (
          <>
            <label>Upload Video</label>
            <input
              className="adv-file"
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </>
        ) : (
          <>
            <label>Text Content</label>
            <textarea
              className="adv-textarea"
              placeholder="Enter Text Content"
              value={form.textContent}
              onChange={(e) =>
                setForm({ ...form, textContent: e.target.value })
              }
            />
          </>
        )}
      </div>

      <button className="adv-btn" type="submit">
        Upload
      </button>

    </form>
  </div>
);
};

export default Advideoadviservices;