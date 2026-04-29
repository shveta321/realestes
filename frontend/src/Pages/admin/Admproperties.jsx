import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";


export default function Admproperties() {
  const [properties, setProperties] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // multiple images
  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentProperties = properties.slice(indexOfFirstRow, indexOfLastRow);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (p) => {
    const locParts = p.location?.split(",") || [];

    setEditId(p.id);
    setEditData({
      property_type: p.property_type,
      property_subtype: p.property_subtype,
      expected_price: p.expected_price,
      description: p.description,
      // locality: p.location?.split(",")[0] || "",
      city: locParts[4]?.trim() || "",
      locality: locParts[3]?.trim() || "",
      sub_locality: locParts[2]?.trim() || "",
      society: locParts[1]?.trim() || "",
      house_no: locParts[0]?.trim() || "",
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

  const saveEdit = async (id) => {
    await fetch(`https://synamc.com/api/admin/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    setEditId(null);
    load(); // reload data
  };

  useEffect(() => {
    load();
  }, []);

  // const [search, setSearch] = useState("");

  // ✅ FILTER (dynamic)
  const filteredProperties = properties.filter((p) => {
    const text = search.toLowerCase();

    return (
      p.type?.toLowerCase().includes(text) ||
      p.subtype?.toLowerCase().includes(text) ||
      // p.locality?.toLowerCase().includes(text) ||
      p.description?.toLowerCase().includes(text) ||
      p.seller_email?.toLowerCase().includes(text) ||
      p.seller_name?.toLowerCase().includes(text) ||
      p.location?.toLowerCase().includes(text) ||
      p.pincode?.toLowerCase().includes(text) ||
      p.bhk?.toLowerCase().includes(text) ||
      p.bathrooms?.toLowerCase().includes(text) ||
      p.balconies?.toLowerCase().includes(text) ||
      p.carpet_area?.toLowerCase().includes(text) ||
      p.builtup_area?.toLowerCase().includes(text) ||
      p.super_builtup_area?.toLowerCase().includes(text) ||
      p.area_unit?.toLowerCase().includes(text) ||
      p.floor_no?.toLowerCase().includes(text) ||
      p.total_floors?.toLowerCase().includes(text) ||
      p.furnishing?.toLowerCase().includes(text) ||
      p.availability_status?.toLowerCase().includes(text) ||
      p.ownership?.toLowerCase().includes(text) ||
      p.property_age?.toLowerCase().includes(text) ||
      p.washrooms?.toLowerCase().includes(text) ||
      p.distressed?.toLowerCase().includes(text)

    
    );
  });

  const currentProperties = filteredProperties.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  // Load properties
  const load = async () => {
    try {
      const res = await fetch("https://synamc.com/api/admin/properties", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin load error:", err);
      setProperties([]);
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    if (!window.confirm("Delete property")) return;
    await fetch(`https://synamc.com/api/admin/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };
  const approveProperty = async (id) => {
    await fetch(`https://synamc.com/api/admin/properties/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };
  const rejectProperty = async (id) => {
    await fetch(`https://synamc.com/api/admin/properties/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };
  const toggleStatus = async (id) => {
    await fetch(`https://synamc.com/api/admin/properties/${id}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  const openPreview = (images) => {
    setPreviewImages(images);
    setCurrentIndex(0);
  };
  const closePreview = () => {
    setPreviewImages([]);
    setCurrentIndex(0);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
  };

  return (

    <div className="table-container">

      <h2>Admin Properties</h2>
      <input
        type="text"
        placeholder="Search by type, location, seller..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />
      <table className="custom-table" border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Subtype</th>
            <th>Looking</th>
            <th>Description</th>
            <th> Location </th>
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
            {/* <th>Status (Edit)</th> */}
            <th>Seller Name</th>
            <th>Seller Email</th>
            <th>Status Toggle</th>
            <th>Images</th>
            <th>Approve/Reject/Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentProperties.map((p) => (
            <tr key={p.id}>

              <td>{p.id}</td>
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
                  <input name="looking_to" value={editData.looking_to || ""} onChange={handleChange} />
                ) : p.looking_to}
              </td>
              <td>
                {editId === p.id ? (
                  <input name="description" value={editData.description || ""} onChange={handleChange} />
                ) : p.description}
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

              {/* STATUS */}
              {/* <td>
                {editId === p.id ? (
                  <input name="status" value={editData.status || ""} onChange={handleChange} />
                ) : p.status}
              </td> */}
              <td>{p.seller_name}</td>
              <td>{p.seller_email}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background:
                      p.status === "approved"
                        ? "lightgreen"
                        : p.status === "rejected"
                          ? "tomato"
                          : "lightgray",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleStatus(p.id)}
                >

                  {p.status || "pending"}
                </span>

              </td>

              <td>
                {Array.isArray(p.media) && p.media.length > 0 ? (
                  <FaEye
                    onClick={() => {
                      console.log("MEDIA DATA:", p.media); // debug
                      openPreview(p.media);
                    }}
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
                {p.status === "pending" && (
                  <>
                    <FaCheck
                      onClick={() => approveProperty(p.id)}
                      style={{ cursor: "pointer", marginRight: "4px" }}
                    />
                    <FaTimes
                      onClick={() => rejectProperty(p.id)}
                      style={{ cursor: "pointer", marginRight: "4px" }}
                    />
                  </>
                )}
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

      {previewImages.length > 0 && (
        <div
          onClick={closePreview}
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
          <button
            onClick={prevImage}
            style={{
              position: "absolute",
              left: "20px",
              fontSize: "30px",
              color: "white",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaArrowLeft />
          </button>

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
              onError={(e) => (e.target.src = "/default.png")}
            />
          )}

          <button
            onClick={nextImage}
            style={{
              position: "absolute",
              right: "20px",
              fontSize: "30px",
              color: "white",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaArrowRight />
          </button>
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
          Page {currentPage} of {Math.ceil(properties.length / rowsPerPage)}
        </span>

        <button
          onClick={() =>
            setCurrentPage(
              currentPage < Math.ceil(properties.length / rowsPerPage)
                ? currentPage + 1
                : currentPage
            )
          }
          disabled={currentPage === Math.ceil(properties.length / rowsPerPage)}
          style={{ marginLeft: "10px" }}
        >
          Next
        </button>
      </div>
    </div>
    
  );
}
