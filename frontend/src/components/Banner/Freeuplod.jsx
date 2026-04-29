import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Banner/Homep.css";
import buyers from "../image/propi1.webp";

const Freeuplod = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserName(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
  };

  return (
    <section className="free-wrapper">
      <div className="free-container">

        {/* Image Card */}
        <div className="free-imcard cards">
          <img src={buyers} alt="Sell Property" />
        </div>

        {/* Text Card */}
        <div className="free-textcards cards">
          <h1>Sell faster at the best price !</h1>
          <p>Your perfect buyer is waiting, list your property now (Residential,Commercial,Land)</p>

          <Link to="" className="btn-main">
            Post Property, It's FREE
          </Link>

          <div className="auth-section">
            {!userName ? (
              <>
                <Link to="/Loging" className="btn-outline">Login</Link>
                <Link to="/Signup" className="btn-outline">Sign Up</Link>
              </>
            ) : (
              <div className="user-menu">
                <span>Welcome, {userName}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Freeuplod;