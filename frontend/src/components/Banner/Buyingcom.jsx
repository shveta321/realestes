import React from "react";
import { Link } from "react-router-dom";



import buyscom from "../image/buyscom1.webp";
import residentialbuy from "../image/residentialbuy.webp";
import funding from "../image/funding.webp";
// import Ownersproperty from "../image/Ownersproperty.jpg";

const Buyingcom = () => {
  const cardData = [
    {
      title: "Commercial property for sale", desc: "", img: buyscom, link: "/Buyicommproperty",
    },
    { title: "Residential property for sale", desc: "", img: residentialbuy, link: "/Residentialbuye",},
    { title: "PG Rent", desc: "", img: funding, link: "/Pgrentbuying", },
    // { title: "For Owners", desc: "", img: Ownersproperty },
  ];

  return (
    <div className="buying-section">
      <h2 className="section-title">
        Explore Plots/Land in Popular  Delhi/NCR
      </h2>
      <div className="card-container">
        {cardData.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.img} alt={card.title} className="card-img" />
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
            {card.link && (
              <div className="">
                <Link to={card.link} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Buyingcom;
