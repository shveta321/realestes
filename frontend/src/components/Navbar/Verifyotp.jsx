import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const type = location.state?.type; 

  const handleVerify = async () => {
    const api =
      type === "forgot"
        ? "https://synamc.com/api/verify-forgot-otp"
        : "https://synamc.com/api/verify-register";

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
     if (type === "forgot") {
      navigate("/ResetPassword", { state: { email } });
    } else {
      alert("Signup successful ✅");
      navigate("/loging");
    }

    } else {
      alert(data.msg);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>

        <p>Email: {email}</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default Verifyotp;