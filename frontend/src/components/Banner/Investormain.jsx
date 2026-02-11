import React from "react";
import { Link } from "react-router-dom";
 import investrs from "../image/investrs.webp";

const Investormain = () => {
  const card = {
    title: "Investors",
    desc: "Verified investors connect directly with property sellers to close faster and secure profitable deals.",
    link: "/investors",
  };

  return (
    <div className="advertiser-wrapper">
      <div className="advertiser-card">
        
        {/* LEFT IMAGE */}
         <div className="left-box">
          <img src={investrs} alt="investors" className="invest-img" />
        </div> 

        {/* RIGHT CONTENT */}
        <div className="right-box">
          <h2>{card.title}</h2>
          <p className="sub-text">{card.desc}</p>

          <div className="option">
            <Link to={card.link} className="choose-btn">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investormain;
