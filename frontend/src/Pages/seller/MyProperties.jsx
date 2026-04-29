import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye,FaTrash, } from "react-icons/fa";


export default function MyProperties() {
  const [list, setList] = useState([]);
  // const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");

  const [previewImages, setPreviewImages] = useState([]); // multiple images
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editId, setEditId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [editData, setEditData] = useState({});
   const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const startEdit = (p) => {
    let parts = [];

    if (p.location && typeof p.location === "string") {
      parts = p.location.split(",");

    }
    // const locParts = p.location?.split(",") || [];

    setEditId(p.id);
    setEditData({
      property_type: p.property_type,
      property_subtype: p.property_subtype,
      expected_price: p.expected_price,
      description: p.description,
      city: parts[0]?.trim() || "",
      locality: parts[1]?.trim() || "",
      sub_locality: parts[2]?.trim() || "",
      society: parts[3]?.trim() || "",
      house_no: parts[4]?.trim() || "",
      pincode: p.pincode,

      bhk: p.bhk,
      bathrooms: p.bathrooms,
      balconies: p.balconies,

      carpet_area: p.carpet_area,
      builtup_area: p.builtup_area,
      super_builtup_area: p.super_builtup_area,
      area_unit: p.area_unit,

      floor_no: p.floor_no,
      total_floors: p.total_floors,

      furnishing: p.furnishing,
      availability_status: p.availability_status,
      ownership: p.ownership,
      property_age: p.property_age,
      washrooms: p.washrooms,
      distressed: p.distressed,

    });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const openPreview = (images) => {
    setPreviewImages(images);
    setCurrentIndex(0);
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);
  const saveEdit = async (id) => {
    await fetch(`https://synamc.com/api/admin/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    setEditId(null);
    fetchMyProperties(); // reload data
  };
const deleteProperty = async (id) => {
  if (!window.confirm("Delete property")) return;

  const res = await fetch(
    `https://synamc.com/api/seller/properties/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const data = await res.json();
  console.log(data);

  // UI update (important)
  setProperties(prev => prev.filter(item => item.id !== id));
};

 const filteredProperties = list.filter((p) => {
  const text = search.toLowerCase();

  return (
    String(p.property_type || "").toLowerCase().includes(text) ||
    String(p.property_subtype || "").toLowerCase().includes(text) ||
    String(p.location || "").toLowerCase().includes(text) ||
    String(p.description || "").toLowerCase().includes(text) ||
    String(p.seller_email || "").toLowerCase().includes(text) ||
    String(p.seller_name || "").toLowerCase().includes(text) ||

    String(p.pincode || "").toLowerCase().includes(text) ||
    String(p.bhk || "").toLowerCase().includes(text) ||
    String(p.bathrooms || "").toLowerCase().includes(text) ||
    String(p.balconies || "").toLowerCase().includes(text) ||
    String(p.carpet_area || "").toLowerCase().includes(text) ||
    String(p.builtup_area || "").toLowerCase().includes(text) ||
    String(p.super_builtup_area || "").toLowerCase().includes(text) ||
    String(p.area_unit || "").toLowerCase().includes(text) ||
    String(p.floor_no || "").toLowerCase().includes(text) ||
    String(p.total_floors || "").toLowerCase().includes(text) ||
    String(p.furnishing || "").toLowerCase().includes(text) ||
    String(p.availability_status || "").toLowerCase().includes(text) ||
    String(p.ownership || "").toLowerCase().includes(text) ||
    String(p.property_age || "").toLowerCase().includes(text) ||
    String(p.washrooms || "").toLowerCase().includes(text) ||
    String(p.distressed || "").toLowerCase().includes(text)
  );
});
const currentProperties = filteredProperties.slice(
  indexOfFirstRow,
  indexOfLastRow
);

  const fetchMyProperties = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/seller/properties",
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
      
      <input
        type="text"
        placeholder="Search property..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
        
      {list.length === 0 ? (
        <p>No properties uploaded yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              {/* <th>Title</th> */}
              <th>Type</th>
              <th>Subtype</th>
              {/* <th>Price</th> */}
              <th>Location</th>
              <th>Description</th>

              <th>Pincode</th>
              <th>Price</th>
              <th>Price/Sqft</th>
              <th>BHK</th>
              <th>Bathrooms</th>
              <th>Balconies</th>
              <th>Carpet Area</th>
              <th>Builtup Area</th>
              <th>Super Builtup</th>
              <th>Area Unit</th>
              <th>Floor No</th>
              <th>Total Floors</th>
              <th>Furnishing</th>
              <th>Availability</th>
              <th>Ownership</th>
              <th>Property Age</th>
              <th>Washrooms</th>
              <th>Distressed</th>
              <th>Images</th>
              <th>Status</th>
              <th>Date</th>
                          <th>Delete</th>
              <th>Edit</th>

            </tr>
          </thead>

          <tbody>
           {currentProperties.map((p) => (
              <tr key={p.id}>
                <td>
                  {editId === p.id ? (
                    <input name="property_type" value={editData.property_type || ""} onChange={handleChange} />
                  ) : p.property_type}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="property_subtype" value={editData.property_subtype || ""} onChange={handleChange} />
                  ) : p.property_subtype}
                </td>
                <td>
                  {editId === p.id ? (
                    <>
                      <input name="city" value={editData.city || ""} onChange={handleChange} placeholder="City" />
                      <input name="locality" value={editData.locality || ""} onChange={handleChange} placeholder="Locality" />
                      <input name="sub_locality" value={editData.sub_locality || ""} onChange={handleChange} placeholder="Sub Locality" />
                      <input name="society" value={editData.society || ""} onChange={handleChange} placeholder="Society" />
                      <input name="house_no" value={editData.house_no || ""} onChange={handleChange} placeholder="House No" />
                    </>
                  ) : (
                    p.location
                  )}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="description" value={editData.description || ""} onChange={handleChange} />
                  ) : p.description}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="pincode" value={editData.pincode || ""} onChange={handleChange} />
                  ) : p.pincode}
                </td>

                <td>
                  {editId === p.id ? (
                    <input name="expected_price" value={editData.expected_price || ""} onChange={handleChange} />
                  ) : `₹ ${p.expected_price}`}
                </td>

                <td>
                  {editId === p.id ? (
                    <input name="price_per_sqft" value={editData.price_per_sqft || ""} onChange={handleChange} />
                  ) : p.price_per_sqft}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="bhk" value={editData.bhk || ""} onChange={handleChange} />
                  ) : p.bhk}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="bathrooms" value={editData.bathrooms || ""} onChange={handleChange} />
                  ) : p.bathrooms}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="balconies" value={editData.balconies || ""} onChange={handleChange} />
                  ) : p.balconies}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="carpet_area" value={editData.carpet_area || ""} onChange={handleChange} />
                  ) : p.carpet_area}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="builtup_area" value={editData.builtup_area || ""} onChange={handleChange} />
                  ) : p.builtup_area}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="super_builtup_area" value={editData.super_builtup_area || ""} onChange={handleChange} />
                  ) : p.super_builtup_area}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="area_unit" value={editData.area_unit || ""} onChange={handleChange} />
                  ) : p.area_unit}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="floor_no" value={editData.floor_no || ""} onChange={handleChange} />
                  ) : p.floor_no}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="total_floors" value={editData.total_floors || ""} onChange={handleChange} />
                  ) : p.total_floors}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="furnishing" value={editData.furnishing || ""} onChange={handleChange} />
                  ) : p.furnishing}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="availability_status" value={editData.availability_status || ""} onChange={handleChange} />
                  ) : p.availability_status}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="ownership" value={editData.ownership || ""} onChange={handleChange} />
                  ) : p.ownership}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="property_age" value={editData.property_age || ""} onChange={handleChange} />
                  ) : p.property_age}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="washrooms" value={editData.washrooms || ""} onChange={handleChange} />
                  ) : p.washrooms}
                </td>
                <td>
                  {editId === p.id ? (
                    <input name="distressed" value={editData.distressed || ""} onChange={handleChange} />
                  ) : p.distressed}
                </td>
                <td>
                  {Array.isArray(p.media) && p.media.length > 0 ? (
                    <FaEye
                      onClick={() => openPreview(p.media)}
                      style={{
                        cursor: "pointer",
                        color: "blue",
                        fontSize: "20px"
                      }}
                    />
                  ) : (
                    <span style={{ color: "gray" }}>No Images</span>
                  )}
                </td>
                <td>
                  {p.status === "pending" && <span className="badge yellow">Pending</span>}
                  {p.status === "approved" && <span className="badge green">Approved</span>}
                  {p.status === "rejected" && <span className="badge red">Rejected</span>}
                </td>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                             
                                <FaTrash
                                  onClick={() => deleteProperty(p.id)}
                                  style={{ cursor: "pointer" }}
                                />
                              </td>
                              
                <td>
                  {editId === p.id ? (
                    <>
                      <button onClick={() => saveEdit(p.id)}>Save</button>
                      <button onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(p)}>Edit</button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      )}
      {previewImages.length > 0 && (
        <div
          onClick={() => setPreviewImages([])}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          {previewImages[currentIndex]?.endsWith(".mp4") ? (
            <video
              src={`https://synamc.com${previewImages[currentIndex]}`}
              controls
              width="600"
            />
          ) : (
            <img
              src={`https://synamc.com${previewImages[currentIndex]}`}
              alt="preview"
              width="600"
            />
            
          )}
          
        </div>
      )}
       <div style={{ marginTop: "15px" }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ marginRight: "10px" }}
        >
          Prev
        </button>

<span>
  Page {currentPage} of {Math.ceil(filteredProperties.length / rowsPerPage)}
</span>
<button
  onClick={() =>
    setCurrentPage(
      currentPage < Math.ceil(filteredProperties.length / rowsPerPage)
        ? currentPage + 1
        : currentPage
    )
  }
  disabled={currentPage === Math.ceil(filteredProperties.length / rowsPerPage)}
>
  Next
</button>
      </div>
    </div>
  );
}
