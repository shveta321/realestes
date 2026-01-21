import React from "react";
// import "./Ownersbuy.css";
import { Link } from "react-router-dom";


import Ownersproperty from "../image/Ownersproperty.jpg";

const Ownersbuy = () => {
  const card = {
    title: "For Property Owners",
    desc: "Sell or rent your property faster with verified buyers and premium listing support.",
    img: Ownersproperty,
     link: "/Buyicommproperty",
  };

  return (
    <div className="ownersbuy-section">
      <h2 className="ownersbuy-title">Property for Owners</h2>

      <div className="ownersbuy-card">
        <img src={card.img} alt="Owner Property" className="ownersbuy-img" />

        <div className="ownersbuy-content">
          <h3>{card.title}</h3>
          <p>{card.desc}</p>
          {/* <button className="ownersbuy-btn">Get Started</button> */}
           {card.link && (
              <div className="">
                <Link to={card.link} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            )}
        </div>
        
      </div>
      
    </div>
  );
};

export default Ownersbuy;
