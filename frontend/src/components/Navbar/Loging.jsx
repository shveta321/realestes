import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Login function called");

    try {
      console.log("Sending request to backend...");

      const res = await fetch("http://localhost:5000/api/loging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response received from server:", res);

      const data = await res.json();
      // console.log("Parsed JSON data:", data);

      if (!res.ok) {
        console.warn("Login failed:", data.message || data.msg);
        alert(data.message || data.msg || "Login failed");
        return;
      }
 
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name); 
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

      alert("Login successful ✅");

    } catch (error) {
      console.error("Login error caught in catch block:", error);
      alert("Server error, try again");
    }
  };



  return (
    <div className="auth-container login">
      <div className="auth-card">
        {/* <h2>Login</h2> */}

        <form onSubmit={handleSubmit}>
          <div className="form-groups">
            <label>Email / Mobile</label>
            <input
              type="text"
              placeholder="Enter email or mobile"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-groups">
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
          <p className="switchs">
            Forgot Password? <Link to="/forgot-password">Reset here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
