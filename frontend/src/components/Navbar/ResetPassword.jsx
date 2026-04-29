import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async () => {
    const res = await fetch("https://synamc.com/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful ✅");
      navigate("/loging");
    } else {
      alert(data.msg);
    }
  };

  return (
        <div className="auth-container">
    <div className="auth-card">
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleReset}>Update Password</button>
    </div>
    </div>
  );
};

export default ResetPassword;