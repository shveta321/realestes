import React, { useState } from "react";
// import "./Contact.css";

const Contact = () => {
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message) {
    alert("Please fill required fields!");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok) {
      return alert(data.msg || "Error");
    }

    alert("Message sent successfully ✅");

    setOpen(false);
    setFormData({ name: "", email: "", phone: "", message: "" });

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  return (
    <div className="contact-container">
      <h2 className="contact-title">Get in Touch</h2>
      <p className="contact-sub">Have any queries? We would love to assist you.</p>

      <button className="contact-btn" onClick={() => setOpen(true)}>
        Contact Us
      </button>

      {open && (
        <div className="contact-overlay" onClick={() => setOpen(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Contact Form</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name*"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email*"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone No"
                value={formData.phone}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Message*"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <button type="submit" className="send-btn">Send Message</button>
            </form>

            <span className="close-btn" onClick={() => (false)}>×</span>
          </div>setOpen
        </div>
      )}
    </div>
  );
};

export default Contact;
