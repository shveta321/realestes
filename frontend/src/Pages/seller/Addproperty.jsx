import React, { useState } from "react";
import "./sellerr.css";

const AddProperty = () => {
  const [form, setForm] = useState({
    type: "",
    subtype: "",
    description: "",
    estimated_price: "",
    location: "",
        title: "",

  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle multiple image selection
  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
    e.target.value = null; // allow re-selecting same file
  };

  // Remove single image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await fetch("http://localhost:5000/property/add", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Property Added Successfully!");
        setForm({
          // title: "",
          type: "",
          subtype: "",
          description: "",
          estimated_price: "",
          location: "",
                    title: "",

        });
        setImages([]);
      } else {
        alert(data.message || "Error adding property");
      }

      console.log(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="add-property-container">
      <h2>Add Property</h2>

      <form onSubmit={handleSubmit} className="form">
        {/* <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        /> */}
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="estimated_price"
          placeholder="Price"
          value={form.estimated_price}
          onChange={handleChange}
        />
        {/* <input
          name="type"
          placeholder="Type"
          value={form.type}
          onChange={handleChange}
        /> */}
        <select name="type" onChange={handleChange} required> 
          <option value="">Select Type</option> <option value="plot">Independent House</option> 
          <option value="property">Builder Floor</option> </select>
        {/* <input
          name="subtype"
          placeholder="Subtype"
          value={form.subtype}
          onChange={handleChange}
        /> */}
        <select name="subtype" onChange={handleChange} required> 
          <option value="">Select Subtype</option> 
        <option value="residential">Residential</option>
         <option value="commercial">Commercial</option> </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <label>Upload Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
         
        <div className="image-preview">
          {images.map((img, index) => (
            <div key={index} className="preview-box">
              <span>{img.name}</span>
              <button type="button" onClick={() => removeImage(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>
  <input
          name="title"
          placeholder="Text"
          value={form.title}
          onChange={handleChange}
        /> 
        <button type="submit">Add Property</button>
      </form>
    </div>
  );
};

export default AddProperty;





// import React, { useState } from "react";
// import"./sellerr.css";
// const AddProperty = () => {
//   const [form, setForm] = useState({
//     title: "",
//     type: "",
//     subtype: "",
//     description: "",
//     estimated_price: "",
//     location: "",
//   });

//   const [documents, setDocuments] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//  const handleImageUpload = (e) => {
//   setForm({ ...form, image: e.target.files[0] });
// };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const payload = new FormData();
//     payload.append("title", form.title);
//     payload.append("type", form.type);
//     payload.append("subtype", form.subtype);
//     payload.append("description", form.description);
//     payload.append("estimated_price", form.estimated_price);
//     payload.append("location", form.location);

//     // append docs
//     for (let i = 0; i < documents.length; i++) {
// payload.append("documents", documents[i]);
//     }

// if(form.image){
//    payload.append("images", form.image);
// }

// fetch("http://localhost:5000/property/add", {
//   method: "POST",
//   headers: {
//     Authorization: "Bearer " + localStorage.getItem("token")
//   },
//   body: payload
// })
//       .then((res) => res.json())
//       .then((data) => {
//         alert("Property Added Successfully!");
//         console.log(data);
//       })
//       .catch((err) => console.log(err));
//   };

//   return (
//     <div className="add-property-container">
//       <h2>Add Property</h2>

//       <form className="form" onSubmit={handleSubmit}>
//         <input type="text" name="title" placeholder="Property Title"
//           onChange={handleChange} required />

//         <select name="type" onChange={handleChange} required>
//           <option value="">Select Type</option>
//           {/* <option value="house">House</option> */}
//           <option value="plot">Plot</option>
//           <option value="property">property</option>
//         </select>

//         <select name="subtype" onChange={handleChange} required>
//           <option value="">Select Subtype</option>
//           <option value="residential">Residential</option>
//           <option value="commercial">Commercial</option>
//         </select>

//         <textarea name="description" placeholder="Description"
//           onChange={handleChange} />

//         <input type="number" name="estimated_price"
//           placeholder="Estimated Price" onChange={handleChange} required />

//         <input type="text" name="location"
//           placeholder="Location" onChange={handleChange} required />

// <label>Upload Image</label>
// <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

//         <button type="submit">Add Property</button>
//       </form>
//     </div>
//   );
// };

// export default AddProperty;
