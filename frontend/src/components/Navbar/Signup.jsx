import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seller",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const res = await fetch("https://synamc.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent 📩");

      // ✅ OTP page par bhejo + email pass karo
      navigate("/Verifyotp", { state: { email: form.email } });

    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="auth-container signup">
      <div className="auth-card">
        {/* <h2>Signup</h2> */}

        <form onSubmit={submitForm}>
          <div className="form-groups">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-groups">
            <label>Mobile Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter mobile number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-groups">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-groups">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-groups">
            <label>Register as</label>
            <div className="buy-sell">
              <select className=" sel-buy"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="seller">Seller</option>
                {/* <option value="buyer">Buyer</option> */}

              </select>
            </div>

          </div>

          <button type="submit" className="sing">Sign up</button>


          {/* ✅ OTP UI yahan add karo */}
          {/* {showOtp && (
            <>
              <div className="form-groups">
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button type="button" onClick={verifyOtpAndRegister}>
                Verify & Complete Signup
              </button>
            </>
          )} */}


          <p className="switchup">
            Already have an account? <Link to="/loging" className="log-btss">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
