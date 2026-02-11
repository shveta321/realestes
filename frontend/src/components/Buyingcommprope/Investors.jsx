import { useState } from "react";
import "../Buyingcommprope/Buyicommproperty.css";


export default function Investors() {
  const [form, setForm] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/investor/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    alert(data.msg);
  };

  return (
   <form onSubmit={handleSubmit} className="investor-form">
  <h2 className="fom-title">Investor Details</h2>

  <div className="invester-fom">
    <label>Name</label>
    <input name="name" onChange={handleChange} required />
  </div>

  <div className="invester-fom">
    <label>Address</label>
    <input name="address" onChange={handleChange} />
  </div>

  <div className="invester-fom">
    <label>Email</label>
    <input type="email" name="email" onChange={handleChange} />
  </div>

  <div className="invester-fom">
    <label>Phone</label>
    <input name="phone" onChange={handleChange} />
  </div>

  <div className="invester-fom">
    <label>Requirement</label>
    <input name="requirement" onChange={handleChange} />
  </div>

  <div className="invester-fom">
    <label>Ticket Size</label>
    <input name="ticket_size" onChange={handleChange} />
  </div>

  <button type="submit" className="submit-btn">
    Submit
  </button>
</form>

  );
}
