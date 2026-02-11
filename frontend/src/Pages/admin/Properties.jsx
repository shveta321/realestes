import { useEffect, useState } from "react";
import { FaEye, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./admi.css";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const role = localStorage.getItem("role");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/admi/properties", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setProperties(Array.isArray(data) ? data : []);
  };

  const approveProperty = async (id) => {
    await fetch(`http://localhost:5000/admin/property/approve/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchProperties();
  };

  const rejectProperty = async (id) => {
    await fetch(`http://localhost:5000/admin/property/reject/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchProperties();
  };

  const deleteProperty = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:5000/admin/property/delete/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        Swal.fire({ title: "Deleted!", text: "Property has been deleted.", icon: "success" });
        fetchProperties();
      }
    });
  };

  return (
    <div>
      <h2>Properties</h2>

      <table border="2" cellPadding="8" style={{ width: "100%", marginTop: "15px" }}>
        <thead>
          <tr>
            {/* <th>Title</th> */}
            <th>Type</th>
            <th>Subtype</th>
            <th>Description</th>
            <th>Location</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Email</th>
            <th>Status</th>
            {/* <th>Images</th> */}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {properties.map((p) => (
            <tr key={p.id}>
              {/* <td>{p.title}</td> */}
              <td>{p.type}</td>
              <td>{p.subtype}</td>
              <td>{p.description}</td>
              <td>{p.location}</td>
              <td>₹{p.estimated_price}</td>
              <td>{p.seller_name}</td>
              <td>{p.seller_email}</td>
              <td>
                <span style={{
                  padding: "3px 8px",
                  borderRadius: "4px",
                  background:
                    p.status === "approved" ? "lightgreen" :
                    p.status === "rejected" ? "tomato" :
                    "lightgray"
                }}>
                  {p.status}
                </span>
              </td>

              {/* 🔥 Multiple FaEye icons for each image */}
              <td style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                {p.images && p.images.length > 0 ? (
                  p.images.map((img, i) => (
                    <FaEye
                      key={i}
                      onClick={() => setPreview(img)}
                      title={`View Image ${i + 1}`}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                    />
                  ))
                ) : (
                  <span>No Images</span>
                )}
              </td>

              {/* Actions */}
              <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {role === "admin" && p.status === "pending" && (
                  <>
                    <FaCheck onClick={() => approveProperty(p.id)} style={{ cursor: "pointer", color: "green" }} />
                    <FaTimes onClick={() => rejectProperty(p.id)} style={{ cursor: "pointer", color: "orange" }} />
                  </>
                )}
                <FaTrash onClick={() => deleteProperty(p.id)} style={{ cursor: "pointer", color: "red" }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 Image Preview Modal */}
      {preview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={() => setPreview(null)}
        >
          <img
            src={`http://localhost:5000/uploads/${preview}`}
            alt="preview"
            style={{ maxHeight: "90vh", maxWidth: "90vw", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}
