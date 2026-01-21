import React from "react";
import "../Footer/Footerpag.css";

const Footerpage = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>RealEstate</h3>
          <p>
            Find your dream property with ease. Buy, sell & rent properties
            across India.
          </p>
        </div>

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
          <p>Email: support@realestate.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} RealEstate. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footerpage;
