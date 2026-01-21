import React, { useState } from "react";
import"./sellerr.css";
const AddProperty = () => {
  const [form, setForm] = useState({
    title: "",
    type: "",
    subtype: "",
    description: "",
    estimated_price: "",
    location: "",
  });

  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileUpload = (e) => {
    setDocuments(e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("type", form.type);
    payload.append("subtype", form.subtype);
    payload.append("description", form.description);
    payload.append("estimated_price", form.estimated_price);
    payload.append("location", form.location);

    // append docs
    for (let i = 0; i < documents.length; i++) {
      payload.append("documents", documents[i]);
    }

    fetch("http://localhost:5000/property/add", {
      method: "POST",
      body: payload,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Property Added Successfully!");
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="add-property-container">
      <h2>Add Property</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Property Title"
          onChange={handleChange} required />

        <select name="type" onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="house">House</option>
          <option value="plot">Plot</option>
          <option value="apartment">Apartment</option>
        </select>

        <select name="subtype" onChange={handleChange} required>
          <option value="">Select Subtype</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
        </select>

        <textarea name="description" placeholder="Description"
          onChange={handleChange} />

        <input type="number" name="estimated_price"
          placeholder="Estimated Price" onChange={handleChange} required />

        <input type="text" name="location"
          placeholder="Location" onChange={handleChange} required />

        <label>Upload Documents (PDF / Images)</label>
        <input type="file" multiple onChange={handleFileUpload} />

        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;
