import React, { useState} from "react";
import "./Footerpag.css";
import { Link } from "react-router-dom";
// import Freeuplod from "../Banner/Freeuplod";

const Footerpage = () => {
const [, setOpen] = useState(false);

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
                   <li>
                    <Link to="/Investors" onClick={() => setOpen(false)}>
                     Investors
                    </Link>
                  </li>
            <li><Link to="/Freeuplod"> for Seller </Link></li>
            {/* <li>Rent Property</li> */}
          {/* <li><Link to="/Contact">Contact</Link></li> */}
          </ul>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
          <li>
        <Link to="/Residentialbuye" onClick={() => setOpen(false)}>
          Residential
        </Link>
      </li>
              <li>
                    <Link to="/Buyicommproperty" onClick={() => setOpen(false)}>
                      Commercial
                    </Link>
                  </li>
            {/* <li>Plots / Land</li>
            <li>Home Loan</li> */}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📧 pravag3001@gmail.com</p>
          <p>📞 +91 9720108105</p>
                    {/* <li><Link to="/Contact">Contact</Link></li> */}

        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} RealEstate. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footerpage;
