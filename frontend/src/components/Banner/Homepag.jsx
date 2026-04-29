import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import banner from "../image/banner5.jpg";
import "../Banner/Homep.css";

const Homepag = () => {

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("buy");

  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchText) {
      alert("Enter location");
      return;
    }

    const text = searchText.toLowerCase();

    //  Direct property_type search
    if (text.includes("commercial")) {
      navigate(`/Buyicommproperty?location=${searchText}`);
      return;
    }

    if (text.includes("residential")) {
      navigate(`/Residentialbuye?location=${searchText}`);
      return;
    }

    // 👉 Normal tab logic
    if (activeTab === "buy") {
      navigate(`/Residentialbuye?location=${searchText}`);
    }
    else if (activeTab === "commercial") {
      navigate(`/Buyicommproperty?location=${searchText}`);
    }
    else if (activeTab === "rent") {
      navigate(`/Residentialbuye?location=${searchText}&type=rent`);
    }
    else if (activeTab === "plots") {
      navigate(`/Residentialbuye?location=${searchText}&type=plot`);
    }
  };
  return (
    <div className="home">
      <section className="hero">

        <motion.img
          src={banner}
          alt="Home Banner"
          className="hero-img"
        />

        <motion.div className="hero-content">

          <div className="search-wrapper">

            {/* Tabs */}
            <div className="tabs">
              <span className={activeTab === "buy" ? "active" : ""} onClick={() => setActiveTab("buy")}>Buy</span>
              {/* <span className={activeTab === "rent" ? "active" : ""} onClick={() => setActiveTab("rent")}>Renting</span> */}
              <span
                className={activeTab === "commercial" ? "active" : ""}
                onClick={() => {
                  setActiveTab("commercial");
                  navigate("/Buyicommproperty");
                }}
              >
                Commercial
              </span>
              <span
                className={activeTab === "residential" ? "active" : ""}
                onClick={() => {
                  setActiveTab("residential");
                  navigate("/Residentialbuye");
                }}
              >
                Residential
              </span>              <span className={activeTab === "plots" ? "active" : ""} onClick={() => setActiveTab("plots")}>Plots</span>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <button onClick={handleSearch}>Search</button>

          </div>

        </motion.div>
      </section>
    </div>
  );
};

export default Homepag;