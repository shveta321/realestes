import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
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
        <div className="logo">
          <Link to="/">
            <strong>Syn X</strong>
            <span className="tagline">Real Estate & Advisory Platform</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={`nav ${mobileMenu ? "open" : ""}`}>
          <ul className="navba">
            <li><Link to="/">Home</Link></li>

            <li className="dropdown">
              <span className="dropdown-toggle" onClick={() => setOpen(!open)}>
                Properties ▾
              </span>

              <AnimatePresence>
                {open && (
                  <motion.ul
                    className="dropdown-menu animated-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <li><Link to="/PlotTips">Buying</Link></li>
                    <li><Link to="/properties/private">Private Sale</Link></li>
                    <li><Link to="/properties/residential">Residential</Link></li>
                    <li><Link to="/Commercialtips">Commercial</Link></li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>


            <li><Link to="/advisory">Advisory Services</Link></li>
            <li><Link to="/funding">Funding</Link></li>
            <li><Link to="/channel-partners">For Owners</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
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
              <span className="user-name">Hi, {userName}</span>
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
