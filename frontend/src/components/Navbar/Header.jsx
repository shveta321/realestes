import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Header.css";
import prologos from "../image/prologos.png";
// import Freeuplod from "../Banner/Freeuplod";

const Header = () => {
  // const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userName, setUserName] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUserName(null);
    navigate("/");
  };


  return (
    <motion.header
      className="header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-h">

        {/* Logo */}
        <Link to="/">
          <img src={prologos} alt="Syn X Logos" className="site-logo" />

          {/* <div className="logo-text">
      <strong>Syn X</strong>
      <span className="tagline">Real Estate & Advisory Platform</span>
    </div> */}
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav ${mobileMenu ? "open" : ""}`}>

          <span className="close-btn" onClick={() => setMobileMenu(false)}>×</span>
          <ul className="navba">

            <li><Link to="/">Home</Link></li>

            {/* BUY */}
            <li className="dropdown">
              <span className="dropdown-toggle">Buy ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/Residentialbuye">Residential</Link></li>
                <li><Link to="/Buyicommproperty">Commercial</Link></li>
                {/* <li><Link to="/Distressed Assets">Distressed Assets</Link></li> */}

                <li><Link to="/LandPlot">Land / Plot</Link></li>

              </ul>
            </li>
            {/* <li><Link to="/Freeuplod">Sell</Link></li> */}
            <li className="dropdown">
              <span className="dropdown-toggle">Sell ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/Freeuplod">Residential</Link></li>
                <li><Link to="/Freeuplod">Commercial</Link></li>
                <li><Link to="/Freeuplod"> Land/Plot</Link></li>
              </ul>
            </li>
            {/* RENTING */}
            {/* <li className="dropdown">
              <span className="dropdown-toggle">Renting ▾</span>
              <ul className="dropdown-menu">
                <li><Link to="/villa">Villa</Link></li>
                <li><Link to="/house">House</Link></li>
                <li><Link to="/pg">PG</Link></li>
              </ul>
            </li> */}

            {/* ADVISORY */}
            <li className="dropdown">
              <span className="dropdown-toggle">Advisory ▾</span>
              <ul className="dropdown-menu big-menu">
                {/* <li><Link>Transaction & Deal Structuring</Link></li> */}
                 <li>
      <Link to="/service/Transaction%20%26%20Deal%20Structuring">
        Transaction & Deal Structuring
      </Link>
    </li>
                {/* <li><Link>Income Tax, GST & Stamp Duty</Link></li> */}
                 <li>
       <Link to="/service/Income%20Tax,%20GST%20%26%20Stamp%20Duty">
         Income Tax, GST & Stamp Duty
       </Link>
    </li>
    
                {/* <li><Link>Regulatory & Compliance</Link></li> */}
                 <li>
     <Link to="/service/Regulatory%20%26%20Compliance">
       Regulatory & Compliance
     </Link>
     </li>
                {/* <li><Link>Due Diligence & Forensic</Link></li> */}
                  <li>
    <Link to="/service/Due%20Diligence%20%26%20Forensic">
      Due Diligence & Forensic
     </Link>
     </li>
                <li><Link>Stressed Asset / Insolvency</Link></li>
                <li><Link>Virtual CFO for Developers</Link></li>
                <li><Link>Insolvency & Distressed Real Estate</Link></li>
              </ul>
            </li>
            {/* FINANCING */}
            {/* <li className="dropdown">
              <span className="dropdown-toggle">Financing ▾</span>
              <ul className="dropdown-menu">
                <li><Link>Fund Raising & Structured Finance</Link></li>
                <li><Link>Project Finance & Monitoring</Link></li>
              </ul>
            </li> */}

            {/* CROWD FUNDING */}
            {/* <li className="dropdown">
              <span className="dropdown-toggle">Crowd Funding ▾</span>
              <ul className="dropdown-menu">
                <li><Link>Real Estate Valuation</Link></li>
                <li><Link>Investment Advisory</Link></li>
                <li><Link>Investment in Distressed Properties</Link></li>
              </ul>
            </li> */}

            <li><Link to="/investors">Investors</Link></li>

          </ul>
        </nav>

        {/* Auth */}
        <div className="auth">
          {!userName ? (
            <>
              <Link to="/Loging" className="btn-outline">Login</Link>
              <Link to="/Signup" className="btn-primary">Sign Up</Link>
            </>
          ) : (
            <div className="user-menu">
              <span className="user-name"> {userName}</span>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="hamburger" onClick={() => setMobileMenu(!mobileMenu)}>
          ☰
        </div>

      </div>
    </motion.header>
  );
};

export default Header;






  // <ul className="dropdown-menu big-menu">
  //   <li>
  //     <Link to="/service/Transaction%20%26%20Deal%20Structuring">
  //       Transaction & Deal Structuring
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Income%20Tax,%20GST%20%26%20Stamp%20Duty">
  //       Income Tax, GST & Stamp Duty
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Regulatory%20%26%20Compliance">
  //       Regulatory & Compliance
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Due%20Diligence%20%26%20Forensic">
  //       Due Diligence & Forensic
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Stressed%20Asset%20/%20Insolvency">
  //       Stressed Asset / Insolvency
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Virtual%20CFO%20for%20Developers">
  //       Virtual CFO for Developers
  //     </Link>
  //   </li>

  //   <li>
  //     <Link to="/service/Insolvency%20%26%20Distressed%20Real%20Estate">
  //       Insolvency & Distressed Real Estate
  //     </Link>
  //   </li>
  // </ul>