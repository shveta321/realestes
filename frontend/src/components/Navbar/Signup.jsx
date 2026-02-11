import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("User registered successfully!");
        console.log("REGISTER RESPONSE:", data);
      } else {
        alert(data.msg || "Registration failed");
      }

    } catch (err) {
      console.log("Error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-container signup">
      <div className="auth-card">
        <h2>Signup</h2>

        <form onSubmit={submitForm}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Register as</label>
            <div className="buy-sell">
              <select className=" sel-buy"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

          </div>

          <button type="submit" className="sing">Signup</button>

          <p className="switchup">
            Already have an account? <Link to="/loging" className="log-btss">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
