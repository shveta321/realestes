import React from "react";
import "./Footerpag.css";

const Footerpage = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-col brand">
          <h2>🏠 RealEstate</h2>
          <p>
            Find your dream property with ease. Buy, sell & rent verified
            properties across India.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li>Buy Property</li>
            <li>Sell Property</li>
            <li>Rent Property</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li>Residential</li>
            <li>Commercial</li>
            <li>Plots / Land</li>
            <li>Home Loan</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📧 support@realestate.com</p>
          <p>📞 +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} RealEstate. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footerpage;
