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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Optional validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill required fields!");
      return;
    }

    console.log("FORM SUBMITTED: ", formData);

    // === backend ke liye ===
    // fetch("http://localhost:5000/contact", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });

    alert("Message sent successfully!");

    // popup close + form reset
    setOpen(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
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

            <span className="close-btn" onClick={() => setOpen(false)}>×</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
