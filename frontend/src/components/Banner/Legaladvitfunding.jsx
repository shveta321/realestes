import React from "react";
// import "./TwoCards.css";


import legaladvice from "../image/legaladvice.jpg";
import funding1 from "../image/funding.webp";

const Legaladvitfunding = () => {
  const cards = [
    {
      title: "Legal advisory ", 
      desc: "Find verified best price.",
      img: legaladvice,
    },
    {
      title: "funding services",
      desc: "Explore .",
      img: funding1,
    },
  ];

  return (
    <div className="legaladvitfunding-section">
      <h2 className="legaladvitfunding-title">Provide advisory and funding services integration</h2>

      <div className="legaladvitfunding-container">
        {cards.map((card, index) => (
          <div className="legaladvitfunding-card" key={index}>
            <img
              src={card.img}
              alt={card.title}
              className="legaladvitfunding-img"
            />

            <div className="legaladvitfunding-content">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <button className="legaladvitfunding-btn">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legaladvitfunding;
