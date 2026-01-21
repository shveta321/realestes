import React from "react";
import banner from "../image/banner5.jpg";
import "../Banner/Homep.css";

const Homepag = () => {
  return (
    <div className="home">

      {/* Banner Section */}
      <section className="hero">
        <img src={banner} alt="Home Banner" className="hero-img" />

        <div className="hero-content">
          <h1>Welcome to<br></br> Syn X Real Estate & Advisory</h1>
          <p>
             Platform for Smart Investments
          </p>
          <button className="hero-btn">Explore Properties</button>
        </div>
      </section>

      {/* About Section */}
      {/* <section className="about">
        <h2>About Us</h2>
        <p>
          We provide end-to-end real estate advisory services including
          distressed assets, IBC properties, legal and financial support.
        </p>
      </section> */}

    </div>
  );
};

export default Homepag;
