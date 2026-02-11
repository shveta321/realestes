import React, { useState } from "react";
import "../Buyingcommprope/Buyicommproperty.css";

const Buyerleadform = ({ property, onClose }) => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        reason: "investment",
        isDealer: "no",
        timeToBuy: "3months",
        homeLoan: "1 : 0",
        agree: "1 : 0",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.agree) {
    alert("Please accept Terms & Conditions!");
    return;
  }

  if (!property?.id) {
    alert("Property ID missing");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/buyer-leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        property_id: property.id,
        name: form.name.trim(),
        phone: form.phone.trim(),
        reason: form.reason,
        isDealer: form.isDealer,
        timeToBuy: form.timeToBuy,
        homeLoan: form.homeLoan ? 1 : 0,
        siteVisit: form.siteVisit ? 1 : 0
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Something went wrong");
      return;
    }

    alert("Lead submitted successfully ✅");
    onClose();

  } catch (err) {
    console.error("Frontend error:", err);
    alert("Server error");
  }
};


    return (
        <div className="modal-overlay">
            <div className="modal-box big">

                <button className="close-btn" onClick={onClose}>×</button>

                <h3>You are requesting to view advertiser details</h3>

                {/* 🔹 PROPERTY DETAILS (SAME LOGIC) */}
                <div className="ad-details">
                    <div className="from-datail-pos">
                        <div className="post-det">
                            <p><strong>POSTED BY:</strong> Dealer</p>
                            <p>📞 +91 98***543**</p>
                        </div>
                        <div className="post-det">
                            <p><strong>POSTED ON:</strong> 08 Jan 2026</p>
                            <p>
                                 <strong>
                                    ₹{property?.estimated_price}
                                </strong>
                                {/* <strong>
                                    ₹{property?.estimated_price} | {property?.size} | {property?.bhk}
                                </strong> */}
                            </p>
                        </div>
                    </div>


                </div>
<h4>Please fill in your details to be shared with this advertiser only.</h4>
                <h4>BASIC INFORMATION</h4>

                <form onSubmit={handleSubmit}>
                    <div className="buye-detals">
                        <div className="main-basic">

                            <label>Your reason to buy:</label>
                            <div className="radio-groupss">
                                <label>
                                    Investment
                                    <input
                                        type="radio"
                                        name="reason"
                                        value="investment"
                                        checked={form.reason === "investment"}
                                        onChange={handleChange}
                                    />

                                </label>
                                <label>
                                    Self Use
                                    <input
                                        type="radio"
                                        name="reason"
                                        value="selfuse"
                                        onChange={handleChange}
                                    />
                                </label>
                            </div>
                            <label>Are you a Property Dealer?</label>
                            <div className="radio-groupss">
                                <label className="Text-lab">
                                    Yes

                                    <input
                                        type="radio"
                                        name="isDealer"
                                        value="yes"
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    No
                                    <input
                                        type="radio"
                                        name="isDealer"
                                        value="no"
                                        checked={form.isDealer === "no"}
                                        onChange={handleChange}
                                    />

                                </label>
                            </div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                required
                                onChange={handleChange}
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                required
                                onChange={handleChange}
                            />
                            {/* <small>This number will be verified</small> */}

                        </div>
                        <div>

                            <label>By when you are planning to buy?</label>
                            <select name="timeToBuy" onChange={handleChange}>
                                <option value="3months">3 Months</option>
                                <option value="6months">6 Months</option>
                                <option value="more">More than 6 Months</option>
                            </select>
                            <div>
                                <label className="checkbox">
                                    <input type="checkbox" name="homeLoan" onChange={handleChange} />
                                    Interested in Home Loan
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" name="siteVisit" onChange={handleChange} />
                                    Interested in Site Visit
                                </label>

                                <label className="checkbox">
                                    <input type="checkbox" name="agree" onChange={handleChange} />
                                    I agree to Terms & Conditions
                                </label>
                            </div>


                            <button type="submit" className="submit-btnss">
submit                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Buyerleadform;
