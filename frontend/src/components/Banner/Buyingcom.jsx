import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import buyscom from "../image/buyscom1.webp";
import residentialbuy from "../image/residentialbuy.webp";
import funding from "../image/funding.webp";

import "./Homep.css";

const Buyingcom = () => {
  const cardData = [
    {
      title: "Commercial property for sale",
      desc: "",
      img: buyscom,
      link: "/Buyicommproperty",
    },
    {
      title: "Residential property for sale",
      desc: "",
      img: residentialbuy,
      link: "/Residentialbuye",
    },
    {
      title: "PG Rent",
      desc: "",
      img: funding,
      link: "/Pgrentbuying",
    },
  ];

  return (
    <div className="buying-section">
      {/* Animated Heading */}
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Explore Plots / Land in Popular Delhi / NCR
      </motion.h2>

      <div className="card-container">
        {cardData.map((card, index) => (
          <motion.div
            className="card"
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true }}
          >
            <img src={card.img} alt={card.title} className="card-img" />
            <h3>{card.title}</h3>
            <p>{card.desc}</p>

            {card.link && (
              <Link to={card.link} className="btn btn-outline">
                View Details
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Buyingcom;
