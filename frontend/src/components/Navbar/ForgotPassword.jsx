import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    const res = await fetch("https://synamc.com/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent ✅");

      navigate("/Verifyotp", {
        state: { email, type: "forgot" },
      });
    } else {
      alert(data.msg);
    }
  };

  return (
    <div className="auth-container">
    <div className="auth-card">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSendOtp}>Send OTP</button>
    </div>
    </div>
  );
};

export default ForgotPassword;