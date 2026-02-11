import { useEffect, useState } from "react";
import { FaEye, FaTrash, FaCheck, FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Admproperties() {
  const [properties, setProperties] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // multiple images
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    load();
  }, []);

  // Load properties
  const load = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/properties", {
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
    if (!window.confirm("Delete property?")) return;
    await fetch(`http://localhost:5000/admin/properties/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  // Approve property
  const approveProperty = async (id) => {
    await fetch(`http://localhost:5000/admin/properties/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  // Reject property
  const rejectProperty = async (id) => {
    await fetch(`http://localhost:5000/admin/properties/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  // Toggle property status (optional)
  const toggleStatus = async (id) => {
    await fetch(`http://localhost:5000/admin/properties/${id}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    load();
  };

  // Open image preview modal
  const openPreview = (images) => {
    setPreviewImages(images);
    setCurrentIndex(0);
  };

  // Close modal
  const closePreview = () => {
    setPreviewImages([]);
    setCurrentIndex(0);
  };

  // Navigate carousel
  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? previewImages.length - 1 : prev - 1));
  };
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === previewImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <h2>Admin Properties</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Type</th>
            <th>Subtype</th>
            <th>Description</th>
            <th>Location</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Email</th>
            <th>Status</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {properties.map((p) => (
            <tr key={p.id}>
              <td>{p.type}</td>
              <td>{p.subtype}</td>
              <td>{p.description}</td>
              <td>{p.location}</td>
              <td>₹ {p.price}</td>
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
                  {p.status}
                </span>
              </td>

              <td>
                {p.images?.length > 0 ? (
                  <FaEye
                    onClick={() => openPreview(p.images)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  "No Images"
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Image / Video Preview Modal */}
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

          {previewImages[currentIndex].endsWith(".mp4") ? (
            <video
              src={`http://localhost:5000${previewImages[currentIndex]}`}
              controls
              width="600"
            />
          ) : (
            <img
              src={`http://localhost:5000${previewImages[currentIndex]}`}
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
    </div>
  );
}
