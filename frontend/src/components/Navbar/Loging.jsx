import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/loging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg);
        return;
      }

      // --- Store Auth Info ---
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);


      // --- Navigate By Role ---
      switch (data.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "seller":
          navigate("/seller/dashboard");
          break;
        case "buyer":
          navigate("/");
          break;
        default:
          navigate("/");
      }

      alert("Login Successful!");

    } catch (error) {
      console.log(error);
      alert("Server error, try again");
    }
  };

  return (
    <div className="auth-container login">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email / Mobile</label>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="logi" type="submit">Login</button>

          <p className="switchs">
            Don’t have an account? <Link to="/signup">Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
