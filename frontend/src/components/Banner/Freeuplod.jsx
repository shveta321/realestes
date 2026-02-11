import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Banner/Homep.css";
import buyers from "../image/propi1.webp";

const Freeuplod = () => {
  const [userName, setUserName] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
  };

  return (
    <section className="free-wrapper">

      <div className="free-imcard">
        <img src={buyers} alt="Sell Property" />
      </div>

      <div className="free-textcards">
        <h1>Sell or rent faster at the right price!</h1>
        <p>Your perfect buyer is waiting, list your property now</p>

        <h4 to="/post-property" className="btn-main">
          Post Property, It's FREE
        </h4>

        <div className="auth-section">
          {!userName ? (
            <>
              <Link to="/Loging" className="btn-outline">Login</Link>
              <Link to="/Signup" className="btn-outline">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <span>{userName}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default Freeuplod;
